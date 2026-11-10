#!/usr/bin/env bash
# Serialise headless-Chrome screenshots across concurrent agents (memory safety).
# Usage: bash scripts/qa/shot.sh <url> <out.png> [options...]   (see shot.mjs)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
exec flock -w 600 /tmp/9werks-chrome.lock node "$ROOT/scripts/qa/shot.mjs" "$@"
