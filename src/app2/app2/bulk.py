"""`app2 patch` subcommand: bulk-edit a single field across many marketplace yamls."""
import difflib
import io
from enum import Enum
from pathlib import Path
from typing import Any

import typer
from ruamel.yaml import YAML
from ruamel.yaml.scalarstring import (
    DoubleQuotedScalarString,
    SingleQuotedScalarString,
)

from app2 import marketplace


class Op(str, Enum):
    SET = "set"
    APPEND_CSV = "append-csv"
    REMOVE = "remove"


def _walk(data: Any, dotted_path: str) -> tuple[Any, str, Any]:
    """Walk dotted path into ``data``.

    Returns (parent, last_key, current_value). If any intermediate key is
    missing or non-dict, returns (None, "", None).
    """
    keys = dotted_path.split(".")
    parent = data
    for k in keys[:-1]:
        if not isinstance(parent, dict) or k not in parent:
            return None, "", None
        parent = parent[k]
    last = keys[-1]
    if not isinstance(parent, dict) or last not in parent:
        return None, "", None
    return parent, last, parent[last]


def _preserve_quotes(old: Any, new: Any) -> Any:
    """If old was a quoted ruamel scalar, wrap new in the same quoting."""
    if isinstance(old, SingleQuotedScalarString):
        return SingleQuotedScalarString(str(new))
    if isinstance(old, DoubleQuotedScalarString):
        return DoubleQuotedScalarString(str(new))
    return new


def _parse_value(raw: str) -> Any:
    """Parse a CLI string as a YAML scalar, so ints/floats/bools come through typed."""
    return YAML(typ="safe").load(raw)


def apply_op(data: Any, field: str, op: Op, raw_value: str) -> bool:
    """Apply op to ``data`` at ``field``. Returns True if data changed."""
    parent, key, current = _walk(data, field)
    if parent is None:
        return False

    if op is Op.REMOVE:
        del parent[key]
        return True

    if op is Op.SET:
        new = _parse_value(raw_value)
        if current == new:
            return False
        parent[key] = _preserve_quotes(current, new)
        return True

    if op is Op.APPEND_CSV:
        if current is None:
            return False
        cur_str = str(current)
        items = [v.strip() for v in cur_str.split(",")]
        if raw_value in items:
            return False
        new_str = cur_str.rstrip() + ", " + raw_value
        parent[key] = _preserve_quotes(current, new_str)
        return True

    raise ValueError(f"unknown op: {op}")


def patch_files(
    appliances_dir: Path,
    glob_pattern: str,
    field: str,
    op: Op,
    value: str,
    dry_run: bool,
) -> dict[str, int]:
    yamls = sorted(appliances_dir.glob(glob_pattern))
    counts = {"changed": 0, "unchanged": 0, "missing-field": 0, "error": 0}

    if not yamls:
        typer.echo(f"no yamls match {glob_pattern!r} under {appliances_dir}", err=True)
        return counts

    for path in yamls:
        rel = path.relative_to(appliances_dir)

        try:
            yaml = marketplace.roundtrip_yaml()
            with path.open() as f:
                data_before = yaml.load(f)
        except Exception as e:
            typer.echo(f"  ! {rel}: {e}", err=True)
            counts["error"] += 1
            continue

        if not isinstance(data_before, dict):
            counts["missing-field"] += 1
            continue

        parent, _, _ = _walk(data_before, field)
        if parent is None and op is not Op.SET:
            counts["missing-field"] += 1
            continue

        before_buf = io.StringIO()
        yaml.dump(data_before, before_buf)

        with path.open() as f:
            data_after = yaml.load(f)
        try:
            changed = apply_op(data_after, field, op, value)
        except Exception as e:
            typer.echo(f"  ! {rel}: {e}", err=True)
            counts["error"] += 1
            continue

        if not changed:
            if parent is None:
                counts["missing-field"] += 1
            else:
                counts["unchanged"] += 1
            continue

        after_buf = io.StringIO()
        yaml.dump(data_after, after_buf)
        diff = "".join(
            difflib.unified_diff(
                before_buf.getvalue().splitlines(keepends=True),
                after_buf.getvalue().splitlines(keepends=True),
                fromfile=str(path),
                tofile=str(path),
                n=1,
            )
        )

        typer.echo(f"\n  → {rel}")
        for line in diff.splitlines():
            typer.echo(f"    {line}")

        if not dry_run:
            with path.open("w") as f:
                yaml.dump(data_after, f)
            typer.echo("    written.")

        counts["changed"] += 1

    return counts


def patch_cmd(
    appliances_dir: Path = typer.Argument(
        ...,
        exists=True, file_okay=False, dir_okay=True, readable=True,
        help="Marketplace appliances directory.",
    ),
    field: str = typer.Option(
        ..., "--field",
        help="Dotted field path (e.g. 'opennebula_version' or 'opennebula_template.cpu').",
    ),
    op: Op = typer.Option(
        Op.SET, "--op",
        help="Operation: set, append-csv (for comma-separated strings), remove.",
    ),
    value: str = typer.Option(
        "", "--value",
        help="Value (ignored for --op remove).",
    ),
    glob: str = typer.Option(
        "**/*.yaml", "--glob",
        help="Glob (relative to appliances_dir) selecting yamls to patch.",
    ),
    dry_run: bool = typer.Option(
        True, "--dry-run/--apply",
        help="Preview changes without writing.",
    ),
):
    """Bulk-edit a single field across many marketplace yamls."""
    counts = patch_files(appliances_dir, glob, field, op, value, dry_run)

    typer.echo("\n" + "=" * 60)
    typer.echo("Summary:")
    for k in ("changed", "unchanged", "missing-field", "error"):
        v = counts[k]
        if v:
            typer.echo(f"  {k:14s} {v:3d}")

    if counts["error"]:
        raise typer.Exit(code=1)
