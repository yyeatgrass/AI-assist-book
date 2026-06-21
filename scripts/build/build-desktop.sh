#!/usr/bin/env bash
# Build the desktop installer for the CURRENT operating system.
#   - On macOS  -> .app + .dmg
#   - On Linux  -> .deb + .AppImage (+ .rpm)
#   - On Windows: use scripts/build/build-windows.ps1 instead (PowerShell)
#
# Usage:
#   ./scripts/build/build-desktop.sh                 # build for the host arch
#   ./scripts/build/build-desktop.sh --universal     # macOS only: Intel + Apple Silicon
set -euo pipefail

cd "$(dirname "$0")/../.."

# Make sure node + rust are on PATH. Prefer a locally unpacked Node if present,
# otherwise rely on a system-installed Node.
for d in "$HOME"/.local/node-*/bin; do [ -d "$d" ] && export PATH="$d:$PATH"; done
[ -d "$HOME/.cargo/bin" ] && export PATH="$HOME/.cargo/bin:$PATH"

EXTRA_ARGS=()
if [[ "${1:-}" == "--universal" ]]; then
  rustup target add aarch64-apple-darwin x86_64-apple-darwin >/dev/null 2>&1 || true
  EXTRA_ARGS+=(--target universal-apple-darwin)
fi

echo "==> Installing frontend dependencies"
npm install

echo "==> Building desktop bundle"
npm run tauri build -- "${EXTRA_ARGS[@]}"

echo
echo "Done. Installers are in:"
echo "  src-tauri/target/release/bundle/"
