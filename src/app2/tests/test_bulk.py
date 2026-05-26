from ruamel.yaml import YAML
from ruamel.yaml.scalarstring import SingleQuotedScalarString

from app2.bulk import Op, _walk, apply_op


def _yaml_load(text: str):
    yaml = YAML()
    yaml.preserve_quotes = True
    return yaml.load(text)


def test_walk_top_level():
    data = _yaml_load("foo: bar\n")
    parent, key, current = _walk(data, "foo")
    assert parent is data
    assert key == "foo"
    assert current == "bar"


def test_walk_nested():
    data = _yaml_load("opennebula_template:\n  cpu: 1\n")
    parent, key, current = _walk(data, "opennebula_template.cpu")
    assert key == "cpu"
    assert current == 1


def test_walk_missing_key():
    data = _yaml_load("foo: bar\n")
    parent, _, _ = _walk(data, "missing")
    assert parent is None


def test_walk_missing_intermediate():
    data = _yaml_load("foo: bar\n")
    parent, _, _ = _walk(data, "missing.deep.key")
    assert parent is None


def test_set_changes_value():
    data = _yaml_load("publisher: Old\n")
    assert apply_op(data, "publisher", Op.SET, "New")
    assert data["publisher"] == "New"


def test_set_idempotent():
    data = _yaml_load("publisher: Old\n")
    assert not apply_op(data, "publisher", Op.SET, "Old")


def test_set_parses_value_as_yaml():
    data = _yaml_load("size: 1\n")
    assert apply_op(data, "size", Op.SET, "42")
    assert data["size"] == 42


def test_set_preserves_single_quote_style():
    data = _yaml_load("os-release: '10.1'\n")
    apply_op(data, "os-release", Op.SET, "10.2")
    assert isinstance(data["os-release"], SingleQuotedScalarString)
    assert str(data["os-release"]) == "10.2"


def test_append_csv_adds_value():
    data = _yaml_load("opennebula_version: '6.10, 7.0, 7.2'\n")
    assert apply_op(data, "opennebula_version", Op.APPEND_CSV, "7.3")
    assert str(data["opennebula_version"]) == "6.10, 7.0, 7.2, 7.3"


def test_append_csv_idempotent():
    data = _yaml_load("opennebula_version: '6.10, 7.0, 7.2'\n")
    assert not apply_op(data, "opennebula_version", Op.APPEND_CSV, "7.0")


def test_append_csv_preserves_quote_style():
    data = _yaml_load("opennebula_version: '6.10, 7.0'\n")
    apply_op(data, "opennebula_version", Op.APPEND_CSV, "7.2")
    assert isinstance(data["opennebula_version"], SingleQuotedScalarString)


def test_remove_deletes_key():
    data = _yaml_load("foo: bar\nbaz: qux\n")
    assert apply_op(data, "foo", Op.REMOVE, "")
    assert "foo" not in data
    assert data["baz"] == "qux"


def test_apply_op_returns_false_for_missing_field():
    data = _yaml_load("foo: bar\n")
    assert not apply_op(data, "missing", Op.SET, "x")
