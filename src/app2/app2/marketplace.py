"""Round-trippable load/save of marketplace appliance yamls.

Marketplace yamls are formatting-sensitive (whitespace and quoting have been
observed to matter to downstream consumers), so all reads/writes go through a
ruamel.yaml instance configured to preserve the original layout.
"""
from pathlib import Path

from ruamel.yaml import YAML


def roundtrip_yaml() -> YAML:
    """Return a YAML instance configured to preserve formatting on save."""
    y = YAML()
    y.preserve_quotes = True
    y.width = 4096
    y.explicit_start = True
    return y


def load(path: Path):
    with path.open() as f:
        return roundtrip_yaml().load(f)


def save(path: Path, data) -> None:
    with path.open("w") as f:
        roundtrip_yaml().dump(data, f)
