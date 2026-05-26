from pathlib import Path

from app2.manifest import Manifest


def test_load_full(tmp_path: Path):
    p = tmp_path / "alma10.yaml"
    p.write_text(
        "name: AlmaLinux 10.2\n"
        "version: 7.2.0-0-20260513\n"
        "image: alma10.qcow2\n"
        "format: qcow2\n"
        "size: 10737418240\n"
        "file_size: 535035904\n"
        "sha256: b2801a6c\n"
        "md5: fae7c103\n"
        "creation_time: 1778667346\n"
        "os-id: AlmaLinux\n"
        "os-release: '10.2'\n"
        "os-arch: x86_64\n"
    )
    m = Manifest.load(p)
    assert m.name == "AlmaLinux 10.2"
    assert m.version == "7.2.0-0-20260513"
    assert m.image == "alma10.qcow2"
    assert m.sha256 == "b2801a6c"
    assert m.md5 == "fae7c103"
    assert m.size == 10737418240
    assert m.file_size == 535035904
    assert m.os_id == "AlmaLinux"
    assert m.os_release == "10.2"
    assert m.image_path == tmp_path / "alma10.qcow2"


def test_load_legacy_without_digest_fields(tmp_path: Path):
    p = tmp_path / "old.yaml"
    p.write_text(
        "name: AlmaLinux 10\n"
        "version: 7.2.0-0-20260330\n"
        "image: old.qcow2\n"
        "format: qcow2\n"
        "creation_time: 1700000000\n"
        "os-id: AlmaLinux\n"
        "os-release: '10.1'\n"
        "os-arch: x86_64\n"
    )
    m = Manifest.load(p)
    assert m.sha256 == ""
    assert m.md5 == ""
    assert m.size == 0
    assert m.file_size == 0
