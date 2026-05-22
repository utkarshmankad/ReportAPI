#!/usr/bin/env bash
# ReportAPI frontend startup script
# Usage: ./scripts/start.sh [--prod] [--port=<n>] [--skip-install]
set -euo pipefail

# ── Colours ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; BOLD='\033[1m'; NC='\033[0m'

info()  { echo -e "${BLUE}▸${NC}  $*"; }
ok()    { echo -e "${GREEN}✓${NC}  $*"; }
warn()  { echo -e "${YELLOW}⚠${NC}  $*"; }
die()   { echo -e "${RED}✗${NC}  $*" >&2; exit 1; }

# ── Defaults ──────────────────────────────────────────────────────────────────
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MODE="dev"
PORT=3000
SKIP_INSTALL=false

# Minimum Node.js version required by Next.js 14
NODE_MIN_MAJOR=18
NODE_MIN_MINOR=17

# ── Argument parsing ──────────────────────────────────────────────────────────
parse_args() {
  for arg in "$@"; do
    case "$arg" in
      --prod)           MODE="prod" ;;
      --port=*)         PORT="${arg#*=}" ;;
      --skip-install)   SKIP_INSTALL=true ;;
      --help|-h)
        echo "Usage: $0 [--prod] [--port=<n>] [--skip-install]"
        echo ""
        echo "  --prod            Build then start production server"
        echo "  --port=<n>        Listen on port n (default: 3000)"
        echo "  --skip-install    Skip npm ci / npm install check"
        exit 0
        ;;
      *) die "Unknown argument: $arg" ;;
    esac
  done
}

# ── Node.js version check ─────────────────────────────────────────────────────
check_node() {
  if ! command -v node &>/dev/null; then
    die "Node.js not found. Install Node.js >= ${NODE_MIN_MAJOR}.${NODE_MIN_MINOR} from https://nodejs.org"
  fi

  local version
  version="$(node --version)"          # e.g. v20.11.0
  local digits="${version#v}"           # 20.11.0
  local major minor
  major="$(echo "$digits" | cut -d. -f1)"
  minor="$(echo "$digits" | cut -d. -f2)"

  if (( major < NODE_MIN_MAJOR )) || \
     (( major == NODE_MIN_MAJOR && minor < NODE_MIN_MINOR )); then
    die "Node.js ${version} is too old. Minimum required: v${NODE_MIN_MAJOR}.${NODE_MIN_MINOR}.0"
  fi

  ok "Node.js ${version}"
}

# ── Dependency install ────────────────────────────────────────────────────────
check_deps() {
  if [[ "$SKIP_INSTALL" == true ]]; then
    warn "Skipping dependency check (--skip-install)"
    return
  fi

  if [[ ! -d "$ROOT_DIR/node_modules" ]]; then
    info "node_modules not found — running npm ci"
    npm ci --prefix "$ROOT_DIR"
    ok "Dependencies installed"
    return
  fi

  # Reinstall if package-lock.json is newer than node_modules
  if [[ "$ROOT_DIR/package-lock.json" -nt "$ROOT_DIR/node_modules" ]]; then
    info "package-lock.json changed — running npm ci"
    npm ci --prefix "$ROOT_DIR"
    ok "Dependencies updated"
  else
    ok "Dependencies up to date"
  fi
}

# ── Port availability ─────────────────────────────────────────────────────────
check_port() {
  if ! [[ "$PORT" =~ ^[0-9]+$ ]] || (( PORT < 1 || PORT > 65535 )); then
    die "Invalid port: ${PORT}"
  fi

  if lsof -iTCP:"$PORT" -sTCP:LISTEN &>/dev/null 2>&1; then
    die "Port ${PORT} is already in use. Choose another with --port=<n>"
  fi

  ok "Port ${PORT} is free"
}

# ── Main ──────────────────────────────────────────────────────────────────────
main() {
  parse_args "$@"

  echo ""
  echo -e "${BOLD}ReportAPI — frontend startup${NC}"
  echo -e "Mode: ${BLUE}${MODE}${NC}   Port: ${BLUE}${PORT}${NC}"
  echo "──────────────────────────────────"

  check_node
  check_deps
  check_port

  echo "──────────────────────────────────"

  cd "$ROOT_DIR"

  if [[ "$MODE" == "prod" ]]; then
    info "Building for production…"
    npm run build
    ok "Build complete"
    echo "──────────────────────────────────"
    info "Starting production server on port ${PORT}…"
    exec env PORT="$PORT" npm run start
  else
    info "Starting dev server on port ${PORT}…"
    exec env PORT="$PORT" npm run dev
  fi
}

main "$@"
