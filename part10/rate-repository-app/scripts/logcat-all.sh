#!/usr/bin/env bash
set -euo pipefail

# Tail logcat for the currently running app process, without tag filtering.
# Default package is Expo Go (host.exp.exponent).
#
# Usage:
#   pnpm logcat:all
#   ANDROID_PACKAGE=com.your.app pnpm logcat:all

PACKAGE="${ANDROID_PACKAGE:-host.exp.exponent}"

if ! command -v adb >/dev/null 2>&1; then
  echo "error: adb not found in PATH" >&2
  exit 127
fi

adb start-server >/dev/null

pid="$(adb shell pidof -s "$PACKAGE" 2>/dev/null | tr -d '\r' || true)"
if [ -z "$pid" ]; then
  echo "error: couldn't find a running process for package: $PACKAGE" >&2
  echo "tip: open the app on the phone, then retry." >&2
  exit 1
fi

echo "Tailing ALL logcat for $PACKAGE (pid=$pid). Ctrl+C to stop."

# No tag filters; show everything from that process.
adb logcat --pid="$pid" *:V
