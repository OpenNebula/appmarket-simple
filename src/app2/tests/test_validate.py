import copy
from pathlib import Path

from app2 import marketplace
from app2.validate import collect_issues

# A minimal, valid OS appliance. Lives under appliances/os/ so the strict
# OS-only checks apply.
_VALID_OS = {
    "id": "7bcab634-5810-11f1-9ab2-f875a4a4f528",
    "name": "AlmaLinux 10",
    "version": "7.2.1-0-20260524",
    "os-id": "AlmaLinux",
    "os-release": "10.1",
    "os-arch": "x86_64",
    "images": [
        {
            "name": "alma10",
            "url": "https://cdn.example.net/alma10-7.2.1-0-20260524.qcow2",
            "size": 3221225472,
            "checksum": {"md5": "aa", "sha256": "bb"},
        }
    ],
}


def _write_os(root: Path, data: dict, fname: str = "alma-10-x86_64.yaml") -> Path:
    p = root / "appliances" / "os" / "alma" / fname
    p.parent.mkdir(parents=True, exist_ok=True)
    marketplace.save(p, data)
    return p


def _write_service(root: Path, data: dict, fname: str = "oneke.yaml") -> Path:
    p = root / "appliances" / "service" / "oneke" / fname
    p.parent.mkdir(parents=True, exist_ok=True)
    marketplace.save(p, data)
    return p


def _codes(root: Path) -> set[str]:
    return {i.code for i in collect_issues(root)}


def test_valid_os_appliance_has_no_issues(tmp_path):
    _write_os(tmp_path, copy.deepcopy(_VALID_OS))
    assert collect_issues(tmp_path) == []


def test_valid_aarch64_appliance_has_no_issues(tmp_path):
    d = copy.deepcopy(_VALID_OS)
    d["os-arch"] = "aarch64"
    d["images"][0]["url"] = "https://cdn.example.net/alma10-7.2.1-0-20260524.aarch64.qcow2"
    _write_os(tmp_path, d, "alma-10-aarch64.yaml")
    assert collect_issues(tmp_path) == []


def test_name_url_mismatch(tmp_path):
    # The bug we hit: name updated to ubuntu2604min but url still ubuntu2404min.
    d = copy.deepcopy(_VALID_OS)
    d["images"][0]["name"] = "ubuntu2604min"
    _write_os(tmp_path, d)
    assert "name-url-mismatch" in _codes(tmp_path)


def test_version_mismatch(tmp_path):
    d = copy.deepcopy(_VALID_OS)
    d["version"] = "7.2.1-0-20260525"  # url still says ...20260524
    _write_os(tmp_path, d)
    assert "version-mismatch" in _codes(tmp_path)


def test_arch_mismatch(tmp_path):
    d = copy.deepcopy(_VALID_OS)
    d["os-arch"] = "aarch64"  # url has no .aarch64 -> x86_64
    _write_os(tmp_path, d)
    assert "arch-mismatch" in _codes(tmp_path)


def test_missing_checksum_sha256(tmp_path):
    d = copy.deepcopy(_VALID_OS)
    del d["images"][0]["checksum"]["sha256"]
    _write_os(tmp_path, d)
    assert "missing-field" in _codes(tmp_path)


def test_missing_size(tmp_path):
    d = copy.deepcopy(_VALID_OS)
    del d["images"][0]["size"]
    _write_os(tmp_path, d)
    assert "missing-field" in _codes(tmp_path)


def test_missing_os_id_on_os_appliance(tmp_path):
    d = copy.deepcopy(_VALID_OS)
    del d["os-id"]
    _write_os(tmp_path, d)
    assert "missing-field" in _codes(tmp_path)


def test_duplicate_id(tmp_path):
    _write_os(tmp_path, copy.deepcopy(_VALID_OS), "alma-10-x86_64.yaml")
    _write_os(tmp_path, copy.deepcopy(_VALID_OS), "alma-10-aarch64.yaml")  # same id
    assert "duplicate-id" in _codes(tmp_path)


def test_service_appliance_skips_strict_checks(tmp_path):
    # Logical name != shared image filename is normal for services.
    d = {
        "id": "11111111-2222-3333-4444-555555555555",
        "name": "OneKE",
        "version": "7.0.0-0-20250909",
        "images": [
            {
                "name": "oneke_os",
                "url": "https://cdn.example.net/service_OneKE-7.0.0-0-20250909.qcow2",
                "size": 123,
                "checksum": {"md5": "aa", "sha256": "bb"},
            }
        ],
    }
    _write_service(tmp_path, d)
    codes = _codes(tmp_path)
    assert "name-url-mismatch" not in codes
    assert "missing-field" not in codes  # no os-id/os-release required for services


def test_vmtemplate_without_images_is_ok(tmp_path):
    # VMTEMPLATE appliances reference images via a template, not images[].
    d = {
        "id": "47cbf254-a37f-4c2d-8738-bcd6d03f8e87",
        "name": "OneKE 1.33",
        "version": "1.33.4-7.0.0-0-20250909",
        "type": "VMTEMPLATE",
    }
    _write_service(tmp_path, d, "oneke-133-x86_64.yaml")
    assert "no-images" not in _codes(tmp_path)


def test_non_appliance_yaml_is_skipped(tmp_path):
    p = tmp_path / "appliances" / "ci.yaml"
    p.parent.mkdir(parents=True, exist_ok=True)
    marketplace.save(p, {"name": "ci", "on": "push", "jobs": {}})
    assert collect_issues(tmp_path) == []
