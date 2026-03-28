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

  onUpdateNotAvailable: (cb) =>
    ipcRenderer.on('update-not-available', (_e, info) => cb(info)),

  onUpdateChecking: (cb) =>
    ipcRenderer.on('update-checking', () => cb()),

  onUpdateProgress: (cb) =>
    ipcRenderer.on('update-progress', (_e, progress) => cb(progress)),

  onUpdateDownloaded: (cb) =>
    ipcRenderer.on('update-downloaded', () => cb()),

  onUpdateError: (cb) =>
    ipcRenderer.on('update-error', (_e, err) => cb(err)),

  startUpdateDownload: () =>
    ipcRenderer.invoke('start-update-download'),

  checkForUpdates: () =>
    ipcRenderer.invoke('check-for-updates'),

  restartForUpdate: () =>
    ipcRenderer.invoke('restart-for-update'),

  removeUpdateListeners: () => {
    ipcRenderer.removeAllListeners('update-available')
    ipcRenderer.removeAllListeners('update-not-available')
    ipcRenderer.removeAllListeners('update-checking')
    ipcRenderer.removeAllListeners('update-progress')
    ipcRenderer.removeAllListeners('update-downloaded')
    ipcRenderer.removeAllListeners('update-error')
  },

  isElectron: true,
})
