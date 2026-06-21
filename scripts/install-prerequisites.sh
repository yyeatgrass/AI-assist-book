#!/bin/zsh
set -e

NODE_VERSION="22.16.0"
NODE_DIR="$HOME/.local/node-v${NODE_VERSION}-darwin-x64"
ARCH="$(uname -m)"

if [ "$ARCH" = "arm64" ]; then
  NODE_PKG="node-v${NODE_VERSION}-darwin-arm64"
else
  NODE_PKG="node-v${NODE_VERSION}-darwin-x64"
fi

echo "=== Installing Node.js ${NODE_VERSION} ==="
if [ ! -x "$HOME/.local/${NODE_PKG}/bin/node" ]; then
  mkdir -p "$HOME/.local"
  curl -L --retry 5 "https://nodejs.org/dist/v${NODE_VERSION}/${NODE_PKG}.tar.gz" -o /tmp/node.tar.gz
  tar -xzf /tmp/node.tar.gz -C "$HOME/.local"
  rm /tmp/node.tar.gz
fi
export PATH="$HOME/.local/${NODE_PKG}/bin:$PATH"
node --version
npm --version

echo "=== Installing Rust (rustup) ==="
if ! command -v rustup >/dev/null 2>&1; then
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
fi
export PATH="$HOME/.cargo/bin:$PATH"

if ! rustc --version >/dev/null 2>&1; then
  echo "Installing stable Rust toolchain (may take several minutes on slow networks)..."
  rustup toolchain install stable
  rustup default stable
fi
rustc --version
cargo --version

echo "=== Installing project dependencies ==="
cd "$(dirname "$0")/.."
npm install

echo ""
echo "Done! Run the app with:"
echo "  source scripts/setup-env.sh"
echo "  npm run tauri dev"
