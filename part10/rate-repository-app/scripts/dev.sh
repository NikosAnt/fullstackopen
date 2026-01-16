#!/usr/bin/env bash
set -euo pipefail

# Determine a usable host IP for the Expo app to reach the local API.
# Priority: existing EXPO_PUBLIC_API_BASE_URL env var -> EXPO_PUBLIC_IP -> auto-detect -> localhost
if [ -z "${EXPO_PUBLIC_API_BASE_URL:-}" ]; then
  # Allow explicit IP override via EXPO_PUBLIC_IP.
  if [ -n "${EXPO_PUBLIC_IP:-}" ]; then
    HOST_IP="$EXPO_PUBLIC_IP"
  else
    # Try hostname -I (first non-loopback IPv4), then ip route, else localhost.
    HOST_IP="$(hostname -I 2>/dev/null | awk '{print $1}' || true)"
    if [ -z "$HOST_IP" ]; then
      HOST_IP="$(ip route get 8.8.8.8 2>/dev/null | awk '/src/ {print $7; exit}' || true)"
    fi
    if [ -z "$HOST_IP" ]; then
      HOST_IP="localhost"
    fi
  fi
  export EXPO_PUBLIC_API_BASE_URL="http://${HOST_IP}"
fi

bash "$(dirname "$0")/adb-connect.sh"

API_DIR="$(cd "$(dirname "$0")/../../rate-repository-api" && pwd)"
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "[dev] Starting API..."
cd "$API_DIR"
pnpm start &
API_PID=$!

cleanup() {
  if kill -0 "$API_PID" 2>/dev/null; then
    kill "$API_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

echo "[dev] Waiting for GraphQL endpoint (http://localhost:4000/graphql)..."
graphql_ping() {
  curl -fsS \
    -X POST \
    -H 'content-type: application/json' \
    --data '{"query":"query{__typename}"}' \
    "http://localhost:4000/graphql" \
    >/dev/null 2>&1
}

for _ in {1..60}; do
  if graphql_ping; then
    break
  fi
  sleep 1
done

if ! graphql_ping; then
  echo "[dev] ERROR: GraphQL endpoint not reachable after 60s" >&2
  exit 1
fi

echo "[dev] Running codegen..."
cd "$APP_DIR"
pnpm codegen

echo "[dev] Starting Expo (Android)..."
pnpm android
