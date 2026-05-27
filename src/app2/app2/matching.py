"""Match a one-apps Manifest to marketplace appliance yaml(s).

A manifest produces an image like ``alma10.qcow2``, ``alma10.aarch64.qcow2``
or ``one-context.iso``. Marketplace yamls reference images via URLs like::

    https://.../alma10-7.2.0-0-20260330.qcow2
    https://.../service_OneKE-7.0.0-0-20250909.qcow2
    https://.../one-context-7.2.1-0-20260525.iso

We match on (image_base, arch, ext) where:
    image_base = filename minus extension, minus '.aarch64', minus version suffix
    arch       = 'aarch64'/'x86_64' for qcow2 disk images; None for iso and
                 other media, which have no architecture dimension
    ext        = '.qcow2' or '.iso'
"""
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable
from urllib.parse import urlparse

from app2 import marketplace
from app2.manifest import Manifest

# Media we know how to release. The '.aarch64' arch infix only applies to qcow2.
_KNOWN_EXTS = (".qcow2", ".iso")
_VERSION_SUFFIX = re.compile(r"-\d+\.\d+\.\d+-\d+-\d{8}$")


@dataclass
class ImageRef:
    """One ``images[]`` entry inside a marketplace yaml."""
    yaml_path: Path
    index: int
    name: str
    url: str
    image_base: str
    arch: str | None
    ext: str = ".qcow2"


def _split_ext(filename: str) -> tuple[str, str]:
    """Split a known image extension off ``filename`` -> (stem, ext).

    An unknown/absent extension yields ``(filename, "")``.
    """
    for ext in _KNOWN_EXTS:
        if filename.endswith(ext):
            return filename[: -len(ext)], ext
    return filename, ""


def _split_image_name(filename: str) -> tuple[str, str | None, str]:
    """Decompose an image filename into (stem, arch, ext).

    arch is read from a ``.aarch64`` infix and only applies to qcow2 disk
    images; iso/other media return arch=None. Any trailing version suffix is
    left on the stem for the caller to strip.
    """
    stem, ext = _split_ext(filename)
    if ext == ".qcow2":
        if stem.endswith(".aarch64"):
            return stem[: -len(".aarch64")], "aarch64", ext
        return stem, "x86_64", ext
    return stem, None, ext


def _image_base_from_url(url: str) -> tuple[str, str | None, str]:
    stem, arch, ext = _split_image_name(Path(urlparse(url).path).name)
    base = _VERSION_SUFFIX.sub("", stem)
    return base, arch, ext


def _image_base_from_manifest(m: Manifest) -> tuple[str, str | None, str]:
    base, arch, ext = _split_image_name(m.image)
    # os-arch is authoritative for disk images; media (iso) carry no arch.
    if ext == ".qcow2":
        arch = m.os_arch
    return base, arch, ext


def collect_image_refs(appliances_dir: Path) -> Iterable[ImageRef]:
    """Yield every images[] entry across every yaml under appliances_dir."""
    for yaml_path in sorted(appliances_dir.rglob("*.yaml")):
        try:
            data = marketplace.load(yaml_path)
        except Exception:
            continue
        if not isinstance(data, dict):
            continue
        for idx, img in enumerate(data.get("images") or []):
            url = img.get("url")
            if not url:
                continue
            image_base, arch, ext = _image_base_from_url(str(url))
            yield ImageRef(
                yaml_path=yaml_path,
                index=idx,
                name=str(img.get("name", "")),
                url=str(url),
                image_base=image_base,
                arch=arch,
                ext=ext,
            )


def find_matches(m: Manifest, appliances_dir: Path) -> list[ImageRef]:
    base, arch, ext = _image_base_from_manifest(m)
    return [
        ref for ref in collect_image_refs(appliances_dir)
        if ref.image_base == base and ref.arch == arch and ref.ext == ext
    ]
