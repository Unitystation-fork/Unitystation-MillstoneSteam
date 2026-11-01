#!/usr/bin/env bash
# Test avec Docker, dans une copie temporaire du dépôt (prisma/milestone.db n'est jamais touchée) :
# base de test, faux OAuth, image construite, tests API (et navigateur si PW_DIR).
# Usage : bash tests/run-docker.sh   (Node 20+, accès à docker ; ex. sg docker -c "bash tests/run-docker.sh")
# Utilise le projet « millstone-test » et le conteneur « app-test » : ne touche ni à « app » ni à la prod.
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/.." && pwd)
# Les variables du shell priment sur --env-file : on les retire pour que tests/test.env s'applique.
unset DISCORD_CLIENT_ID DISCORD_CLIENT_SECRET DISCORD_CLIENT_REDIRECT TWITCH_CLIENT_ID TWITCH_CLIENT_SECRET TWITCH_CLIENT_REDIRECT
PIDS=()
source "$ROOT/tests/lib.sh"
COMPOSE=(docker compose -p millstone-test --env-file tests/test.env -f docker-compose.yml -f tests/compose.test.yml)
cleanup() {
  set +e
  for p in "${PIDS[@]:-}"; do [ -n "$p" ] && kill "$p" 2>/dev/null || true; done
  "${COMPOSE[@]}" down -v --remove-orphans >/dev/null 2>&1 || true
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
mkdir -p tests/.tmp
mv prisma/milestone.db tests/.tmp/milestone.db

node tests/fake-oauth.mjs & FAKE_PID=$!; PIDS+=($FAKE_PID)
wait_fake_oauth "$FAKE_PID"

"${COMPOSE[@]}" config >/dev/null
"${COMPOSE[@]}" up -d --build

for _ in $(seq 1 60); do curl -sf http://127.0.0.1:3000/ >/dev/null && break; sleep 1; done
[ "$(docker inspect -f '{{.State.Running}}' app-test 2>/dev/null)" = true ] || { echo "conteneur app-test arrêté" >&2; "${COMPOSE[@]}" logs app >&2; exit 1; }
node --test tests/api.test.mjs
if [ -n "${PW_DIR:-}" ]; then
  node tests/browser.mjs
  echo "captures : $SHOTS"
fi
