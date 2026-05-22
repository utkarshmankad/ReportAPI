#!/usr/bin/env bash
# Unit tests for scripts/start.sh
# Tests source the script's functions directly via SOURCED=true guard.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PASS=0; FAIL=0

# ── Minimal test harness ──────────────────────────────────────────────────────
assert_eq() {
  local desc="$1" expected="$2" actual="$3"
  if [[ "$expected" == "$actual" ]]; then
    echo "  PASS  $desc"
    (( PASS++ )) || true
  else
    echo "  FAIL  $desc"
    echo "        expected: $expected"
    echo "        actual:   $actual"
    (( FAIL++ )) || true
  fi
}

assert_exit_ok() {
  local desc="$1"; shift
  if "$@" &>/dev/null; then
    echo "  PASS  $desc"
    (( PASS++ )) || true
  else
    echo "  FAIL  $desc (expected exit 0, got $?)"
    (( FAIL++ )) || true
  fi
}

assert_exit_err() {
  local desc="$1"; shift
  if ! "$@" &>/dev/null; then
    echo "  PASS  $desc"
    (( PASS++ )) || true
  else
    echo "  FAIL  $desc (expected non-zero exit)"
    (( FAIL++ )) || true
  fi
}

# ── Load the script's functions without running main ─────────────────────────
# We re-source the relevant pieces by defining stubs and extracting functions.

# Stubs so parse_args / check functions can be sourced without side effects
node()  { echo "v20.11.0"; }
lsof()  { return 1; }          # port always free by default
npm()   { return 0; }
export -f node lsof npm 2>/dev/null || true

ROOT_DIR="$SCRIPT_DIR/.."
MODE="dev"; PORT=3000; SKIP_INSTALL=false
NODE_MIN_MAJOR=18; NODE_MIN_MINOR=17

info()  { :; }
ok()    { :; }
warn()  { :; }
die()   { echo "$*" >&2; exit 1; }

source_functions() {
  # Extract and eval just the function definitions from start.sh
  # (everything between the first 'fn()' and closing '}' blocks, skip main)
  local fn
  for fn in parse_args check_node check_deps check_port; do
    eval "$(sed -n "/^${fn}()/,/^}/p" "$SCRIPT_DIR/start.sh")"
  done
}

source_functions

# ── Tests: parse_args ─────────────────────────────────────────────────────────
echo ""
echo "parse_args"

MODE="dev"; PORT=3000; SKIP_INSTALL=false
parse_args --prod
assert_eq "--prod sets MODE=prod" "prod" "$MODE"

MODE="dev"; PORT=3000; SKIP_INSTALL=false
parse_args --port=4000
assert_eq "--port=4000 sets PORT=4000" "4000" "$PORT"

MODE="dev"; PORT=3000; SKIP_INSTALL=false
parse_args --skip-install
assert_eq "--skip-install sets SKIP_INSTALL=true" "true" "$SKIP_INSTALL"

MODE="dev"; PORT=3000; SKIP_INSTALL=false
parse_args --prod --port=8080
assert_eq "combined: MODE=prod" "prod" "$MODE"
assert_eq "combined: PORT=8080" "8080" "$PORT"

# Unknown arg should exit non-zero
assert_exit_err "unknown arg exits non-zero" bash -c "
  MODE=dev; PORT=3000; SKIP_INSTALL=false
  die() { exit 1; }
  $(sed -n '/^parse_args()/,/^}/p' "$SCRIPT_DIR/start.sh")
  parse_args --unknown 2>/dev/null
"

# ── Tests: check_node ─────────────────────────────────────────────────────────
echo ""
echo "check_node"

node() { echo "v20.11.0"; }
NODE_MIN_MAJOR=18; NODE_MIN_MINOR=17
assert_exit_ok "v20.11.0 passes (>= 18.17)" bash -c "
  node() { echo 'v20.11.0'; }
  NODE_MIN_MAJOR=18; NODE_MIN_MINOR=17
  ok() { :; }; die() { echo \"\$*\" >&2; exit 1; }
  $(sed -n '/^check_node()/,/^}/p' "$SCRIPT_DIR/start.sh")
  check_node
"

assert_exit_err "v16.0.0 fails (< 18.17)" bash -c "
  node() { echo 'v16.0.0'; }
  NODE_MIN_MAJOR=18; NODE_MIN_MINOR=17
  ok() { :; }; die() { echo \"\$*\" >&2; exit 1; }
  $(sed -n '/^check_node()/,/^}/p' "$SCRIPT_DIR/start.sh")
  check_node
"

assert_exit_err "v18.0.0 fails (< 18.17)" bash -c "
  node() { echo 'v18.0.0'; }
  NODE_MIN_MAJOR=18; NODE_MIN_MINOR=17
  ok() { :; }; die() { echo \"\$*\" >&2; exit 1; }
  $(sed -n '/^check_node()/,/^}/p' "$SCRIPT_DIR/start.sh")
  check_node
"

assert_exit_ok "v18.17.0 passes (== min)" bash -c "
  node() { echo 'v18.17.0'; }
  NODE_MIN_MAJOR=18; NODE_MIN_MINOR=17
  ok() { :; }; die() { echo \"\$*\" >&2; exit 1; }
  $(sed -n '/^check_node()/,/^}/p' "$SCRIPT_DIR/start.sh")
  check_node
"

# ── Tests: check_port ─────────────────────────────────────────────────────────
echo ""
echo "check_port"

assert_exit_ok "port 3000 is valid + free" bash -c "
  PORT=3000
  lsof() { return 1; }
  ok() { :; }; die() { echo \"\$*\" >&2; exit 1; }
  $(sed -n '/^check_port()/,/^}/p' "$SCRIPT_DIR/start.sh")
  check_port
"

assert_exit_err "port 0 is invalid" bash -c "
  PORT=0
  lsof() { return 1; }
  ok() { :; }; die() { echo \"\$*\" >&2; exit 1; }
  $(sed -n '/^check_port()/,/^}/p' "$SCRIPT_DIR/start.sh")
  check_port
"

assert_exit_err "port 99999 is invalid" bash -c "
  PORT=99999
  lsof() { return 1; }
  ok() { :; }; die() { echo \"\$*\" >&2; exit 1; }
  $(sed -n '/^check_port()/,/^}/p' "$SCRIPT_DIR/start.sh")
  check_port
"

assert_exit_err "occupied port fails" bash -c "
  PORT=3000
  lsof() { return 0; }   # simulate port in use
  ok() { :; }; die() { echo \"\$*\" >&2; exit 1; }
  $(sed -n '/^check_port()/,/^}/p' "$SCRIPT_DIR/start.sh")
  check_port
"

assert_exit_err "non-numeric port fails" bash -c "
  PORT=abc
  lsof() { return 1; }
  ok() { :; }; die() { echo \"\$*\" >&2; exit 1; }
  $(sed -n '/^check_port()/,/^}/p' "$SCRIPT_DIR/start.sh")
  check_port
"

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo "──────────────────────────────────"
TOTAL=$(( PASS + FAIL ))
echo "Results: ${PASS}/${TOTAL} passed"
if (( FAIL > 0 )); then
  echo "FAILED: ${FAIL} test(s)"
  exit 1
fi
echo "All tests passed."
