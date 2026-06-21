#!/bin/zsh
# AI Assist Reader — environment setup helper
# Run: source scripts/setup-env.sh

export NODE_HOME="$HOME/.local/node-v22.16.0-darwin-x64"
export PATH="$NODE_HOME/bin:$HOME/.cargo/bin:$PATH"

if [ -x "$NODE_HOME/bin/node" ]; then
  echo "Node: $(node --version)"
else
  echo "Node: not installed — run scripts/install-prerequisites.sh"
fi

if command -v rustc >/dev/null 2>&1; then
  echo "Rust: $(rustc --version)"
else
  echo "Rust: not ready — run scripts/install-prerequisites.sh"
fi
