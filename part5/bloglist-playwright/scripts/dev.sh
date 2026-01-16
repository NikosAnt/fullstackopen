#!/bin/zsh
concurrently \
"cd ../bloglist-frontend && pnpm dev" \
"cd ../../part4/bloglist-backend && pnpm start:test"