# 发布指南 / Release Guide

本项目基于 **Tauri 2**,一套代码可以发布到 **macOS、Windows、Linux、Android、iOS**。
本文档说明如何为每个平台生成可安装的发行包。

> 核心事实:**不同平台的安装包必须在对应的系统上构建。**
> macOS 上可以构建 macOS / iOS / Android;Windows 安装包必须在 Windows 上构建。
> 最省事的方式是用本仓库自带的 **GitHub Actions 流水线一次性出齐所有平台**。

---

## 方式一(推荐):GitHub Actions 一键多端发布

仓库内已配置 `.github/workflows/release.yml`,会在云端同时构建 **macOS / Windows / Linux / Android**。

**操作步骤:**

1. 把代码推到 GitHub 仓库。
2. 打一个版本标签并推送:

   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```

   (也可以在 GitHub 的 Actions 页面手动触发 `Release` 工作流。)
3. 等待构建完成,产物会自动挂到一个 **草稿 Release** 下,确认后点 “Publish” 即可。

**产物清单:**

| 平台 | 文件 |
|------|------|
| macOS | `AI Assist Reader_x.y.z_universal.dmg`(Intel + Apple Silicon 通用) |
| Windows | `..._x64-setup.exe`(NSIS)和 `..._x64_en-US.msi` |
| Linux | `..._amd64.deb` 和 `..._amd64.AppImage` |
| Android | `app-universal-release.apk` |

> iOS 因为强制需要 Apple 开发者账号与签名,不放在 CI 里自动发布,见下方“iOS”一节本地构建。

---

## 方式二:在本机构建单个平台

所有脚本都在 `scripts/build/` 下,也可以用 npm 命令调用。

### macOS(在 Mac 上)

```bash
npm run build:desktop              # 当前架构
npm run build:desktop:universal    # Intel + Apple Silicon 通用包
```

产物:`src-tauri/target/release/bundle/dmg/*.dmg` 和 `.../macos/*.app`

- **自己分发**:直接发 `.dmg` 即可。首次打开如提示“无法验证开发者”,右键 → 打开。
- **上架 / 免警告**:需 Apple 开发者账号($99/年),并对 `.app` 做签名 + 公证(notarize)。

### Windows(必须在 Windows 上)

先装好:Node.js 20+、Rust(rustup)、Visual Studio “使用 C++ 的桌面开发”工作负载。

```powershell
powershell -ExecutionPolicy Bypass -File scripts\build\build-windows.ps1
```

产物:`src-tauri\target\release\bundle\nsis\*-setup.exe` 和 `...\msi\*.msi`

- 不签名也能装,但会弹“未知发布者”警告。要消除需购买代码签名证书(约 $200+/年)。

### Linux(在 Linux 上)

需先安装系统依赖(Ubuntu 22.04 示例):

```bash
sudo apt-get install -y libwebkit2gtk-4.1-dev libappindicator3-dev \
  librsvg2-dev patchelf build-essential file libxdo-dev libssl-dev
npm run build:desktop
```

产物:`.../bundle/deb/*.deb` 和 `.../appimage/*.AppImage`

### Android

一次性准备环境:

- 安装 Android Studio(含 SDK)和 NDK(26.x)
- 安装 Java 17
- 配置环境变量:

  ```bash
  export ANDROID_HOME="$HOME/Library/Android/sdk"     # macOS 默认路径
  export NDK_HOME="$ANDROID_HOME/ndk/26.1.10909125"   # 改成你实际的版本
  ```

- 添加 Rust 安卓目标:

  ```bash
  rustup target add aarch64-linux-android armv7-linux-androideabi \
    i686-linux-android x86_64-linux-android
  ```

构建:

```bash
npm run build:android          # release APK
npm run build:android -- --debug   # debug APK(无需签名即可安装测试)
```

产物:`src-tauri/gen/android/app/build/outputs/apk/`

- **上架 Google Play**:需创建发布签名 keystore,并改用 `.aab`(`tauri android build --aab`)。Play 开发者账号一次性 $25。

### iOS(必须在 Mac 上,需 Xcode)

一次性准备:

- 安装完整版 Xcode(不是仅命令行工具)
- `brew install cocoapods`
- 添加 Rust iOS 目标:

  ```bash
  rustup target add aarch64-apple-ios aarch64-apple-ios-sim x86_64-apple-ios
  ```

构建:

```bash
npm run build:ios -- --open   # 先在 Xcode 里设置签名 Team
npm run build:ios             # 生成 .ipa
```

产物:`src-tauri/gen/apple/build/`

- iOS **强制**需要 Apple 开发者账号($99/年)才能在真机运行或上架 App Store。

---

## 签名 / 上架成本一览

| 平台 | 自己分发 | 官方商店上架 |
|------|---------|------------|
| macOS | 免费(`.dmg` 直发,用户右键打开) | Apple 开发者 $99/年 + 公证 |
| Windows | 免费(有“未知发布者”警告) | 代码签名证书约 $200+/年 |
| Linux | 免费(`.deb` / `.AppImage` 直发) | 各发行版仓库,通常免费 |
| Android | 免费(直发签名 APK) | Google Play 一次性 $25 |
| iOS | 不支持免费长期分发 | **强制** Apple 开发者 $99/年 |

---

## CI 的签名密钥(可选)

GitHub Actions 默认产出**未签名**的安装包。若要在 CI 里自动签名,可在仓库
Settings → Secrets 中配置(脚本已预留对应逻辑):

- `ANDROID_KEY_BASE64`:base64 编码后的 release keystore
- (macOS/Windows 签名证书同理,按需扩展 workflow)
