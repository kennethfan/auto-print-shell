# 自动打印系统 (Auto Print Shell)

一个基于Electron的自动打印系统应用。

## 功能特点

- 基于Electron构建的跨平台桌面应用
- 支持Windows、macOS和Linux系统
- 自动化打印功能

## 开发环境设置

### 前提条件

- Node.js (推荐v18或更高版本)
- npm或pnpm包管理器

### 安装依赖

```bash
pnpm install
```

### 开发模式运行

```bash
pnpm run dev
```

### 构建应用

```bash
# 构建所有平台
pnpm run build

# 仅构建macOS版本
pnpm run build:mac

# 仅构建Windows版本
pnpm run build:win

# 仅构建Linux版本
pnpm run build:linux
```

## 自动构建与发布

本项目使用GitHub Actions进行自动构建和发布。每当推送到主分支或创建新的标签时，GitHub Actions会自动构建不同平台的安装包。

### 自动构建流程

1. **推送代码触发构建**：
   - 推送到`main`或`master`分支会触发构建
   - 创建以`v`开头的标签（如`v1.0.0`）会触发构建和发布

2. **构建平台**：
   - Windows (生成.exe安装文件)
   - macOS (生成.dmg安装文件)
   - Linux (生成.AppImage安装文件)

3. **发布流程**：
   - 当创建新标签时，构建的安装包会自动上传到GitHub Releases

### 如何发布新版本

1. 更新`package.json`中的版本号
2. 提交更改并推送到GitHub
3. 创建新的标签并推送：

```bash
git tag v1.0.0  # 使用适当的版本号
git push origin v1.0.0
```

4. GitHub Actions将自动构建并发布新版本

## 许可证

ISC
