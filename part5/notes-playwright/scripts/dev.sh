#!/bin/zsh
concurrently \
"cd ../notes-frontend && pnpm dev" \
"cd ../../part4/notes-backend && pnpm start:test"