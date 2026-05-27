"""`app2 release` and `app2 release-all` subcommands."""
import difflib
import io
import re
from dataclasses import dataclass, field
from pathlib import Path

import typer

from app2 import config as config_mod
from app2 import marketplace
from app2 import matching
from app2 import patch as patch_mod
from app2 import s3
from app2.checksum import FileDigest, compute as compute_digest
from app2.config import Config
from app2.manifest import Manifest


@dataclass
class ReleaseResult:
    manifest: Path
    status: str  # see release_one() for taxonomy
    matches: int = 0
    failed_yamls: list[str] = field(default_factory=list)
    detail: str = ""


def _diff_after_patch(yaml_path: Path, ref, m, digest, image_url_prefix) -> str:
    yaml = marketplace.roundtrip_yaml()

    with yaml_path.open() as f:
        before_data = yaml.load(f)
    before_buf = io.StringIO()
    yaml.dump(before_data, before_buf)

    with yaml_path.open() as f:
        after_data = yaml.load(f)
    patch_mod.apply(after_data, ref, m, digest, image_url_prefix)
    after_buf = io.StringIO()
    yaml.dump(after_data, after_buf)

    return "".join(
        difflib.unified_diff(
            before_buf.getvalue().splitlines(keepends=True),
            after_buf.getvalue().splitlines(keepends=True),
            fromfile=str(yaml_path),
            tofile=str(yaml_path),
            n=1,
        )
    )


def release_one(
    manifest_path: Path,
    appliances_dir: Path,
    cfg: Config,
    dry_run: bool,
    filter_regex: re.Pattern | None = None,
) -> ReleaseResult:
    """Process a single manifest. Statuses returned in ReleaseResult.status:

      applied        - wrote at least one yaml (apply mode)
      would-apply    - diff exists, no write (dry-run)
      no-changes     - all matched yamls already current
      skipped        - matched skip_patterns
      no-match       - no marketplace yaml matched
      filtered-out   - had matches but all excluded by --filter
      image-missing  - qcow2 referenced by manifest doesn't exist
      refused        - at least one yaml refused (os-id mismatch)
    """
    m = Manifest.load(manifest_path)

    typer.echo(f"\nmanifest:     {m.path}")
    typer.echo(f"  image:      {m.image}")
    if m.os_id or m.os_release or m.os_arch:
        typer.echo(f"  os:         {m.os_id} {m.os_release} ({m.os_arch})")
    typer.echo(f"  version:    {m.version}")

    if config_mod.should_skip(m.image, cfg.skip_patterns):
        typer.echo("  -> skipped (matches skip_patterns)")
        return ReleaseResult(manifest_path, "skipped")

    refs = matching.find_matches(m, appliances_dir)
    typer.echo(f"  appliances: {appliances_dir}")
    typer.echo(f"  mode:       {'DRY RUN' if dry_run else 'APPLY'}")

    if not refs:
        typer.echo("  -> no matching marketplace yamls found")
        return ReleaseResult(manifest_path, "no-match")

    if filter_regex is not None:
        before = len(refs)
        refs = [
            r for r in refs
            if filter_regex.search(str(r.yaml_path.relative_to(appliances_dir)))
        ]
        typer.echo(f"  filter:     {filter_regex.pattern!r} -> {len(refs)}/{before} matches")
        if not refs:
            typer.echo("  -> all matches excluded by filter")
            return ReleaseResult(manifest_path, "filtered-out", matches=before)

    if m.sha256 and m.md5 and m.file_size:
        digest = FileDigest(sha256=m.sha256, md5=m.md5, size=m.file_size)
        typer.echo("  digest:     (from manifest)")
    else:
        if not m.image_path.exists():
            typer.echo(
                f"  -> image file not found and manifest lacks digest: {m.image_path}",
                err=True,
            )
            return ReleaseResult(manifest_path, "image-missing")
        typer.echo(f"  hashing:    {m.image_path}  (manifest lacks digest fields)")
        digest = compute_digest(m.image_path)
    typer.echo(f"    sha256:   {digest.sha256}")
    typer.echo(f"    md5:      {digest.md5}")
    typer.echo(f"    size:     {digest.size}")

    if cfg.s3_bucket:
        ref0 = refs[0]
        s3_filename = patch_mod.new_image_filename(
            ref0.image_base, m.version, ref0.arch, ref0.ext
        )
        s3_key = (cfg.s3_prefix or "") + s3_filename
        typer.echo(f"  s3:         s3://{cfg.s3_bucket}/{s3_key}")
        if dry_run:
            typer.echo("    (dry-run: skipping upload)")
        elif s3.already_uploaded(cfg.s3_bucket, s3_key, digest, cfg.s3_region):
            typer.echo("    already present (sha256 matches), skipped")
        elif not m.image_path.exists():
            typer.echo(f"  -> image file not found for upload: {m.image_path}", err=True)
            return ReleaseResult(manifest_path, "image-missing")
        else:
            typer.echo("    uploading…")
            s3.upload(m.image_path, cfg.s3_bucket, s3_key, digest, cfg.s3_region)
            typer.echo("    uploaded.")
    else:
        typer.echo("  s3:         not configured (set APP2_S3_BUCKET); skipping upload")

    typer.echo(f"  matches ({len(refs)}):")
    failed: list[str] = []
    any_diff = False
    written = 0
    for ref in refs:
        rel = str(ref.yaml_path.relative_to(appliances_dir))
        typer.echo(f"\n  → {rel}  [images[{ref.index}].name={ref.name}]")
        try:
            diff = _diff_after_patch(
                ref.yaml_path, ref, m, digest, cfg.image_url_prefix
            )
        except patch_mod.OsIdMismatch as e:
            typer.echo(f"      ! refusing: {e}")
            failed.append(rel)
            continue

        if diff:
            any_diff = True
            for line in diff.splitlines():
                typer.echo(f"    {line}")
        else:
            typer.echo("    (no changes)")

        if not dry_run and diff:
            yaml = marketplace.roundtrip_yaml()
            with ref.yaml_path.open() as f:
                data = yaml.load(f)
            patch_mod.apply(data, ref, m, digest, cfg.image_url_prefix)
            with ref.yaml_path.open("w") as f:
                yaml.dump(data, f)
            typer.echo("    written.")
            written += 1

    if failed and not any_diff:
        status = "refused"
    elif not any_diff:
        status = "no-changes"
    elif dry_run:
        status = "would-apply"
    else:
        status = "applied"
    return ReleaseResult(
        manifest_path, status, matches=len(refs), failed_yamls=failed
    )


def _compile_filter(filter_str: str | None) -> re.Pattern | None:
    if not filter_str:
        return None
    try:
        return re.compile(filter_str)
    except re.error as e:
        typer.echo(f"invalid --filter regex: {e}", err=True)
        raise typer.Exit(code=2)


def release(
    manifest: Path = typer.Argument(
        ...,
        exists=True, file_okay=True, dir_okay=False, readable=True,
        help="Path to a one-apps manifest yaml (e.g. export/alma10.yaml).",
    ),
    appliances_dir: Path = typer.Argument(
        ...,
        exists=True, file_okay=False, dir_okay=True, readable=True,
        help="Marketplace appliances directory (e.g. ~/git/marketplace/appliances).",
    ),
    dry_run: bool = typer.Option(
        True, "--dry-run/--apply",
        help="Preview changes without writing yamls or uploading to S3.",
    ),
    filter_regex: str = typer.Option(
        None, "--filter",
        help="Regex; only matched yamls whose relative path matches are processed.",
    ),
):
    """Release a single image: update marketplace yaml(s) and upload to S3."""
    cfg = config_mod.load()
    pattern = _compile_filter(filter_regex)
    result = release_one(manifest, appliances_dir, cfg, dry_run, filter_regex=pattern)
    if result.status in ("refused", "image-missing") or result.failed_yamls:
        raise typer.Exit(code=1)


def release_all(
    images_dir: Path = typer.Argument(
        ...,
        exists=True, file_okay=False, dir_okay=True, readable=True,
        help="Directory of one-apps images + manifests (e.g. ~/git/one-apps/export).",
    ),
    appliances_dir: Path = typer.Argument(
        ...,
        exists=True, file_okay=False, dir_okay=True, readable=True,
        help="Marketplace appliances directory.",
    ),
    dry_run: bool = typer.Option(
        True, "--dry-run/--apply",
        help="Preview changes without writing yamls or uploading to S3.",
    ),
    filter_regex: str = typer.Option(
        None, "--filter",
        help="Regex; only matched yamls whose relative path matches are processed.",
    ),
):
    """Release every manifest found in images_dir, with a summary at the end."""
    cfg = config_mod.load()
    pattern = _compile_filter(filter_regex)
    manifests = sorted(images_dir.glob("*.yaml"))
    if not manifests:
        typer.echo(f"no manifests (*.yaml) found in {images_dir}", err=True)
        raise typer.Exit(code=1)

    typer.echo(f"found {len(manifests)} manifest(s) in {images_dir}")

    results: list[ReleaseResult] = []
    for path in manifests:
        try:
            results.append(release_one(path, appliances_dir, cfg, dry_run, filter_regex=pattern))
        except Exception as e:
            typer.echo(f"  ! error: {e}", err=True)
            results.append(ReleaseResult(path, "error", detail=str(e)))

    by_status: dict[str, list[ReleaseResult]] = {}
    for r in results:
        by_status.setdefault(r.status, []).append(r)

    typer.echo("\n" + "=" * 60)
    typer.echo("Summary:")
    order = [
        "applied", "would-apply", "no-changes", "skipped",
        "no-match", "filtered-out", "image-missing", "refused", "error",
    ]
    for status in order:
        items = by_status.get(status, [])
        if not items:
            continue
        typer.echo(f"  {status:14s} {len(items):3d}")
        for r in items:
            extra = f" ({r.detail})" if r.detail else ""
            typer.echo(f"      {r.manifest.name}{extra}")

    bad = {"error", "refused", "image-missing"}
    if any(s in by_status for s in bad):
        raise typer.Exit(code=1)
