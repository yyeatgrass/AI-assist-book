#!/usr/bin/env bash
# Build an installable Android APK.
#
# Prerequisites (one-time):
#   - Android Studio (or command-line tools) with an SDK installed
#   - Android NDK (e.g. 26.x)
#   - Java 17
#   - Set the following environment variables:
#       export ANDROID_HOME="$HOME/Library/Android/sdk"      # macOS default
#       export NDK_HOME="$ANDROID_HOME/ndk/<version>"
#   - Rust Android targets:
#       rustup target add aarch64-linux-android armv7-linux-androideabi \
#                         i686-linux-android x86_64-linux-android
#
# Usage:
#   ./scripts/build/build-android.sh           # release APK (unsigned unless keystore configured)
#   ./scripts/build/build-android.sh --debug   # debug APK (installs without signing config)
set -euo pipefail

cd "$(dirname "$0")/../.."
for d in "$HOME"/.local/node-*/bin; do [ -d "$d" ] && export PATH="$d:$PATH"; done
[ -d "$HOME/.cargo/bin" ] && export PATH="$HOME/.cargo/bin:$PATH"

: "${ANDROID_HOME:?Please set ANDROID_HOME to your Android SDK path}"
: "${NDK_HOME:?Please set NDK_HOME to your Android NDK path}"

npm install

# Initialize the native Android project on first run (idempotent).
if [[ ! -d "src-tauri/gen/android" ]]; then
  echo "==> Initializing Android project"
  npx tauri android init
fi

if [[ "${1:-}" == "--debug" ]]; then
  echo "==> Building DEBUG APK"
  npx tauri android build --apk --debug
else
  echo "==> Building RELEASE APK"
  npx tauri android build --apk
fi

echo
echo "Done. APK(s) at:"
echo "  src-tauri/gen/android/app/build/outputs/apk/"
