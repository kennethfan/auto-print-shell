const { app, BrowserWindow, Menu, shell } = require("electron")
const path = require("path")
const fs = require("fs")

// 判断当前环境
const isDev = process.env.NODE_ENV === "development"

// 保持对window对象的全局引用
let mainWindow

// 加载配置文件
function loadConfig() {
  try {
    const configPath = path.join(
      __dirname,
      "../renderer/src/config",
      "config.json"
    )
    const configData = fs.readFileSync(configPath, "utf8")
    return JSON.parse(configData)
  } catch (error) {
    console.error("加载配置文件失败:", error)
    // 返回默认配置
    return {
      title: "自动打印系统",
      url: "http://dev.baiwangyuns.com",
    }
  }
}

// 创建浏览器窗口
function createWindow() {
  const config = loadConfig()

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: config.title || "自动打印系统",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  })

  // 加载URL
  mainWindow.loadURL(config.url)

  // 打开开发者工具
  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  // 当窗口关闭时触发
  mainWindow.on("closed", function () {
    mainWindow = null
  })
}

// 创建应用菜单
function createMenu() {
  const config = loadConfig()
  const template = [
    {
      label: "文件",
      submenu: [{ role: "quit", label: "退出" }],
    },
    {
      label: "视图",
      submenu: [
        { role: "reload", label: "重新加载" },
        { role: "forceReload", label: "强制重新加载" },
        { type: "separator" },
        { role: "resetZoom", label: "重置缩放" },
        { role: "zoomIn", label: "放大" },
        { role: "zoomOut", label: "缩小" },
        { type: "separator" },
        { role: "togglefullscreen", label: "切换全屏" },
      ],
    }
  ]

  // 在开发环境中添加开发者工具菜单
  if (isDev) {
    template.push(
      {
        label: "环境",
        submenu: Object.keys(config.environments || {}).map((envName) => ({
          label: envName,
          type: "radio",
          checked: config.currentEnvironment === envName,
          click: () => {
            // 切换环境
            const newConfig = { ...config, currentEnvironment: envName }
            fs.writeFileSync(
              path.join(
                __dirname,
                "../renderer/src/config",
                isDev ? "dev.json" : "prod.json"
              ),
              JSON.stringify(newConfig, null, 2)
            )
            mainWindow.loadURL(config.environments[envName])
            mainWindow.setTitle(`${config.title} - ${envName}`)
          },
        })),
      },
      {
        label: "开发",
        submenu: [
          { role: "toggleDevTools", label: "切换开发者工具" },
          { type: "separator" },
          {
            label: "重启应用",
            click: () => {
              app.relaunch()
              app.exit(0)
            },
          },
        ],
      }
    )
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// 当Electron完成初始化并准备创建浏览器窗口时，调用这个方法
app.whenReady().then(() => {
  createWindow()
  createMenu()

  // 添加快捷键切换开发者工具
  if (isDev) {
    const { globalShortcut } = require("electron")
    globalShortcut.register("CommandOrControl+Shift+I", () => {
      if (mainWindow && mainWindow.webContents) {
        if (mainWindow.webContents.isDevToolsOpened()) {
          mainWindow.webContents.closeDevTools()
        } else {
          mainWindow.webContents.openDevTools()
        }
      }
    })

    // 当应用退出时注销所有快捷键
    app.on("will-quit", () => {
      globalShortcut.unregisterAll()
    })
  }
})

// 所有窗口关闭时退出应用
app.on("window-all-closed", function () {
  // 在macOS上，除非用户用Cmd + Q确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活
  if (process.platform !== "darwin") app.quit()
})

app.on("activate", function () {
  // 在macOS上，当点击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口
  if (mainWindow === null) createWindow()
})
