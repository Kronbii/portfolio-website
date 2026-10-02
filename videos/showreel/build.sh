#!/usr/bin/env bash
# Render, score, and encode the showreel.
#   PLAYWRIGHT_CORE=/path/to/node_modules/playwright-core videos/showreel/build.sh [workdir]
# Frames are rendered at 120 fps and blended in pairs into 60 fps, which gives
# every move a short, film-like motion blur.
set -euo pipefail
cd "$(dirname "$0")/../.."
WORK="${1:-/tmp/showreel-work}"
mkdir -p "$WORK/frames" videos/showreel/out

node videos/showreel/render.mjs --out "$WORK/frames" --workers "${WORKERS:-3}" --fps 120
python3 videos/showreel/audio.py "$WORK/showreel.wav"

ffmpeg -y -hide_banner -loglevel error \
  -framerate 120 -i "$WORK/frames/%05d.png" -i "$WORK/showreel.wav" \
  -filter_complex "[0:v]tblend=all_mode=average,framestep=2,format=yuv420p[v];[1:a]volume=-2.5dB[a]" \
  -map "[v]" -map "[a]" -r 60 \
  -c:v libx264 -preset slow -crf 15 -profile:v high -pix_fmt yuv420p \
  -c:a aac -b:a 256k -movflags +faststart -shortest \
  videos/showreel/out/rami-kronbi-showreel.mp4

ffmpeg -y -hide_banner -loglevel error -ss 3.4 -i videos/showreel/out/rami-kronbi-showreel.mp4 -frames:v 1 videos/showreel/out/poster.png
echo "videos/showreel/out/rami-kronbi-showreel.mp4"
