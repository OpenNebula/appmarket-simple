from pathlib import Path

from app2.manifest import Manifest
from app2.matching import (
    _image_base_from_manifest,
    _image_base_from_url,
    _split_image_name,
    find_matches,
)


def _manifest(
    image: str, arch: str = "x86_64", fmt: str = "qcow2",
    os_id: str = "x", os_release: str = "x",
) -> Manifest:
    return Manifest(
        name="x", version="x", image=image, format=fmt,
        creation_time=0, os_id=os_id, os_release=os_release, os_arch=arch,
        path=Path("/tmp/m"), image_path=Path("/tmp/i"),
    )


def test_split_image_name_x86():
    assert _split_image_name("alma10.qcow2") == ("alma10", "x86_64", ".qcow2")


def test_split_image_name_aarch64():
    assert _split_image_name("alma10.aarch64.qcow2") == ("alma10", "aarch64", ".qcow2")


def test_split_image_name_iso_has_no_arch():
    assert _split_image_name("one-context.iso") == ("one-context", None, ".iso")


def test_split_image_name_unknown_ext():
    assert _split_image_name("alma10") == ("alma10", None, "")


def test_split_image_name_service_underscore():
    assert _split_image_name("service_OneKE.qcow2") == ("service_OneKE", "x86_64", ".qcow2")


def test_image_base_from_url_os():
    assert _image_base_from_url(
        "https://d24fmfybwxpuhu.cloudfront.net/alma10-7.2.0-0-20260330.qcow2"
    ) == ("alma10", "x86_64", ".qcow2")


def test_image_base_from_url_aarch64():
    assert _image_base_from_url(
        "https://example.com/alma10-7.2.0-0-20260330.aarch64.qcow2"
    ) == ("alma10", "aarch64", ".qcow2")


def test_image_base_from_url_iso():
    assert _image_base_from_url(
        "https://d24fmfybwxpuhu.cloudfront.net/one-context-7.2.1-0-20260525.iso"
    ) == ("one-context", None, ".iso")


def test_image_base_from_url_service_underscore():
    assert _image_base_from_url(
        "https://example.com/service_OneKE-7.0.0-0-20250909.qcow2"
    ) == ("service_OneKE", "x86_64", ".qcow2")


def test_image_base_from_url_without_version_suffix():
    assert _image_base_from_url("https://example.com/alma10.qcow2") == (
        "alma10", "x86_64", ".qcow2",
    )


def test_image_base_from_manifest_x86():
    assert _image_base_from_manifest(_manifest("alma10.qcow2")) == ("alma10", "x86_64", ".qcow2")


def test_image_base_from_manifest_aarch64():
    assert _image_base_from_manifest(
        _manifest("alma10.aarch64.qcow2", arch="aarch64")
    ) == ("alma10", "aarch64", ".qcow2")


def test_image_base_from_manifest_iso():
    assert _image_base_from_manifest(
        _manifest("one-context.iso", arch="", fmt="iso", os_id="", os_release="")
    ) == ("one-context", None, ".iso")


def test_image_base_from_manifest_service():
    assert _image_base_from_manifest(_manifest("service_OneKE.qcow2")) == (
        "service_OneKE", "x86_64", ".qcow2",
    )


def test_find_matches_iso_does_not_match_qcow2(tmp_path):
    """An iso manifest matches only the iso appliance, never a like-named qcow2."""
    (tmp_path / "iso").mkdir()
    (tmp_path / "iso" / "context.yaml").write_text(
        "images:\n"
        "- name: one-context\n"
        "  url: https://x/one-context-7.2.1-0-20260525.iso\n"
    )
    (tmp_path / "os").mkdir()
    (tmp_path / "os" / "alma.yaml").write_text(
        "images:\n"
        "- name: alma10\n"
        "  url: https://x/alma10-7.2.0-0-20260330.qcow2\n"
    )

    m = _manifest("one-context.iso", arch="", fmt="iso", os_id="", os_release="")
    refs = find_matches(m, tmp_path)

    assert len(refs) == 1
    assert refs[0].image_base == "one-context"
    assert refs[0].ext == ".iso"
    assert refs[0].arch is None
