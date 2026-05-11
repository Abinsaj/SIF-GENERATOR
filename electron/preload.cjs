 const {contextBridge, ipcRenderer} = require('electron')


contextBridge.exposeInMainWorld("electronAPI", {
  saveSIFFile: (content) =>
    ipcRenderer.invoke("save-sif-file", content),
})
console.log("Preload Loaded")