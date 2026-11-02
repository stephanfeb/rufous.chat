#!/usr/bin/env bash
# Renders the social card to assets/img/social-card.png (1200x630 PNG). Needs Google Chrome and a network
# connection for the Google Fonts.
set -euo pipefail
cd "$(dirname "$0")"
chrome="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$chrome" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files \
  --force-device-scale-factor=1 --window-size=1200,630 --virtual-time-budget=5000 \
  --screenshot="$PWD/../assets/img/social-card.png" "file://$PWD/card.html" 2>/dev/null
ls -l ../assets/img/social-card.png
