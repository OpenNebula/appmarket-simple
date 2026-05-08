from pathlib import Path

from app2.manifest import Manifest
from app2.matching import (
    _image_base_from_manifest,
    _image_base_from_url,
    _strip_qcow2_arch,
)


def _manifest(image: str, arch: str = "x86_64") -> Manifest:
    return Manifest(
        name="x", version="x", image=image, format="qcow2",
        creation_time=0, os_id="x", os_release="x", os_arch=arch,
        path=Path("/tmp/m"), image_path=Path("/tmp/i"),
    )


def test_strip_qcow2_arch_x86():
    assert _strip_qcow2_arch("alma10.qcow2") == ("alma10", "x86_64")


def test_strip_qcow2_arch_aarch64():
    assert _strip_qcow2_arch("alma10.aarch64.qcow2") == ("alma10", "aarch64")


def test_strip_qcow2_arch_no_qcow2_suffix():
    assert _strip_qcow2_arch("alma10") == ("alma10", "x86_64")


def test_strip_qcow2_arch_service_underscore():
    assert _strip_qcow2_arch("service_OneKE.qcow2") == ("service_OneKE", "x86_64")


def test_image_base_from_url_os():
    assert _image_base_from_url(
        "https://d24fmfybwxpuhu.cloudfront.net/alma10-7.2.0-0-20260330.qcow2"
    ) == ("alma10", "x86_64")


def test_image_base_from_url_aarch64():
    assert _image_base_from_url(
        "https://example.com/alma10-7.2.0-0-20260330.aarch64.qcow2"
    ) == ("alma10", "aarch64")


def test_image_base_from_url_service_underscore():
    assert _image_base_from_url(
        "https://example.com/service_OneKE-7.0.0-0-20250909.qcow2"
    ) == ("service_OneKE", "x86_64")


def test_image_base_from_url_without_version_suffix():
    assert _image_base_from_url("https://example.com/alma10.qcow2") == (
        "alma10", "x86_64",
    )


def test_image_base_from_manifest_x86():
    assert _image_base_from_manifest(_manifest("alma10.qcow2")) == ("alma10", "x86_64")


def test_image_base_from_manifest_aarch64():
    assert _image_base_from_manifest(
        _manifest("alma10.aarch64.qcow2", arch="aarch64")
    ) == ("alma10", "aarch64")


def test_image_base_from_manifest_service():
    assert _image_base_from_manifest(_manifest("service_OneKE.qcow2")) == (
        "service_OneKE", "x86_64",
    )
