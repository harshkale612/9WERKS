#!/usr/bin/env bash
# 9WERKS — workshop reel encoding (authentic footage from 9werksofficial.com).
# Produces a web-optimised H.264 MP4 (universal) and a VP9 WebM (smaller, Chromium/Firefox),
# both muted (the source has no audio track), with fast-start for progressive playback.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SRC="$ROOT/assets-src/video/z4-reel.mp4"
OUT="$ROOT/public/assets/video"
mkdir -p "$OUT"

ffmpeg -y -loglevel error -i "$SRC" -an -c:v libx264 -preset slow -crf 30 -profile:v high -pix_fmt yuv420p \
  -movflags +faststart "$OUT/workshop-reel.mp4"

ffmpeg -y -loglevel error -i "$SRC" -an -c:v libvpx-vp9 -crf 42 -b:v 0 -row-mt 1 -deadline good -cpu-used 2 \
  "$OUT/workshop-reel.webm"

ls -la "$OUT"
