"""Match a one-apps Manifest to marketplace appliance yaml(s).

A manifest produces an image like ``alma10.qcow2`` or ``alma10.aarch64.qcow2``.
Marketplace yamls reference images via URLs like::

    https://.../alma10-7.2.0-0-20260330.qcow2
    https://.../service_OneKE-7.0.0-0-20250909.qcow2

We match on (image_base, arch) where:
    image_base = filename minus '.qcow2', minus '.aarch64', minus version suffix
    arch       = 'aarch64' if filename has '.aarch64' before '.qcow2' else 'x86_64'
"""
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable
from urllib.parse import urlparse

from app2 import marketplace
from app2.manifest import Manifest

_VERSION_SUFFIX = re.compile(r"-\d+\.\d+\.\d+-\d+-\d{8}$")


@dataclass
class ImageRef:
    """One ``images[]`` entry inside a marketplace yaml."""
    yaml_path: Path
    index: int
    name: str
    url: str
    image_base: str
    arch: str


def _strip_qcow2_arch(filename: str) -> tuple[str, str]:
    arch = "x86_64"
    if filename.endswith(".qcow2"):
        filename = filename[: -len(".qcow2")]
    if filename.endswith(".aarch64"):
        arch = "aarch64"
        filename = filename[: -len(".aarch64")]
    return filename, arch


def _image_base_from_url(url: str) -> tuple[str, str]:
    fn = Path(urlparse(url).path).name
    fn, arch = _strip_qcow2_arch(fn)
    fn = _VERSION_SUFFIX.sub("", fn)
    return fn, arch


def _image_base_from_manifest(m: Manifest) -> tuple[str, str]:
    fn, _ = _strip_qcow2_arch(m.image)
    return fn, m.os_arch


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
            image_base, arch = _image_base_from_url(str(url))
            yield ImageRef(
                yaml_path=yaml_path,
                index=idx,
                name=str(img.get("name", "")),
                url=str(url),
                image_base=image_base,
                arch=arch,
            )


def find_matches(m: Manifest, appliances_dir: Path) -> list[ImageRef]:
    base, arch = _image_base_from_manifest(m)
    return [
        ref for ref in collect_image_refs(appliances_dir)
        if ref.image_base == base and ref.arch == arch
    ]
