#!/usr/bin/env bash
# Test sans Docker : build, base de test, faux OAuth, serveur Nitro, tests API.
# Usage : bash tests/run-local.sh   (Node 20+, depuis n'importe où)
# Tout se passe dans une copie temporaire du dépôt : prisma/milestone.db n'est jamais touchée.
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/.." && pwd)
FAKE=http://127.0.0.1:4500
PIDS=()
source "$ROOT/tests/lib.sh"
cleanup() {
  set +e
  for p in "${PIDS[@]:-}"; do [ -n "$p" ] && kill "$p" 2>/dev/null || true; done
  remove_workdir
}
trap cleanup EXIT

require_free_ports 3000 4500
prepare_shots
ensure_real_client "$ROOT"
REAL_RELPATH=$(client_relpath "$ROOT")
make_workdir

npx prisma generate
assert_isolation "$ROOT" "$REAL_RELPATH"
npx prisma migrate deploy
node tests/seed-test-db.mjs
npm run build
mkdir -p .output/server/prisma
cp prisma/milestone.db .output/server/prisma/milestone.db

node tests/fake-oauth.mjs & FAKE_PID=$!; PIDS+=($FAKE_PID)
wait_fake_oauth "$FAKE_PID"

# Nitro lit HOST et PORT (pas NUXT_HOST / NUXT_PORT).
HOST=127.0.0.1 PORT=3000 JWT_SECRET=test-jwt-secret \
NUXT_PUBLIC_API_BASE=http://127.0.0.1:3000 \
NUXT_PUBLIC_DISCORD_CLIENT_ID=fake-discord-id NUXT_DISCORD_CLIENT_SECRET=fake-discord-secret \
NUXT_PUBLIC_DISCORD_CLIENT_REDIRECT='http://127.0.0.1:3000/?service=discord' \
NUXT_PUBLIC_TWITCH_CLIENT_ID=fake-twitch-id NUXT_TWITCH_CLIENT_SECRET=fake-twitch-secret \
NUXT_PUBLIC_TWITCH_CLIENT_REDIRECT='http://127.0.0.1:3000/?service=twitch' \
NUXT_OAUTH_DISCORD_API_BASE=$FAKE NUXT_OAUTH_TWITCH_ID_BASE=$FAKE NUXT_OAUTH_TWITCH_API_BASE=$FAKE \
node .output/server/index.mjs & SERVER=$!; PIDS+=($SERVER)

for _ in $(seq 1 40); do curl -sf http://127.0.0.1:3000/ >/dev/null && break; sleep 0.5; done
kill -0 "$SERVER" 2>/dev/null || { echo "serveur mort" >&2; exit 1; }
node --test tests/api.test.mjs
if [ -n "${PW_DIR:-}" ]; then
  node tests/browser.mjs
  echo "captures : $SHOTS"
fi
