#!/usr/bin/env bash
set -euo pipefail

ADB_CONNECT_IP_DEFAULT="192.168.1.3"
ADB_CONNECT_PORT_DEFAULT="35801"

ADB_CONNECT_IP="${ADB_CONNECT_IP:-$ADB_CONNECT_IP_DEFAULT}"

if [[ -n "${ADB_CONNECT_ADDR:-}" ]]; then
  ADB_CONNECT_ADDR="${ADB_CONNECT_ADDR}"
else
  ADB_CONNECT_PORT="${1:-${ADB_CONNECT_PORT:-$ADB_CONNECT_PORT_DEFAULT}}"

  ADB_CONNECT_ADDR="${ADB_CONNECT_IP}:${ADB_CONNECT_PORT}"
fi

if ! command -v adb >/dev/null 2>&1; then
  echo "error: adb not found in PATH" >&2
  exit 127
fi

adb start-server >/dev/null

echo "adb connect ${ADB_CONNECT_ADDR}"
# If you're already connected (or USB is connected), this is harmless.
# If the connect fails, we'll still attempt reverse (it will error if no device exists).
adb connect "${ADB_CONNECT_ADDR}" || true

# Give adb a moment to register the device.
sleep 0.2