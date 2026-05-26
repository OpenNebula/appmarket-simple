"""Configuration loading.

Resolution order (highest priority first):
    1. CLI flags (passed in by callers)
    2. Environment variables (APP2_*)
    3. ~/.config/app2/config.yaml
    4. Built-in defaults
"""
import os
import re
from dataclasses import dataclass, field
from pathlib import Path

from ruamel.yaml import YAML

DEFAULT_CONFIG_PATH = Path.home() / ".config" / "app2" / "config.yaml"


@dataclass
class Config:
    s3_bucket: str | None = None
    s3_prefix: str = ""
    s3_region: str | None = None
    image_url_prefix: str | None = None
    skip_patterns: list[str] = field(default_factory=list)


def load(config_path: Path | None = None) -> Config:
    cfg = Config()

    path = config_path or DEFAULT_CONFIG_PATH
    if path.exists():
        yaml = YAML(typ="safe")
        with path.open() as f:
            data = yaml.load(f) or {}
        s3 = data.get("s3", {}) or {}
        cfg.s3_bucket = s3.get("bucket")
        cfg.s3_prefix = s3.get("prefix", "")
        cfg.s3_region = s3.get("region")
        cfg.image_url_prefix = data.get("image_url_prefix")
        cfg.skip_patterns = data.get("skip_patterns", []) or []

    cfg.s3_bucket = os.getenv("APP2_S3_BUCKET", cfg.s3_bucket)
    cfg.s3_prefix = os.getenv("APP2_S3_PREFIX", cfg.s3_prefix)
    cfg.s3_region = os.getenv("APP2_S3_REGION", cfg.s3_region)
    cfg.image_url_prefix = os.getenv("APP2_IMAGE_URL_PREFIX", cfg.image_url_prefix)

    return cfg


def should_skip(image_name: str, patterns: list[str]) -> bool:
    return any(re.search(p, image_name) for p in patterns)
