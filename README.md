# AI Assist Reader / AI 阅读助手

**English** | [中文](#中文说明)

A friendly ebook reader for **PDF** and **EPUB** that can explain hard-to-understand passages for you using AI. Just select some text and tap **AI Reference Explanation** — the app summarizes it in plain language.

Works on macOS, Windows, Linux, iPhone/iPad, and Android.

---

## Get the app

> **Current availability:** **macOS, Windows, Linux, and Android** all have ready-to-download installers on the [**Releases page**](https://github.com/yyeatgrass/AI-assist-book/releases). **iPhone/iPad** is not yet available as a direct download (it requires an Apple-signed build — see [For developers](#for-developers)).

### macOS (ready to download now)

1. Download the installer: [`releases/AI Assist Reader_0.1.0_universal.dmg`](releases/) (works on both Intel and Apple Silicon Macs).
2. Double-click the downloaded `.dmg`.
3. Drag the **AI Assist Reader** icon into your **Applications** folder.
4. Open it from Launchpad or Applications.

> **First time you open it, macOS will block it** with a message like *"cannot be opened because the developer cannot be verified"* or *"Apple could not verify 'AI Assist Reader' is free of malware."*
> This is normal for an app that isn't signed by Apple yet — it does **not** mean the app has a virus. You must do this on **each** Mac where you run it (copying the file to another Mac re-triggers the block). To allow it (only needed once per Mac):
>
> **On recent macOS (Sequoia and later):**
> 1. Double-click the app, then dismiss the warning.
> 2. Open **System Settings → Privacy & Security**.
> 3. Scroll down to **"AI Assist Reader was blocked…"** and click **Open Anyway**.
> 4. Confirm with your password / Touch ID, then click **Open**.
>
> *(On older macOS you can instead right-click the app icon → **Open** → **Open** again.)*
>
> **Or, via Terminal (fastest if you're comfortable with it):** after moving the app to Applications, run:
> ```bash
> xattr -dr com.apple.quarantine "/Applications/AI Assist Reader.app"
> ```

### Windows / Linux / Android (download from Releases)

Grab the file for your device from the [**Releases page**](https://github.com/yyeatgrass/AI-assist-book/releases):

- **Windows:** `AI Assist Reader_…_x64-setup.exe` — double-click to install (or use the `.msi`).
- **Linux:** `…_amd64.AppImage` (make it executable: `chmod +x …AppImage`, then run) or `…_amd64.deb`.
- **Android:** `app-universal-release.apk` — copy to your phone and open it to install (you may need to allow "install from unknown sources").

### iPhone / iPad (not a direct download yet)

iOS requires an Apple-signed build delivered through Apple (App Store / TestFlight). This needs a paid Apple Developer account — see [For developers](#for-developers).

---

## How to use it

1. **Add a book.** Click **Add book** and pick a PDF or EPUB file from your computer. It's saved to your local library.
2. **Read.** Open any book. Switch between light, dark, and sepia (eye-friendly) themes. Your reading progress is saved automatically.
3. **Ask AI about a passage.** While reading, **select the text** you don't understand. A small **AI Reference Explanation** panel opens and explains it in simple Chinese (or the language you ask in), formatted for easy reading.

### One-time setup for the AI feature

The AI explanation uses **DeepSeek**. You need a free API key:

1. Sign up at [platform.deepseek.com](https://platform.deepseek.com) and create an API key.
2. In the app, open **Settings** and paste your key.
3. That's it — your key is stored privately on your own device.

> **Tip:** DeepSeek charges a small amount per request. If you ever see an "Insufficient Balance" message, it just means your DeepSeek account needs a top-up — it's not an app error.

---

## Privacy

- Your books stay **on your device** — nothing is uploaded.
- Your API key is stored **locally** on your computer.
- When you ask AI to explain a passage, only the **text you selected** is sent to DeepSeek to generate the explanation.

---

## Frequently asked questions

**The AI panel says something about a key or balance.**
Open **Settings** and make sure your DeepSeek API key is entered. If it mentions balance, top up your DeepSeek account.

**Selecting text highlights a bit of empty space.**
The reader uses precise text selection, so the highlight should hug the words. If something looks off, try reopening the page.

**Can I use it on my phone?**
Yes — the app is built for phones too. Android can install the `.apk` directly; iPhone requires a build delivered through Apple.

---

## For developers

<details>
<summary>Build from source & release for every platform</summary>

Built with **Tauri 2 + React** (one codebase for all platforms).

### Run locally

```bash
npm install
npm run tauri dev
```

Prerequisites: Node.js 20+, Rust ([rustup](https://rustup.rs)), and per-platform tooling (Xcode CLT on macOS, VS Build Tools + WebView2 on Windows, `webkit2gtk-4.1` on Linux, full Xcode for iOS, Android Studio + SDK for Android).

### Build installers — Option A: GitHub Actions (recommended)

The repo includes `.github/workflows/release.yml`. Push a version tag and it builds installers for every OS and attaches them to a draft Release:

```bash
git tag v0.1.0
git push origin v0.1.0
```

| Platform | Artifact |
|----------|----------|
| macOS    | `.dmg` (universal: Intel + Apple Silicon) |
| Windows  | `.exe` (NSIS) + `.msi` |
| Linux    | `.deb` + `.AppImage` |
| Android  | `.apk` (unsigned unless keystore secrets are set) |
| iOS      | `.ipa` (only built when Apple signing secrets are set) |

Optional signing secrets: `ANDROID_KEY_BASE64` for Android; `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_PROVISIONING_PROFILE`, `APPLE_DEVELOPMENT_TEAM`, `IOS_EXPORT_METHOD` for iOS.

### Build installers — Option B: locally

```bash
./scripts/build/build-desktop.sh              # macOS .app + .dmg / Linux .deb + .AppImage
./scripts/build/build-desktop.sh --universal  # macOS universal (Intel + Apple Silicon)
powershell -ExecutionPolicy Bypass -File scripts\build\build-windows.ps1   # Windows
./scripts/build/build-android.sh              # Android (needs Android SDK + NDK + Java 17)
./scripts/build/build-ios.sh                  # iOS (needs macOS + Xcode + Apple account)
```

> You can't build a Windows installer from macOS (or vice versa). Use the matching OS, or use Option A.

### Store / distribution costs

| Platform | Cost to distribute | Signing |
|----------|--------------------|---------|
| macOS    | Self-distribute free; App Store needs Apple Developer ($99/yr) | Notarization recommended |
| Windows  | Free | Optional code-signing cert (~$200+/yr) |
| Linux    | Free | None |
| Android  | Google Play one-time $25 | Release keystore required |
| iOS      | Apple Developer required ($99/yr) | Required |

### Project structure

```
src/                 React frontend
src-tauri/           Rust backend (library, AI proxy)
src/components/      UI: library, reader, AI, settings
```

</details>

## License

MIT

---

# 中文说明

[English](#ai-assist-reader--ai-阅读助手) | **中文**

一款好用的 **PDF / EPUB** 电子书阅读器，遇到读不懂的段落，可以用 AI 帮你解释。只要**选中文字**，点一下 **AI参考解读**，应用就会用通俗的语言帮你梳理。

支持 macOS、Windows、Linux、iPhone/iPad 和 Android。

---

## 获取应用

### macOS（现在就能下载）

1. 下载安装包：[`releases/AI Assist Reader_0.1.0_universal.dmg`](releases/)（Intel 和 Apple Silicon 芯片的 Mac 都能用）。
2. 双击下载好的 `.dmg`。
3. 把 **AI Assist Reader** 图标拖进 **应用程序（Applications）** 文件夹。
4. 从「启动台」或「应用程序」里打开。

> **首次打开时，macOS 会拦截**，提示类似「无法打开，因为无法验证开发者」，或「Apple 无法验证 “AI Assist Reader” 是否包含恶意软件」。
> 这是应用还没做 Apple 签名的正常现象，**不代表有病毒**。每台运行它的 Mac 都要放行一次（把文件拷到另一台 Mac 会重新被拦）。放行方法（每台只需一次）：
>
> **新版 macOS（Sequoia 及以后）：**
> 1. 双击应用，关掉提示。
> 2. 打开 **系统设置 → 隐私与安全性**。
> 3. 向下滚动，找到 **「已阻止使用 AI Assist Reader…」**，点 **仍要打开（Open Anyway）**。
> 4. 用密码 / 指纹确认，再点 **打开**。
>
> *（较旧的 macOS 可以直接右键应用图标 →「打开」→ 再点「打开」。）*
>
> **或用终端（会用命令行的话最快）：** 把应用放进「应用程序」后运行：
> ```bash
> xattr -dr com.apple.quarantine "/Applications/AI Assist Reader.app"
> ```

### Windows / Linux / Android（到 Releases 页下载）

到 [**Releases 页**](https://github.com/yyeatgrass/AI-assist-book/releases) 下载对应设备的文件：

- **Windows：** `AI Assist Reader_…_x64-setup.exe`，双击安装(或用 `.msi`)。
- **Linux：** `…_amd64.AppImage`(先 `chmod +x …AppImage` 赋予可执行权限再运行)或 `…_amd64.deb`。
- **Android：** `app-universal-release.apk`，拷到手机打开安装(可能需要允许「安装未知来源应用」)。

### iPhone / iPad（暂无直接下载）

iOS 需要经过 Apple 签名、通过 App Store / TestFlight 安装，需付费的 Apple 开发者账号——见 [面向开发者](#面向开发者)。

---

## 怎么使用

1. **添加图书。** 点击 **添加图书**，从电脑里选一个 PDF 或 EPUB 文件，它会被保存到你的本地书库。
2. **阅读。** 打开任意图书。可在 浅色 / 深色 / 护眼（sepia）主题之间切换。阅读进度会自动保存。
3. **让 AI 解释段落。** 阅读时**选中**看不懂的文字，会弹出一个 **AI参考解读** 面板，用简明的中文（或你提问所用的语言）帮你解释，排版清晰易读。

### AI 功能的一次性设置

AI 解释功能使用 **DeepSeek**，需要一个 API Key：

1. 到 [platform.deepseek.com](https://platform.deepseek.com) 注册并创建 API Key。
2. 在应用里打开 **设置**，把 Key 粘贴进去。
3. 完成——你的 Key 只保存在你自己的设备上。

> **提示：** DeepSeek 按调用量收取少量费用。如果看到「余额不足（Insufficient Balance）」的提示，说明你的 DeepSeek 账户需要充值，并不是应用出错。

---

## 隐私

- 你的图书**只保存在本机**，不会上传。
- 你的 API Key **保存在本地**电脑上。
- 让 AI 解释段落时，只会把**你选中的那段文字**发给 DeepSeek 用于生成解释。

---

## 常见问题

**AI 面板提示和 Key 或余额有关的内容。**
打开 **设置**，确认已填入 DeepSeek API Key；若提示余额相关，请给 DeepSeek 账户充值。

**选中文字时会连一点空白也高亮。**
阅读器使用精确选区，高亮会紧贴文字。若显示异常，重新打开该页试试。

**手机上能用吗？**
可以——应用同样为手机打造。Android 可直接安装 `.apk`；iPhone 需通过 Apple 渠道安装。

---

## 面向开发者

<details>
<summary>从源码构建，并为各平台打包发布</summary>

基于 **Tauri 2 + React** 构建（一套代码支持所有平台）。

### 本地运行

```bash
npm install
npm run tauri dev
```

环境要求：Node.js 20+、Rust（[rustup](https://rustup.rs)），以及各平台工具链（macOS 的 Xcode 命令行工具、Windows 的 VS 生成工具 + WebView2、Linux 的 `webkit2gtk-4.1`、iOS 的完整版 Xcode、Android 的 Android Studio + SDK）。

### 构建安装包 —— 方式 A：GitHub Actions（推荐）

仓库已包含 `.github/workflows/release.yml`。推送一个版本标签即可在各操作系统上构建安装包，并附加到草稿 Release：

```bash
git tag v0.1.0
git push origin v0.1.0
```

| 平台 | 产物 |
|------|------|
| macOS   | `.dmg`（通用包：Intel + Apple Silicon） |
| Windows | `.exe`（NSIS） + `.msi` |
| Linux   | `.deb` + `.AppImage` |
| Android | `.apk`（未配置 keystore 时为未签名包） |
| iOS     | `.ipa`（仅在配置 Apple 签名密钥时构建） |

可选签名密钥：Android 用 `ANDROID_KEY_BASE64`；iOS 用 `APPLE_CERTIFICATE`、`APPLE_CERTIFICATE_PASSWORD`、`APPLE_PROVISIONING_PROFILE`、`APPLE_DEVELOPMENT_TEAM`、`IOS_EXPORT_METHOD`。

### 构建安装包 —— 方式 B：本地构建

```bash
./scripts/build/build-desktop.sh              # macOS .app + .dmg / Linux .deb + .AppImage
./scripts/build/build-desktop.sh --universal  # macOS 通用包（Intel + Apple Silicon）
powershell -ExecutionPolicy Bypass -File scripts\build\build-windows.ps1   # Windows
./scripts/build/build-android.sh              # Android（需 Android SDK + NDK + Java 17）
./scripts/build/build-ios.sh                  # iOS（需 macOS + Xcode + Apple 账号）
```

> 无法在 macOS 上构建 Windows 安装包（反之亦然）。请使用对应系统，或使用方式 A。

### 分发 / 上架成本

| 平台 | 分发成本 | 签名 |
|------|---------|------|
| macOS   | 自行分发免费；上架 App Store 需 Apple 开发者账号（$99/年） | 建议做公证 |
| Windows | 免费 | 可选代码签名证书（约 $200+/年） |
| Linux   | 免费 | 无需 |
| Android | Google Play 一次性 $25 | 需要 release keystore |
| iOS     | 必须 Apple 开发者账号（$99/年） | 必须 |

### 项目结构

```
src/                 React 前端
src-tauri/           Rust 后端（书库、AI 代理）
src/components/      界面组件：书库、阅读器、AI、设置
```

</details>

## 许可证

MIT
