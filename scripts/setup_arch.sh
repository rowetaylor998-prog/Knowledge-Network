#!/usr/bin/env bash

# Arch Linux development environment checker for this knowledge platform.
# Safe by default:
# - Checks tools before installing anything.
# - Asks before running pacman.
# - Does not edit shell config.
# - Does not create .env files.
# - Does not touch SSH private keys.

set -u

missing_packages=()

print_header() {
  printf "\n== %s ==\n" "$1"
}

has_command() {
  command -v "$1" >/dev/null 2>&1
}

has_package() {
  pacman -Qi "$1" >/dev/null 2>&1
}

mark_missing() {
  local package_name="$1"
  missing_packages+=("$package_name")
}

check_command_package() {
  local label="$1"
  local command_name="$2"
  local package_name="$3"

  if has_command "$command_name"; then
    printf "OK   %-28s found command: %s\n" "$label" "$command_name"
  else
    printf "MISS %-28s install package: %s\n" "$label" "$package_name"
    mark_missing "$package_name"
  fi
}

check_package_only() {
  local label="$1"
  local package_name="$2"

  if has_package "$package_name"; then
    printf "OK   %-28s installed package: %s\n" "$label" "$package_name"
  else
    printf "MISS %-28s install package: %s\n" "$label" "$package_name"
    mark_missing "$package_name"
  fi
}

add_unique_missing_packages() {
  local unique_packages=()
  local package_name
  local seen

  for package_name in "${missing_packages[@]}"; do
    seen=0
    for existing in "${unique_packages[@]}"; do
      if [[ "$existing" == "$package_name" ]]; then
        seen=1
        break
      fi
    done
    if [[ "$seen" -eq 0 ]]; then
      unique_packages+=("$package_name")
    fi
  done

  missing_packages=("${unique_packages[@]}")
}

print_header "Arch Linux Environment Check"

if ! has_command pacman; then
  printf "pacman was not found. This script is intended for Arch Linux or Arch-based systems.\n"
  printf "Exiting safely without making changes.\n"
  exit 0
fi

printf "OK   pacman found. Continuing checks.\n"

print_header "Core Tools"
check_command_package "git" "git" "git"
check_package_only "base-devel" "base-devel"
check_command_package "curl" "curl" "curl"
check_command_package "wget" "wget" "wget"
check_command_package "unzip" "unzip" "unzip"
check_command_package "tree" "tree" "tree"
check_command_package "jq" "jq" "jq"
check_command_package "ssh / openssh" "ssh" "openssh"

print_header "JavaScript Tooling"
check_command_package "node" "node" "nodejs"
check_command_package "npm" "npm" "npm"
check_command_package "pnpm" "pnpm" "pnpm"

print_header "Python Tooling"
check_command_package "python" "python" "python"
check_command_package "pip" "pip" "python-pip"
check_command_package "virtualenv" "virtualenv" "python-virtualenv"

print_header "Containers and GitHub"
check_command_package "docker" "docker" "docker"
if has_command docker-compose; then
  printf "OK   %-28s found command: docker-compose\n" "docker compose"
elif has_command docker && docker compose version >/dev/null 2>&1; then
  printf "OK   %-28s found command: docker compose\n" "docker compose"
else
  printf "MISS %-28s install package: docker-compose\n" "docker compose"
  mark_missing "docker-compose"
fi
check_command_package "gh / github-cli" "gh" "github-cli"

print_header "Build and GPU Tools"
check_command_package "cmake" "cmake" "cmake"
if has_command nvidia-smi; then
  printf "OK   %-28s found command: nvidia-smi\n" "nvidia-smi / nvidia-utils"
else
  printf "MISS %-28s install package: nvidia-utils\n" "nvidia-smi / nvidia-utils"
  mark_missing "nvidia-utils"
fi

add_unique_missing_packages

print_header "Summary"
if [[ "${#missing_packages[@]}" -eq 0 ]]; then
  printf "All checked packages/tools appear to be installed.\n"
else
  printf "Missing pacman packages:\n"
  printf "  %s\n" "${missing_packages[@]}"
  printf "\nInstall missing packages with pacman? [y/N] "
  read -r answer
  case "$answer" in
    y|Y|yes|YES)
      sudo pacman -S --needed "${missing_packages[@]}"
      ;;
    *)
      printf "Skipped installation. No packages were installed.\n"
      ;;
  esac
fi

print_header "Optional Notes"
cat <<'NOTES'
- Run `nvidia-smi` to check NVIDIA GPU status.
- Run `sudo systemctl enable --now docker` if Docker is installed but not running.
- Add your user to the docker group with:
  sudo usermod -aG docker $USER
  then log out and log back in.
- Ollama can be installed later; this script does not install it.
- Clone the repository with:
  git clone <repo-url>
- Do not store .env files, API keys, or .pem private keys in the repository.
- This script does not modify shell config automatically.
- This script does not create or edit .env files.
- This script does not touch SSH private keys.
NOTES
