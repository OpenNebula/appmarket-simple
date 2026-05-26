"""`app2 validate` subcommand: lint marketplace appliance yamls.

Static checks (no network) verify each appliance yaml is internally consistent
and release-ready:

  - required top-level fields: id, name, version
  - images[]: url, size, checksum.{md5,sha256} present
  - globally unique id across all yamls

OS appliances (those under an ``appliances/os/`` path) get stricter checks,
because their image filename encodes the OS and version:

  - each image url filename base == the image's ``name``
  - url arch (``.aarch64``?) matches ``os-arch``
  - url version == top-level ``version``
  - ``os-id`` and ``os-release`` are set

Service/iso/other appliances skip the strict checks: their image ``name`` is a
logical handle (e.g. ``oneke_os``) that intentionally differs from a shared
image filename (e.g. ``service_OneKE``). ``VMTEMPLATE`` / ``SERVICE_TEMPLATE``
appliances reference images via a template, so an empty ``images[]`` is allowed
for them.

With ``--check-urls`` every image url is also probed with an HTTP HEAD request
(catches missing or non-public objects).
"""
from __future__ import annotations

import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen

import typer

from app2 import marketplace
from app2.matching import _image_base_from_url

ERROR = "error"
WARN = "warn"

_URL_VERSION = re.compile(r"-(\d+\.\d+\.\d+-\d+-\d{8})$")


@dataclass
class Issue:
    path: Path
    level: str
    code: str
    message: str


def _url_version(url: str) -> str | None:
    """Extract the ``X.Y.Z-N-YYYYMMDD`` version token from an image url, if any."""
    fn = Path(urlparse(url).path).name
    if fn.endswith(".qcow2"):
        fn = fn[: -len(".qcow2")]
    if fn.endswith(".aarch64"):
        fn = fn[: -len(".aarch64")]
    m = _URL_VERSION.search(fn)
    return m.group(1) if m else None


def _is_os_appliance(yaml_path: Path) -> bool:
    """True if the path lies under an ``appliances/os/`` directory."""
    parts = yaml_path.resolve().parts
    return any(
        parts[i] == "appliances" and parts[i + 1] == "os"
        for i in range(len(parts) - 1)
    )


def _load_appliances(
    appliances_dir: Path,
) -> tuple[list[tuple[Path, dict]], list[Issue]]:
    """Load every appliance yaml under ``appliances_dir``.

    Returns (appliances, parse_issues). Yamls that aren't appliance definitions
    (no ``id`` and no ``images``) are skipped silently.
    """
    appliances: list[tuple[Path, dict]] = []
    parse_issues: list[Issue] = []
    for yaml_path in sorted(appliances_dir.rglob("*.yaml")):
        try:
            data = marketplace.load(yaml_path)
        except Exception as e:
            parse_issues.append(Issue(yaml_path, ERROR, "parse", f"cannot parse yaml: {e}"))
            continue
        if not isinstance(data, dict):
            continue
        if "id" not in data and "images" not in data:
            continue  # not an appliance definition
        appliances.append((yaml_path, data))
    return appliances, parse_issues


def _check_data(path: Path, data: dict) -> list[Issue]:
    issues: list[Issue] = []

    def err(code: str, msg: str) -> None:
        issues.append(Issue(path, ERROR, code, msg))

    def warn(code: str, msg: str) -> None:
        issues.append(Issue(path, WARN, code, msg))

    for field in ("id", "name", "version"):
        if not str(data.get(field) or "").strip():
            err("missing-field", f"missing top-level {field!r}")

    is_os = _is_os_appliance(path)
    if is_os:
        for field in ("os-id", "os-release"):
            if not str(data.get(field) or "").strip():
                err("missing-field", f"missing {field!r}")

    top_version = str(data.get("version") or "").strip()
    os_arch = str(data.get("os-arch") or "").strip()

    # VMTEMPLATE / SERVICE_TEMPLATE appliances reference images via a template
    # rather than carrying their own images[], so an empty images[] is fine.
    appliance_type = str(data.get("type") or "").strip().upper()
    is_template = appliance_type in ("VMTEMPLATE", "SERVICE_TEMPLATE")

    images = data.get("images")
    if not isinstance(images, list) or not images:
        if not is_template:
            err("no-images", "no images[] entries")
        return issues

    for i, img in enumerate(images):
        loc = f"images[{i}]"
        if not isinstance(img, dict):
            err("image", f"{loc} is not a mapping")
            continue

        url = str(img.get("url") or "").strip()
        if not url:
            err("missing-field", f"{loc} missing url")

        size = img.get("size")
        if not isinstance(size, int) or size <= 0:
            err("missing-field", f"{loc} missing/invalid size ({size!r})")

        checksum = img.get("checksum")
        if not isinstance(checksum, dict):
            err("missing-field", f"{loc} missing checksum")
        else:
            for algo in ("md5", "sha256"):
                if not str(checksum.get(algo) or "").strip():
                    err("missing-field", f"{loc} missing checksum.{algo}")

        if is_os and url:
            base, url_arch, _ext = _image_base_from_url(url)
            name = str(img.get("name") or "").strip()
            if not name:
                warn("image-name", f"{loc} missing name")
            elif name != base:
                err(
                    "name-url-mismatch",
                    f"{loc} name {name!r} != url image base {base!r} ({url})",
                )
            if os_arch and url_arch != os_arch:
                err(
                    "arch-mismatch",
                    f"{loc} url arch {url_arch!r} != os-arch {os_arch!r} ({url})",
                )
            uv = _url_version(url)
            if uv is None:
                warn("url-version", f"{loc} url has no parseable version: {url}")
            elif top_version and uv != top_version:
                err(
                    "version-mismatch",
                    f"{loc} url version {uv!r} != top-level version {top_version!r}",
                )

    return issues


def _dup_id_issues(appliances: list[tuple[Path, dict]]) -> list[Issue]:
    ids: dict[str, list[Path]] = {}
    for path, data in appliances:
        aid = str(data.get("id") or "").strip()
        if aid:
            ids.setdefault(aid, []).append(path)

    issues: list[Issue] = []
    for aid, paths in ids.items():
        if len(paths) > 1:
            for p in paths:
                others = ", ".join(o.name for o in paths if o != p)
                issues.append(Issue(p, ERROR, "duplicate-id", f"id {aid!r} also used by {others}"))
    return issues


def _static_issues(
    appliances: list[tuple[Path, dict]], parse_issues: list[Issue]
) -> list[Issue]:
    issues = list(parse_issues)
    for path, data in appliances:
        issues.extend(_check_data(path, data))
    issues.extend(_dup_id_issues(appliances))
    return issues


def collect_issues(appliances_dir: Path) -> list[Issue]:
    """Run all static (network-free) checks over ``appliances_dir``."""
    appliances, parse_issues = _load_appliances(appliances_dir)
    return _static_issues(appliances, parse_issues)


def _head(url: str, timeout: float) -> tuple[int | None, str | None]:
    try:
        resp = urlopen(Request(url, method="HEAD"), timeout=timeout)
        return resp.status, None
    except HTTPError as e:
        return e.code, str(e)
    except URLError as e:
        return None, str(e.reason)
    except Exception as e:  # noqa: BLE001 - report any probe failure as unreachable
        return None, str(e)


def _url_issues(
    appliances: list[tuple[Path, dict]], workers: int, timeout: float = 20.0
) -> list[Issue]:
    url_paths: dict[str, list[Path]] = {}
    for path, data in appliances:
        for img in data.get("images") or []:
            if isinstance(img, dict):
                url = str(img.get("url") or "").strip()
                if url:
                    url_paths.setdefault(url, []).append(path)

    issues: list[Issue] = []
    if not url_paths:
        return issues
    with ThreadPoolExecutor(max_workers=max(1, workers)) as pool:
        futures = {pool.submit(_head, url, timeout): url for url in url_paths}
        for future in as_completed(futures):
            url = futures[future]
            status, detail = future.result()
            if status is None or status >= 400:
                reason = detail or f"HTTP {status}"
                for p in url_paths[url]:
                    issues.append(Issue(p, ERROR, "url-unreachable", f"{url} -> {reason}"))
    return issues


def _rel(path: Path, base: Path) -> Path:
    try:
        return path.relative_to(base)
    except ValueError:
        return path


def validate(
    appliances_dir: Path = typer.Argument(
        ...,
        exists=True, file_okay=False, dir_okay=True, readable=True,
        help="Marketplace appliances directory to validate (e.g. ./appliances).",
    ),
    check_urls: bool = typer.Option(
        False, "--check-urls",
        help="Also probe every image URL with an HTTP HEAD request (network).",
    ),
    strict: bool = typer.Option(
        False, "--strict",
        help="Exit non-zero on warnings too, not just errors.",
    ),
    workers: int = typer.Option(
        16, "--workers",
        help="Concurrent workers for --check-urls.",
    ),
):
    """Validate marketplace appliance yamls for release-readiness."""
    appliances, parse_issues = _load_appliances(appliances_dir)
    issues = _static_issues(appliances, parse_issues)
    if check_urls:
        issues.extend(_url_issues(appliances, workers))

    by_path: dict[Path, list[Issue]] = {}
    for it in issues:
        by_path.setdefault(it.path, []).append(it)

    for path in sorted(by_path):
        typer.echo(f"\n{_rel(path, appliances_dir)}")
        for it in by_path[path]:
            tag = "ERROR" if it.level == ERROR else "warn "
            typer.echo(f"  {tag}  {it.message}")

    errors = sum(1 for it in issues if it.level == ERROR)
    warns = sum(1 for it in issues if it.level == WARN)

    typer.echo("\n" + "=" * 60)
    typer.echo(
        f"validated {len(appliances)} appliance yaml(s): "
        f"{errors} error(s), {warns} warning(s)"
    )

    if errors or (strict and warns):
        raise typer.Exit(code=1)
