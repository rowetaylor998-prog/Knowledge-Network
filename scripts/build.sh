#!/usr/bin/env bash

set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STATUS=0

print_header() {
  printf "\n== %s ==\n" "$1"
}

run_step() {
  local label="$1"
  shift

  print_header "$label"
  "$@"
  local result=$?
  if [[ "$result" -ne 0 ]]; then
    printf "FAILED: %s\n" "$label"
    STATUS=1
  else
    printf "OK: %s\n" "$label"
  fi
}

print_header "Build MVP"

if [[ -d "$ROOT_DIR/apps/web" ]]; then
  run_step "Frontend build" bash -c "cd '$ROOT_DIR/apps/web' && npm run build"
else
  printf "FAILED: apps/web directory not found.\n"
  STATUS=1
fi

if [[ -x "$ROOT_DIR/backend/.venv/bin/python" ]]; then
  PYTHON_BIN="$ROOT_DIR/backend/.venv/bin/python"
else
  PYTHON_BIN="$(command -v python3 || command -v python || true)"
fi

if [[ -n "$PYTHON_BIN" ]]; then
  run_step "Backend import check" bash -c "cd '$ROOT_DIR/backend' && PYTHONPATH=. '$PYTHON_BIN' - <<'PY'
import main
print('Imported backend main app:', main.app.title)
PY"
else
  printf "\nSKIP: Python not found, backend import check not run.\n"
fi

print_header "Result"
if [[ "$STATUS" -eq 0 ]]; then
  printf "Build helper finished successfully.\n"
else
  printf "Build helper found failures.\n"
fi

exit "$STATUS"
