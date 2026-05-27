"""Apply manifest-derived values to a marketplace yaml in place.

The patch is intentionally narrow: only fields that change with each release.
Editorial fields (id, name, description, opennebula_template, …) are never
touched.

Updated fields:
    - top-level: version, creation_time, os-release (when present)
    - images[i]: url, size, checksum.{md5,sha256}

Refuses if the manifest's os-id disagrees with the yaml's — that signals the
matcher hit the wrong appliance and writing would corrupt data.
"""
from typing import Any
from urllib.parse import urlparse, urlunparse

from app2.checksum import FileDigest
from app2.manifest import Manifest
from app2.matching import ImageRef


class OsIdMismatch(Exception):
    """Raised when manifest os-id disagrees with the yaml's os-id."""


def new_image_filename(
    image_base: str, version: str, arch: str | None, ext: str = ".qcow2"
) -> str:
    arch_suffix = ".aarch64" if arch == "aarch64" else ""
    return f"{image_base}-{version}{arch_suffix}{ext}"


def new_image_url(
    existing_url: str,
    image_base: str,
    version: str,
    arch: str | None,
    prefix: str | None,
    ext: str = ".qcow2",
) -> str:
    """Compose the new image URL.

    If ``prefix`` is configured, use it. Otherwise reuse the existing URL's
    scheme/host/path-prefix and replace the basename.
    """
    new_basename = new_image_filename(image_base, version, arch, ext)

    if prefix:
        if not prefix.endswith("/"):
            prefix = prefix + "/"
        return prefix + new_basename

    parsed = urlparse(existing_url)
    head = parsed.path.rsplit("/", 1)[0]
    return urlunparse(parsed._replace(path=f"{head}/{new_basename}"))


def apply(
    data: Any,
    ref: ImageRef,
    m: Manifest,
    digest: FileDigest,
    image_url_prefix: str | None,
) -> None:
    """Update yaml ``data`` (a ruamel CommentedMap) in place."""
    yaml_os_id = str(data.get("os-id") or "").strip()
    if yaml_os_id and m.os_id and yaml_os_id != m.os_id:
        raise OsIdMismatch(
            f"yaml os-id {yaml_os_id!r} != manifest os-id {m.os_id!r}"
        )

    data["version"] = m.version
    data["creation_time"] = m.creation_time
    if "os-release" in data:
        data["os-release"] = m.os_release

    img = data["images"][ref.index]
    img["url"] = new_image_url(
        existing_url=str(img.get("url", "")),
        image_base=ref.image_base,
        version=m.version,
        arch=ref.arch,
        prefix=image_url_prefix,
        ext=ref.ext,
    )
    if m.size:
        img["size"] = m.size
    # If manifest lacks the virtual size (legacy), leave existing yaml value alone.
    if "checksum" not in img or img["checksum"] is None:
        img["checksum"] = {}
    img["checksum"]["md5"] = digest.md5
    img["checksum"]["sha256"] = digest.sha256
