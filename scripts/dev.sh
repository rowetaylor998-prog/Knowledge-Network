#!/usr/bin/env bash

set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
WEB_DIR="$ROOT_DIR/apps/web"

print_header() {
  printf "\n== %s ==\n" "$1"
}

has_command() {
  command -v "$1" >/dev/null 2>&1
}

cleanup() {
  if [[ -n "${BACKEND_PID:-}" ]]; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
  if [[ -n "${FRONTEND_PID:-}" ]]; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

print_header "Be Knowledgeable MVP Development"
printf "Backend:  http://127.0.0.1:8000\n"
printf "Frontend: http://127.0.0.1:5173\n"

if ! has_command npm; then
  printf "\nMissing npm. Start the frontend manually after installing Node.js:\n"
  printf "  cd apps/web\n  npm install\n  npm run dev\n"
  exit 1
fi

if [[ -x "$BACKEND_DIR/.venv/bin/python" ]]; then
  PYTHON_BIN="$BACKEND_DIR/.venv/bin/python"
else
  PYTHON_BIN="$(command -v python3 || command -v python || true)"
fi

if [[ -z "$PYTHON_BIN" ]]; then
  printf "\nMissing Python. Start the backend manually after installing Python:\n"
  printf "  cd backend\n  python3 -m venv .venv\n  source .venv/bin/activate\n  pip install -r requirements.txt\n  uvicorn main:app --reload\n"
  exit 1
fi

if [[ ! -x "$BACKEND_DIR/.venv/bin/uvicorn" ]] && ! has_command uvicorn; then
  print_header "Backend Setup Needed"
  printf "Uvicorn was not found. Run:\n"
  printf "  cd backend\n"
  printf "  python3 -m venv .venv\n"
  printf "  source .venv/bin/activate\n"
  printf "  pip install -r requirements.txt\n"
  printf "  uvicorn main:app --reload\n"
  printf "\nThen start the frontend:\n"
  printf "  cd apps/web\n"
  printf "  npm install\n"
  printf "  npm run dev\n"
  exit 1
fi

print_header "Starting Backend"
(
  cd "$BACKEND_DIR" || exit 1
  if [[ -f ".env" ]]; then
    printf "Using backend/.env if python-dotenv loads it.\n"
  fi
  if [[ -x ".venv/bin/uvicorn" ]]; then
    .venv/bin/uvicorn main:app --reload
  else
    uvicorn main:app --reload
  fi
) &
BACKEND_PID=$!

print_header "Starting Frontend"
(
  cd "$WEB_DIR" || exit 1
  npm run dev
) &
FRONTEND_PID=$!

print_header "Running"
printf "Press Ctrl+C to stop both processes.\n"
wait "$BACKEND_PID" "$FRONTEND_PID"
