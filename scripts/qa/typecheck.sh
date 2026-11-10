#!/usr/bin/env bash
# Serialised TypeScript check (one tsc at a time across concurrent agents).
# Usage: bash scripts/qa/typecheck.sh [grep-filter]
#   With a filter, only error lines matching it are printed (e.g. "src/components/home/Stats").
set -uo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
OUT="$(flock -w 900 /tmp/9werks-tsc.lock npx tsc --noEmit -p tsconfig.json 2>&1)"
STATUS=$?
if [ "${1:-}" != "" ]; then
  echo "$OUT" | grep -E "$1" || echo "no type errors matching: $1"
else
  echo "$OUT" | tail -60
  [ $STATUS -eq 0 ] && echo "tsc: OK"
fi
exit 0
