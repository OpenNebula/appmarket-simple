from app2.config import should_skip


def test_should_skip_match():
    assert should_skip("rhel8.qcow2", ["^rhel"])


def test_should_skip_no_match():
    assert not should_skip("alma8.qcow2", ["^rhel"])


def test_should_skip_empty_patterns():
    assert not should_skip("alma8.qcow2", [])


def test_should_skip_any_of_multiple_patterns():
    assert should_skip("sles15.qcow2", ["^rhel", "^sles"])


def test_should_skip_substring_match():
    assert should_skip("rhel8-something.qcow2", ["rhel"])
