from pathlib import Path

import pytest
from ruamel.yaml import YAML

from app2.checksum import FileDigest
from app2.manifest import Manifest
from app2.matching import ImageRef
from app2.patch import OsIdMismatch, apply, new_image_filename, new_image_url


def _yaml_load(text: str):
    yaml = YAML()
    yaml.preserve_quotes = True
    return yaml.load(text)


def _manifest(
    *, image="alma10.qcow2", os_id="AlmaLinux", os_release="10.2",
    arch="x86_64", version="7.2.0-0-20260506", creation_time=1700000000,
    size=0, file_size=0,
) -> Manifest:
    return Manifest(
        name="x", version=version, image=image, format="qcow2",
        creation_time=creation_time, os_id=os_id, os_release=os_release,
        os_arch=arch, path=Path("/tmp/m"), image_path=Path("/tmp/i"),
        size=size, file_size=file_size,
    )


def _ref(image_base="alma10", arch="x86_64", index=0, name="alma10") -> ImageRef:
    return ImageRef(
        yaml_path=Path("/tmp/x"), index=index, name=name,
        url="", image_base=image_base, arch=arch,
    )


_DIGEST = FileDigest(sha256="aaa", md5="bbb", size=12345)


def test_new_image_filename_x86():
    assert new_image_filename("alma10", "7.2.0-0-20260506", "x86_64") == \
        "alma10-7.2.0-0-20260506.qcow2"


def test_new_image_filename_aarch64():
    assert new_image_filename("alma10", "7.2.0-0-20260506", "aarch64") == \
        "alma10-7.2.0-0-20260506.aarch64.qcow2"


def test_new_image_url_with_explicit_prefix():
    assert new_image_url(
        existing_url="https://old.example.com/old/alma10-1.0.0-0-20200101.qcow2",
        image_base="alma10",
        version="7.2.0-0-20260506",
        arch="x86_64",
        prefix="https://new.example.com/",
    ) == "https://new.example.com/alma10-7.2.0-0-20260506.qcow2"


def test_new_image_url_explicit_prefix_appends_slash():
    assert new_image_url(
        existing_url="ignored",
        image_base="alma10",
        version="7.2.0-0-20260506",
        arch="x86_64",
        prefix="https://new.example.com",
    ) == "https://new.example.com/alma10-7.2.0-0-20260506.qcow2"


def test_new_image_url_keeps_existing_prefix():
    assert new_image_url(
        existing_url="https://d24fmfybwxpuhu.cloudfront.net/alma10-1.0.0-0-20200101.qcow2",
        image_base="alma10",
        version="7.2.0-0-20260506",
        arch="x86_64",
        prefix=None,
    ) == "https://d24fmfybwxpuhu.cloudfront.net/alma10-7.2.0-0-20260506.qcow2"


def test_apply_updates_top_level_fields():
    data = _yaml_load("""\
version: 1.0.0-0-20200101
creation_time: 1234
os-id: AlmaLinux
os-release: '10.1'
images:
- name: alma10
  url: https://example.com/alma10-1.0.0-0-20200101.qcow2
  size: 100
  checksum:
    md5: old-md5
    sha256: old-sha
""")
    apply(data, _ref(), _manifest(size=10737418240), _DIGEST, image_url_prefix=None)

    assert data["version"] == "7.2.0-0-20260506"
    assert data["creation_time"] == 1700000000
    assert data["os-release"] == "10.2"
    img = data["images"][0]
    assert img["url"] == "https://example.com/alma10-7.2.0-0-20260506.qcow2"
    assert img["size"] == 10737418240  # virtual size from manifest, not file size
    assert img["checksum"]["md5"] == "bbb"
    assert img["checksum"]["sha256"] == "aaa"


def test_apply_leaves_size_alone_when_manifest_lacks_virtual_size():
    data = _yaml_load("""\
version: 1.0.0
creation_time: 1
images:
- name: alma10
  url: https://example.com/alma10-1.0.0-0-20200101.qcow2
  size: 99999999
  checksum:
    md5: ''
    sha256: ''
""")
    apply(data, _ref(), _manifest(), _DIGEST, image_url_prefix=None)
    assert data["images"][0]["size"] == 99999999


def test_apply_does_not_add_os_release_when_absent():
    data = _yaml_load("""\
version: 1.0.0
creation_time: 1
images:
- name: alma10
  url: https://example.com/alma10-1.0.0-0-20200101.qcow2
  size: 100
  checksum:
    md5: ''
    sha256: ''
""")
    apply(data, _ref(), _manifest(), _DIGEST, image_url_prefix=None)
    assert "os-release" not in data


def test_apply_refuses_on_os_id_mismatch():
    data = _yaml_load("""\
version: 1.0.0
creation_time: 1
os-id: Ubuntu
images:
- name: x
  url: https://example.com/x-1.0.0-0-20200101.qcow2
  size: 100
""")
    with pytest.raises(OsIdMismatch):
        apply(data, _ref(), _manifest(os_id="AlmaLinux"), _DIGEST, image_url_prefix=None)


def test_apply_creates_checksum_block_when_missing():
    data = _yaml_load("""\
version: 1.0.0
creation_time: 1
images:
- name: alma10
  url: https://example.com/alma10-1.0.0-0-20200101.qcow2
  size: 100
""")
    apply(data, _ref(), _manifest(), _DIGEST, image_url_prefix=None)
    assert data["images"][0]["checksum"]["md5"] == "bbb"
    assert data["images"][0]["checksum"]["sha256"] == "aaa"
