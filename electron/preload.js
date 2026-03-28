const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  exportCSV: (defaultName, csvContent) =>
    ipcRenderer.invoke('export-csv', { defaultName, csvContent }),

  backupData: (jsonData) =>
    ipcRenderer.invoke('backup-data', jsonData),

  restoreData: () =>
    ipcRenderer.invoke('restore-data'),

  getAppVersion: () =>
    ipcRenderer.invoke('get-app-version'),

  openExternal: (url) =>
    ipcRenderer.invoke('open-external', url),

  // ─── Auto-updater ────────────────────────────────────────────
  onUpdateAvailable: (cb) =>
    ipcRenderer.on('update-available', (_e, info) => cb(info)),

  onUpdateProgress: (cb) =>
    ipcRenderer.on('update-progress', (_e, progress) => cb(progress)),

  onUpdateDownloaded: (cb) =>
    ipcRenderer.on('update-downloaded', () => cb()),

  startUpdateDownload: () =>
    ipcRenderer.invoke('start-update-download'),

  checkForUpdates: () =>
    ipcRenderer.invoke('check-for-updates'),

  restartForUpdate: () =>
    ipcRenderer.invoke('restart-for-update'),

  removeUpdateListeners: () => {
    ipcRenderer.removeAllListeners('update-available')
    ipcRenderer.removeAllListeners('update-progress')
    ipcRenderer.removeAllListeners('update-downloaded')
  },

  isElectron: true,
})
