"""Compute sha256, md5, and size of a file in a single read pass."""
import hashlib
from dataclasses import dataclass
from pathlib import Path

_CHUNK = 1024 * 1024


@dataclass
class FileDigest:
    sha256: str
    md5: str
    size: int


def compute(path: Path) -> FileDigest:
    sha = hashlib.sha256()
    md5 = hashlib.md5()
    size = 0
    with path.open("rb") as f:
        while chunk := f.read(_CHUNK):
            sha.update(chunk)
            md5.update(chunk)
            size += len(chunk)
    return FileDigest(sha256=sha.hexdigest(), md5=md5.hexdigest(), size=size)
