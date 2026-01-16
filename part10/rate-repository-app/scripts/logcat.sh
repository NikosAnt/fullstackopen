#!/usr/bin/env bash
set -euo pipefail

# Tail logcat for the currently running app process.
# Default package is Expo Go (host.exp.exponent).
#
# Usage:
#   pnpm logcat
#   pnpm logcat:clear
#   ANDROID_PACKAGE=com.your.app pnpm logcat

PACKAGE="${ANDROID_PACKAGE:-host.exp.exponent}"
CLEAR=0

while [ $# -gt 0 ]; do
  case "$1" in
    --clear)
      CLEAR=1
      shift
      ;;
    --package)
      PACKAGE="${2:-}"
      if [[ -z "$PACKAGE" ]]; then
        echo "error: --package requires a value" >&2
        exit 2
      fi
      shift 2
      ;;
    *)
      echo "error: unknown arg: $1" >&2
      echo "usage: $0 [--clear] [--package <android.package>]" >&2
      exit 2
      ;;
  esac
done

if ! command -v adb >/dev/null 2>&1; then
  echo "error: adb not found in PATH" >&2
  exit 127
fi

adb start-server >/dev/null

if [ "$CLEAR" -eq 1 ]; then
  adb logcat -c
fi

pid="$(adb shell pidof -s "$PACKAGE" 2>/dev/null | tr -d '\r' || true)"
if [ -z "$pid" ]; then
  echo "error: couldn't find a running process for package: $PACKAGE" >&2
  echo "tip: open the app on the phone, then retry." >&2
  echo "tip: to discover packages: adb shell pm list packages | grep -i exponent" >&2
  exit 1
fi

echo "Tailing logcat for $PACKAGE (pid=$pid). Ctrl+C to stop."

# Show the most useful tags for React Native / Expo first, silence the rest.
# (You can remove the filters if you want full logs.)
adb logcat --pid="$pid" ReactNativeJS:V ReactNative:V Expo:V Exponent:V *:S
