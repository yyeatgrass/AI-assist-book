# AI Assist Reader / AI 阅读助手

**English** | [中文](#中文说明)

A cross-platform ebook reader for **PDF** and **EPUB** with AI-powered explanations for difficult passages. Built with Tauri 2 + React.

**Targets:** macOS, Windows, Linux, iOS, and Android (one codebase).

## Download (end users, no build required)

macOS users can download the prebuilt installer directly: the `.dmg` in the [`releases/`](releases/) folder. See [releases/README.md](releases/README.md) for install steps. For other platforms, see "Building installers for every platform" below.

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

---

# 中文说明

[English](#ai-assist-reader--ai-阅读助手) | **中文**

一款跨平台的 **PDF / EPUB** 电子书阅读器，内置 AI 功能，可为难懂的段落提供解读。基于 Tauri 2 + React 构建。

**支持平台：** macOS、Windows、Linux、iOS、Android（同一套代码）。

## 直接下载（普通用户，无需编译）

macOS 用户可直接下载已编译好的安装包：[`releases/`](releases/) 目录下的 `.dmg` 文件，安装说明见 [releases/README.md](releases/README.md)。其它平台的安装包请见下文「为各平台构建安装包」。

## 功能特性

- 在本地书库中添加和管理 PDF / EPUB 图书
- 沉浸式阅读界面，支持 浅色 / 深色 / 护眼（sepia）三种主题
- 选中任意段落 →  用 DeepSeek AI 进行 **解读**
- 自动保存阅读进度
- 自适应界面：桌面端为侧边面板，移动端为底部弹出面板

## 环境要求

1. **Node.js 20+** 和 npm
2. **Rust**（[rustup](https://rustup.rs)）
3. **各平台工具链：**
   - **macOS：** Xcode 命令行工具
   - **Windows：** Visual Studio 生成工具 + WebView2
   - **Linux：** `webkit2gtk-4.1` 及相关开发包
   - **iOS：** 完整版 Xcode
   - **Android：** Android Studio + SDK
4. **DeepSeek API Key**，从 [platform.deepseek.com](https://platform.deepseek.com) 获取

## 快速开始（桌面端）

```bash
cd "AI assist book"
npm install
npm run tauri dev
```

使用「解读」功能前，请先在 **设置** 中填入你的 API Key。

## 为各平台构建安装包

有两种方式生成安装包：**云端一键构建（推荐）** 或 **在本地逐平台构建**。

### 方式 A —— 通过 GitHub Actions 一次性构建所有平台（推荐）

仓库中已包含 `.github/workflows/release.yml`。把项目推送到 GitHub，然后创建一个版本标签：

```bash
git tag v0.1.0
git push origin v0.1.0
```

GitHub 会在各自对应的操作系统上完成构建，并把安装包附加到一个 **草稿 Release（Release 草稿）** 中：

| 平台 | 产物 | 说明 |
|------|------|------|
| macOS   | `.dmg`（通用包：Intel + Apple Silicon） | 开箱即用 |
| Windows | `.exe`（NSIS） + `.msi` | 开箱即用 |
| Linux   | `.deb` + `.AppImage` | 开箱即用 |
| Android | `.apk` | 未配置 keystore 密钥时为未签名包 |
| iOS     | `.ipa` | **仅在配置了 Apple 签名密钥时才会构建**（见下文） |

你也可以在 **Actions** 标签页中手动触发（workflow_dispatch）。

#### 可选的签名密钥

- **Android**（用于上架 Google Play）：`ANDROID_KEY_BASE64`，以及 keystore 的别名 / 密码。
- **iOS**（必须配置才能构建 —— Apple 要求付费开发者账号）：`APPLE_CERTIFICATE`、`APPLE_CERTIFICATE_PASSWORD`、`APPLE_PROVISIONING_PROFILE`、`APPLE_DEVELOPMENT_TEAM`、`IOS_EXPORT_METHOD`。若未配置，iOS 任务会被跳过，整个流程仍然成功。

### 方式 B —— 在本地构建

辅助脚本位于 `scripts/build/`。每个脚本都会安装依赖并生成安装包，产物位于 `src-tauri/target/release/bundle/`（桌面端）或 `src-tauri/gen/`（移动端）。

```bash
# 桌面端（在哪个系统运行就构建哪个系统的包）
./scripts/build/build-desktop.sh              # macOS .app + .dmg / Linux .deb + .AppImage
./scripts/build/build-desktop.sh --universal  # 仅 macOS：Intel + Apple Silicon 通用包

# Windows（在 Windows 机器上用 PowerShell 运行）
powershell -ExecutionPolicy Bypass -File scripts\build\build-windows.ps1

# Android（需要 Android SDK + NDK + Java 17；详见脚本头部说明）
export ANDROID_HOME="$HOME/Library/Android/sdk"
export NDK_HOME="$ANDROID_HOME/ndk/<版本号>"
./scripts/build/build-android.sh

# iOS（需要 macOS + 完整版 Xcode + Apple 开发者账号）
./scripts/build/build-ios.sh --open   # 首次：在 Xcode 中设置你的签名 Team
./scripts/build/build-ios.sh          # 然后构建 .ipa
```

> **关于交叉编译：** 无法在 macOS 上构建 Windows 安装包（反之亦然）。请使用对应的操作系统，或者直接用方式 A —— 它会自动为你拉起每个操作系统进行构建。

## 分发 / 上架要求一览

| 平台 | 分发所需账号 / 成本 | 代码签名 |
|------|-------------------|----------|
| macOS   | 自行分发免费；上架 App Store 需 Apple 开发者账号（$99/年） | 建议做公证（notarization）以避免 Gatekeeper 警告 |
| Windows | 自行分发免费 | 可选代码签名证书（约 $200+/年）以避免 SmartScreen 警告 |
| Linux   | 免费 | 无需 |
| Android | Google Play 一次性 $25 | 需要 release keystore |
| iOS     | **必须** Apple 开发者账号（$99/年） | 必须（证书 + 描述文件） |

## 项目结构

```
src/                 React 前端
src-tauri/           Rust 后端（书库、AI 代理）
src/components/      界面组件：书库、阅读器、AI、设置
```

## AI 使用说明

- API 调用通过 Rust 后端进行（`ai_explain` 命令）
- 你的 API Key 通过 Tauri Store 保存在本地
- 可选模型：`deepseek-chat`（默认）或 `deepseek-reasoner`

## 许可证

MIT
