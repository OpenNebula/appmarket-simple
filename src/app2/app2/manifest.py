"""Load one-apps image manifest yaml (produced by packer/manifest.sh)."""
from dataclasses import dataclass
from pathlib import Path

from ruamel.yaml import YAML


@dataclass
class Manifest:
    name: str
    version: str
    image: str
    format: str
    creation_time: int
    os_id: str
    os_release: str
    os_arch: str
    path: Path
    image_path: Path
    sha256: str = ""
    md5: str = ""
    size: int = 0        # virtual disk size in bytes (for marketplace yaml)
    file_size: int = 0   # qcow2 file size on disk in bytes (for S3 integrity)

    @classmethod
    def load(cls, path: Path) -> "Manifest":
        yaml = YAML(typ="safe")
        with path.open() as f:
            data = yaml.load(f) or {}
        return cls(
            name=data["name"],
            version=str(data["version"]),
            image=data["image"],
            format=data["format"],
            creation_time=int(data["creation_time"]),
            os_id=data.get("os-id", "") or "",
            os_release=str(data.get("os-release", "")),
            os_arch=data.get("os-arch", ""),
            path=path,
            image_path=path.parent / data["image"],
            sha256=str(data.get("sha256", "") or ""),
            md5=str(data.get("md5", "") or ""),
            size=int(data.get("size", 0) or 0),
            file_size=int(data.get("file_size", 0) or 0),
        )
