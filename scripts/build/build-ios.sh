#!/usr/bin/env bash
# Build the iOS app (.ipa). MUST run on macOS with Xcode installed.
#
# Prerequisites (one-time):
#   - macOS + Xcode (full install, not just Command Line Tools)
#   - Xcode command line tools:  xcode-select --install
#   - An Apple Developer account (required to run on a real device or ship to
#     the App Store; the free tier only allows short-lived dev builds).
#   - Rust iOS targets:
#       rustup target add aarch64-apple-ios aarch64-apple-ios-sim x86_64-apple-ios
#   - Cocoapods:  brew install cocoapods
#
# Usage:
#   ./scripts/build/build-ios.sh            # build .ipa for a device (needs signing team)
#   ./scripts/build/build-ios.sh --open     # just open the project in Xcode to set signing
set -euo pipefail

cd "$(dirname "$0")/../.."
for d in "$HOME"/.local/node-*/bin; do [ -d "$d" ] && export PATH="$d:$PATH"; done
[ -d "$HOME/.cargo/bin" ] && export PATH="$HOME/.cargo/bin:$PATH"

if ! xcode-select -p >/dev/null 2>&1; then
  echo "Xcode is required. Install it from the App Store, then run: xcode-select --install"
  exit 1
fi

npm install

if [[ ! -d "src-tauri/gen/apple" ]]; then
  echo "==> Initializing iOS project"
  npx tauri ios init
fi

if [[ "${1:-}" == "--open" ]]; then
  echo "==> Opening Xcode (set your signing Team under Signing & Capabilities)"
  npx tauri ios open
  exit 0
fi

echo "==> Building iOS app"
echo "    (If this fails on signing, run with --open and set your Apple Team in Xcode.)"
npx tauri ios build

echo
echo "Done. The .ipa is under:"
echo "  src-tauri/gen/apple/build/"
