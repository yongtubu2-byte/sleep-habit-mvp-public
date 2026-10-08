#!/usr/bin/env bash
set -euo pipefail

PLIST="$HOME/Library/LaunchAgents/com.kyungokdang.privacy-gateway.plist"

launchctl bootout "gui/$(id -u)/com.kyungokdang.privacy-gateway" >/dev/null 2>&1 || true
rm -f "$PLIST"

echo "Kyungokdang privacy gateway LaunchAgent removed."
