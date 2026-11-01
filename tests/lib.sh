# Fonctions communes aux scripts de test (à sourcer).
# Principe : prisma/milestone.db (montée par la prod, schema.prisma : url en dur) n'est JAMAIS
# touchée. Les tests tournent dans une copie temporaire du dépôt, supprimée à la sortie.
WORK=

# Copie le dépôt (sans base, build, caches ni node_modules) dans un dossier temporaire,
# copie le CONTENU de node_modules (même si node_modules est lui-même un lien : `cp -a` recopierait
# le lien et `prisma generate` réécrirait le client du vrai dépôt), vérifie que la copie est bien
# isolée, puis s'y place. Nécessite rsync.
make_workdir() {
  command -v rsync >/dev/null || { echo "rsync requis" >&2; exit 1; }
  local root
  root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
  WORK=$(mktemp -d)
  rsync -a \
    --exclude='/.git' --exclude='/node_modules' --exclude='/.output' --exclude='/.nuxt' \
    --exclude='/.env' --exclude='/tests/.tmp' --exclude='/prisma/milestone.db*' \
    "$root/" "$WORK/"
  ensure_real_client "$root"
  mkdir "$WORK/node_modules"
  cp -a "$root/node_modules/." "$WORK/node_modules/"
  assert_copy_inside_work
  cd "$WORK"
}

# Prépare le dépôt réel (racine $1) : npm install si node_modules manque, prisma generate si le
# client est absent (client_relpath en a besoin comme référence). État normal d'un clone prêt.
ensure_real_client() {
  local root=$1
  [ -d "$root/node_modules" ] || (cd "$root" && npm install)
  [ -f "$root/node_modules/.prisma/client/index.js" ] || (cd "$root" && npx prisma generate)
}

# Contrôle PRÉVENTIF, avant `prisma generate` : le client de la copie doit vivre dans $WORK.
assert_copy_inside_work() {
  local work target
  work=$(realpath "$WORK")
  target=$(realpath "$WORK/node_modules/.prisma/client" 2>/dev/null || realpath "$WORK/node_modules")
  case "$target/" in
    "$work"/*) ;;
    *) echo "ISOLATION KO : le client Prisma de la copie ($target) est hors de $work ; prisma generate réécrirait le dépôt réel" >&2; exit 1;;
  esac
}

# Dossier de captures (si PW_DIR) hors de la copie, sinon elles seraient supprimées avec elle.
# Un SHOTS relatif part de la racine du dépôt ; à appeler AVANT make_workdir (qui fait cd).
prepare_shots() {
  [ -n "${PW_DIR:-}" ] || return 0
  SHOTS=${SHOTS:-$(mktemp -d)}
  case "$SHOTS" in /*) ;; *) SHOTS=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/$SHOTS;; esac
  mkdir -p "$SHOTS"; export SHOTS
}

# Chemin relatif de la base que le client Prisma de $1 (racine d'un dépôt) a en mémoire.
client_relpath() {
  local f="$1/node_modules/.prisma/client/index.js"
  [ -f "$f" ] || { echo "<absent>"; return 0; }
  { grep -m1 '"relativePath"' "$f" || true; } | sed 's/.*: *"\(.*\)".*/\1/'
}

# Contrôle d'isolation, à lancer dans la copie après `prisma generate` :
# le client du dépôt réel ($1 = sa racine, $2 = relativePath relevé AVANT) doit être inchangé,
# et celui de la copie doit pointer sur le prisma/ de la copie.
assert_isolation() {
  local root=$1 before=$2 after copy
  after=$(client_relpath "$root")
  copy=$(client_relpath "$PWD")
  if [ "$after" != "$before" ]; then
    echo "ISOLATION KO : le client Prisma du dépôt réel a changé ($before -> $after)" >&2
    echo "Réparation : (cd \"$root\" && npx prisma generate)" >&2; exit 1
  fi
  if [ "$copy" != "../../../prisma" ]; then
    echo "ISOLATION KO : le client de la copie vise $copy au lieu de ../../../prisma" >&2; exit 1
  fi
  echo "isolation OK (dépôt réel inchangé : $after)"
}

remove_workdir() {
  # $WORK ne contient plus aucun lien vers le dépôt réel (node_modules est une vraie copie) ;
  # on refuse tout de même de supprimer un dossier qui n'est pas sous un mktemp.
  case "$WORK" in /*/tmp.*|/tmp/*) ;; *) [ -z "$WORK" ] || echo "WORK suspect, non supprimé : $WORK" >&2; return 0;; esac
  if [ -d "$WORK" ]; then cd / && rm -rf "$WORK"; fi
}

# Refuse de démarrer si l'un des ports répond déjà.
require_free_ports() {
  for port in "$@"; do
    if curl -s -o /dev/null --max-time 2 "http://127.0.0.1:$port/"; then
      echo "port $port occupé" >&2
      exit 1
    fi
  done
}

# Attend que le faux OAuth réponde, et vérifie que son processus (PID $1) est toujours là.
wait_fake_oauth() {
  for _ in $(seq 1 20); do curl -s -o /dev/null --max-time 1 http://127.0.0.1:4500/ && break; sleep 0.25; done
  kill -0 "$1" 2>/dev/null || { echo "faux OAuth mort (port 4500 pris ?)" >&2; exit 1; }
}
