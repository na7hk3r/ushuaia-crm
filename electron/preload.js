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

  isElectron: true,
})
