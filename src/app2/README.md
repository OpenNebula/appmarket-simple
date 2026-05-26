# app2

OpenNebula marketplace appliance management CLI.

Successor to the Ruby `app` CLI, focused on bulk operations driven by image
manifests produced by [one-apps](https://github.com/OpenNebula/one-apps):

- Update marketplace yamls from one-apps build manifests (versions, checksums,
  sizes, image URLs).
- Upload images to the CloudFront-backed S3 bucket.
- Patch fields across many appliance yamls.

Handles both qcow2 disk images and `.iso` media (e.g. the `one-context`
contextualization-packages CD-ROM). Matching keys on the image base name,
architecture (qcow2 only; iso has none), and file extension.

## Install (development)

    pip install -e ./src/app2

The `app2` command becomes available on `$PATH`.

Or run without installing:

    PYTHONPATH=src/app2 python -m app2 --help

## Subcommands (planned)

- `app2 release <manifest> <appliances_dir>` — update the marketplace yaml(s)
  and upload the image for a single one-apps manifest. Defaults to `--dry-run`.
- `app2 release-all <images_dir> <appliances_dir>` — same, looped over every
  manifest in `images_dir`.
- `app2 patch <appliances_dir> --filter <glob> --field <path> --op <op> --value <v>`
  — bulk field edit (e.g. append `7.2` to `opennebula_version`).
- `app2 validate <appliances_dir>` — lint appliance yamls for release-readiness:
  required fields, present checksums/size, globally-unique `id`, and (for OS
  appliances) image url base/arch/version matching `name`/`os-arch`/`version`.
  Exits non-zero on errors. Add `--check-urls` to also HEAD every image URL
  (catches missing or non-public objects), `--strict` to fail on warnings too.

## Config

Resolution order (highest priority first):

1. CLI flags.
2. Env vars: `APP2_S3_BUCKET`, `APP2_S3_PREFIX`, `APP2_S3_REGION`,
   `APP2_IMAGE_URL_PREFIX`.
3. `~/.config/app2/config.yaml`.
4. Built-in defaults.

Example config:

```yaml
s3:
  bucket: opennebula-marketplace
  prefix: ""
  region: us-east-1
image_url_prefix: https://d24fmfybwxpuhu.cloudfront.net/
skip_patterns:
  - '^rhel'
  - '^sles'
```
