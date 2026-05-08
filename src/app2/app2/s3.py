"""S3 upload with sha256-based idempotency.

We tag every uploaded object with ``x-amz-meta-sha256`` so subsequent runs can
HEAD the object and skip the upload when content is unchanged. This avoids
relying on S3 ETag, which is multipart-aware and can't be compared to a plain
file md5 for large objects.

AWS credentials/region come from boto3's default chain (env vars,
``~/.aws/credentials``, IAM role).
"""
import sys
from pathlib import Path

import boto3
from botocore.exceptions import ClientError

from app2.checksum import FileDigest

SHA256_META_KEY = "sha256"
_PRINT_EVERY_BYTES = 1024 * 1024  # throttle progress updates to ~1 MiB


def _format_bytes(n: float) -> str:
    for unit in ("B", "KiB", "MiB", "GiB"):
        if n < 1024:
            return f"{n:.1f} {unit}"
        n /= 1024
    return f"{n:.1f} TiB"


class _ProgressCallback:
    """boto3 upload Callback: receives delta bytes per call, accumulates total."""

    def __init__(self, total: int, indent: str = "    "):
        self.total = total
        self.uploaded = 0
        self.indent = indent
        self._last_printed = 0
        self._tty = sys.stdout.isatty()

    def __call__(self, bytes_amount: int) -> None:
        self.uploaded += bytes_amount
        is_done = self.uploaded >= self.total
        if not is_done and self.uploaded - self._last_printed < _PRINT_EVERY_BYTES:
            return
        self._last_printed = self.uploaded
        pct = (self.uploaded / self.total * 100) if self.total else 0
        line = (
            f"{self.indent}uploaded {_format_bytes(self.uploaded)}"
            f" / {_format_bytes(self.total)} ({pct:.1f}%)"
        )
        if self._tty:
            sys.stdout.write(f"\r{line}")
            if is_done:
                sys.stdout.write("\n")
        else:
            sys.stdout.write(f"{line}\n")
        sys.stdout.flush()


def _client(region: str | None):
    if region:
        return boto3.client("s3", region_name=region)
    return boto3.client("s3")


def already_uploaded(
    bucket: str, key: str, digest: FileDigest, region: str | None = None
) -> bool:
    """True if an object at (bucket, key) matches digest size and sha256 metadata."""
    s3 = _client(region)
    try:
        head = s3.head_object(Bucket=bucket, Key=key)
    except ClientError as e:
        code = e.response.get("Error", {}).get("Code", "")
        if code in ("404", "NoSuchKey", "NotFound"):
            return False
        raise

    if int(head.get("ContentLength", -1)) != digest.size:
        return False
    return head.get("Metadata", {}).get(SHA256_META_KEY) == digest.sha256


def upload(
    path: Path,
    bucket: str,
    key: str,
    digest: FileDigest,
    region: str | None = None,
    content_type: str = "application/octet-stream",
    acl: str = "public-read",
) -> None:
    s3 = _client(region)
    s3.upload_file(
        Filename=str(path),
        Bucket=bucket,
        Key=key,
        ExtraArgs={
            "ContentType": content_type,
            "ACL": acl,
            "Metadata": {SHA256_META_KEY: digest.sha256},
        },
        Callback=_ProgressCallback(digest.size),
    )
