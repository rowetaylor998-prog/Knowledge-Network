#!/usr/bin/env bash

set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STATUS=0

print_header() {
  printf "\n== %s ==\n" "$1"
}

check_file() {
  local path="$1"
  if [[ -f "$ROOT_DIR/$path" ]]; then
    printf "OK   %s\n" "$path"
  else
    printf "MISS %s\n" "$path"
    STATUS=1
  fi
}

print_header "Node"
if command -v node >/dev/null 2>&1; then
  node --version
else
  printf "MISS node command not found.\n"
  STATUS=1
fi

if command -v npm >/dev/null 2>&1; then
  npm --version
else
  printf "MISS npm command not found.\n"
  STATUS=1
fi

print_header "Python"
if command -v python3 >/dev/null 2>&1; then
  python3 --version
elif command -v python >/dev/null 2>&1; then
  python --version
else
  printf "MISS python command not found.\n"
  STATUS=1
fi

print_header "Backend Health"
if command -v curl >/dev/null 2>&1; then
  if curl -fsS http://127.0.0.1:8000/health >/tmp/bk-health-check.json 2>/dev/null; then
    printf "OK   backend health endpoint responded: "
    cat /tmp/bk-health-check.json
    printf "\n"
  else
    printf "SKIP backend health endpoint not reachable at http://127.0.0.1:8000/health\n"
    printf "     Start it with: cd backend && uvicorn main:app --reload\n"
  fi
else
  printf "SKIP curl not found; cannot check backend health.\n"
fi

print_header "Frontend Build Folder"
if [[ -f "$ROOT_DIR/apps/web/dist/index.html" ]]; then
  printf "OK   apps/web/dist/index.html exists.\n"
else
  printf "MISS apps/web/dist/index.html not found.\n"
  printf "     Build it with: cd apps/web && npm run build\n"
fi

print_header "Environment Examples"
check_file ".env.example"
check_file "backend/.env.example"
check_file "apps/web/.env.example"

print_header "Result"
if [[ "$STATUS" -eq 0 ]]; then
  printf "Check helper finished. Review any SKIP messages above.\n"
else
  printf "Check helper found missing required tools or files.\n"
fi

exit "$STATUS"
