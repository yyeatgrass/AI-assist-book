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

## ⚠️ 首次打开被系统拦截

因为这个安装包目前**没有做 Apple 签名和公证**，首次打开时 macOS 会拦截，提示类似：

- 「无法打开，因为无法验证开发者」，或
- 「Apple 无法验证 “AI Assist Reader” 是否包含恶意软件…」

这是**未签名应用的正常现象，并不代表有病毒**。按下面任一方法放行即可（每台 Mac 只需做一次）。

> 注意：这一步**必须在你实际使用应用的那台 Mac 上操作**——把安装包拷到另一台 Mac 后，系统会重新拦截。

**方法一（推荐，新版 macOS 适用）：**
1. 双击应用，看到拦截提示后点 **完成 / 取消**。
2. 打开 **系统设置 → 隐私与安全性**。
3. 向下滚动，找到 **“已阻止使用 AI Assist Reader…”** 那一行，点旁边的 **仍要打开（Open Anyway）**。
4. 输入开机密码 / 指纹确认，再点一次 **打开**。之后即可正常双击启动。

> 在较旧的 macOS 上，也可以直接 **右键点击应用图标 → 打开 → 再点打开**。新版 macOS（Sequoia 及以后）已改为上面「系统设置」的方式。

**方法二（命令行，会用终端的话最快）：**
在那台 Mac 上打开「终端」，确认应用已在「应用程序」里，然后运行：
```bash
xattr -dr com.apple.quarantine "/Applications/AI Assist Reader.app"
```
运行后直接双击即可打开。

## 使用前

打开应用后，进入 **设置**，填入你的 DeepSeek API Key（从 [platform.deepseek.com](https://platform.deepseek.com) 获取），即可使用「AI参考解读」功能。

---

> 说明：当前安装包为 **通用包（Universal）**，在 Intel 和 Apple Silicon（M 系列）芯片的 Mac 上都能**原生运行**，无需 Rosetta。如需重新构建，可在仓库根目录运行 `./scripts/build/build-desktop.sh --universal`。
