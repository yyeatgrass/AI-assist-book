# 下载与安装（macOS）

这里放置已经编译好的 macOS 安装包，Mac 用户可以直接下载使用，无需自行编译。

## 安装包

| 文件 | 版本 | 适用 |
|------|------|------|
| `AI Assist Reader_0.1.0_universal.dmg` | 0.1.0 | macOS **通用包**（Intel 与 Apple Silicon 均原生运行） |

## 安装步骤

1. 双击 `AI Assist Reader_0.1.0_universal.dmg`。
2. 在弹出的窗口里，把 **AI Assist Reader** 图标拖到 **Applications（应用程序）** 文件夹。
3. 从「启动台」或「应用程序」里打开。

## ⚠️ 首次打开提示「无法打开，因为无法验证开发者」

因为这个安装包目前**没有做 Apple 签名和公证**，macOS 默认会拦截。这是正常现象，按下面任一方法绕过即可（只需做一次）：

**方法一（推荐）：**
1. 在「应用程序」里找到 **AI Assist Reader**。
2. **按住 Control 键点击**（或右键点击）它的图标 → 选择 **打开**。
3. 在弹窗里再次点击 **打开**。之后就能正常双击启动了。

**方法二（命令行）：**
```bash
xattr -dr com.apple.quarantine "/Applications/AI Assist Reader.app"
```

## 使用前

打开应用后，进入 **设置**，填入你的 DeepSeek API Key（从 [platform.deepseek.com](https://platform.deepseek.com) 获取），即可使用「AI 解读」功能。

---

> 说明：当前安装包为 **通用包（Universal）**，在 Intel 和 Apple Silicon（M 系列）芯片的 Mac 上都能**原生运行**，无需 Rosetta。如需重新构建，可在仓库根目录运行 `./scripts/build/build-desktop.sh --universal`。
