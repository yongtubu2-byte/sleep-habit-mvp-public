#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
NODE_BIN="$(command -v node || true)"
PLIST="$HOME/Library/LaunchAgents/com.kyungokdang.privacy-gateway.plist"
LOG_DIR="$HOME/Library/Logs/Kyungokdang"
SCRIPT_PATH="$ROOT_DIR/scripts/local-privacy-gateway.mjs"

if [[ -z "$NODE_BIN" ]]; then
  echo "Node.js was not found in PATH."
  exit 1
fi

if [[ ! -f "$SCRIPT_PATH" ]]; then
  echo "Privacy gateway launcher not found: $SCRIPT_PATH"
  exit 1
fi

mkdir -p "$HOME/Library/LaunchAgents" "$LOG_DIR"

cat > "$PLIST" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.kyungokdang.privacy-gateway</string>

  <key>ProgramArguments</key>
  <array>
    <string>$NODE_BIN</string>
    <string>$SCRIPT_PATH</string>
  </array>

  <key>WorkingDirectory</key>
  <string>$ROOT_DIR</string>

  <key>EnvironmentVariables</key>
  <dict>
    <key>NODE_ENV</key>
    <string>production</string>
    <key>KYUNGOKDANG_PRIVACY_HOST</key>
    <string>127.0.0.1</string>
    <key>KYUNGOKDANG_PRIVACY_PORT</key>
    <string>8788</string>
  </dict>

  <key>RunAtLoad</key>
  <true/>

  <key>KeepAlive</key>
  <true/>

  <key>StandardOutPath</key>
  <string>$LOG_DIR/privacy-gateway.out.log</string>

  <key>StandardErrorPath</key>
  <string>$LOG_DIR/privacy-gateway.err.log</string>
</dict>
</plist>
PLIST

chmod 600 "$PLIST"

launchctl bootout "gui/$(id -u)/com.kyungokdang.privacy-gateway" >/dev/null 2>&1 || true
launchctl bootstrap "gui/$(id -u)" "$PLIST"
launchctl kickstart -k "gui/$(id -u)/com.kyungokdang.privacy-gateway"

echo "Installed: $PLIST"
echo "Health check: curl http://127.0.0.1:8788/health"
echo "Logs: $LOG_DIR"
