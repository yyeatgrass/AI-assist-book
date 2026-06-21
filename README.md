# AI Assist Book

A cross-platform ebook reader for **PDF** and **EPUB** with AI-powered explanations for difficult passages. Built with Tauri 2 + React.

**Targets:** macOS, Windows, Linux, iOS, and Android (one codebase).

## Features

- Add and manage PDF/EPUB books in a local library
- Distraction-free reader with light / dark / sepia themes
- Select any passage → **Explain** with DeepSeek AI
- Reading progress saved automatically
- Responsive UI: side panel on desktop, bottom sheet on mobile

## Prerequisites

1. **Node.js 20+** and npm
2. **Rust** ([rustup](https://rustup.rs))
3. **Platform tools:**
   - **macOS:** Xcode Command Line Tools
   - **Windows:** Visual Studio Build Tools + WebView2
   - **Linux:** `webkit2gtk-4.1` and related dev packages
   - **iOS:** Full Xcode
   - **Android:** Android Studio + SDK

4. **DeepSeek API key** from [platform.deepseek.com](https://platform.deepseek.com)

## Quick start (desktop)

```bash
cd "AI assist book"
npm install
npm run tauri dev
```

Add your API key in **Settings** before using Explain.

## Building installers for every platform

There are two ways to produce the installers: **automatically in the cloud (recommended)** or **locally per platform**.

### Option A — One shot, all platforms via GitHub Actions (recommended)

The repo includes `.github/workflows/release.yml`. Push the project to GitHub, then create a version tag:

```bash
git tag v0.1.0
git push origin v0.1.0
```

GitHub builds everything on the right operating systems and attaches the installers to a **draft Release**:

| Platform | Artifact | Notes |
|----------|----------|-------|
| macOS    | `.dmg` (universal: Intel + Apple Silicon) | works out of the box |
| Windows  | `.exe` (NSIS) + `.msi` | works out of the box |
| Linux    | `.deb` + `.AppImage` | works out of the box |
| Android  | `.apk` | unsigned unless keystore secrets are set |
| iOS      | `.ipa` | **only built when Apple signing secrets are set** (see below) |

You can also trigger it manually from the **Actions** tab (workflow_dispatch).

#### Optional signing secrets

- **Android** (to ship on Google Play): `ANDROID_KEY_BASE64`, plus keystore alias/passwords.
- **iOS** (required to build at all — Apple needs a paid Developer account): `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_PROVISIONING_PROFILE`, `APPLE_DEVELOPMENT_TEAM`, `IOS_EXPORT_METHOD`. Without these, the iOS job is skipped and the run still passes.

### Option B — Build locally

Helper scripts live in `scripts/build/`. Each one installs deps and emits installers under `src-tauri/target/release/bundle/` (desktop) or `src-tauri/gen/` (mobile).

```bash
# Desktop (builds for the OS you run it on)
./scripts/build/build-desktop.sh              # macOS .app + .dmg / Linux .deb + .AppImage
./scripts/build/build-desktop.sh --universal  # macOS only: Intel + Apple Silicon

# Windows (run in PowerShell on a Windows machine)
powershell -ExecutionPolicy Bypass -File scripts\build\build-windows.ps1

# Android (needs Android SDK + NDK + Java 17; see header of the script)
export ANDROID_HOME="$HOME/Library/Android/sdk"
export NDK_HOME="$ANDROID_HOME/ndk/<version>"
./scripts/build/build-android.sh

# iOS (needs macOS + full Xcode + Apple Developer account)
./scripts/build/build-ios.sh --open   # first time: set your signing Team in Xcode
./scripts/build/build-ios.sh          # then build the .ipa
```

> **Cross-compiling note:** you cannot build a Windows installer from macOS (or vice versa). Use the matching OS, or just use Option A which spins up each OS for you.

## Distribution / store requirements (at a glance)

| Platform | Account / cost to distribute | Code signing |
|----------|------------------------------|--------------|
| macOS    | Self-distribute free; App Store needs Apple Developer ($99/yr) | Notarization recommended to avoid Gatekeeper warnings |
| Windows  | Self-distribute free | Optional code-signing cert (~$200+/yr) to avoid SmartScreen warnings |
| Linux    | Free | None required |
| Android  | Google Play one-time $25 | Release keystore required |
| iOS      | Apple Developer **required** ($99/yr) | Required (cert + provisioning profile) |

## Project structure

```
src/                 React frontend
src-tauri/           Rust backend (library, AI proxy)
src/components/      UI: library, reader, AI, settings
```

## AI usage

- API calls go through the Rust backend (`ai_explain` command)
- Your API key is stored locally via Tauri Store
- Models: `deepseek-chat` (default) or `deepseek-reasoner`

## License

MIT
