const { contextBridge, ipcRenderer } = require('electron');

// 在渲染进程中暴露安全的API
contextBridge.exposeInMainWorld('electronAPI', {
  // 这里可以添加需要暴露给渲染进程的功能
  // 例如：获取版本信息
  getAppVersion: () => process.env.npm_package_version,
});