 const {contextBridge, ipcRenderer} = require('electron')


contextBridge.exposeInMainWorld("electronAPI", {
  saveSIFFile: (content,name) =>
    ipcRenderer.invoke("save-sif-file", content,name),
})
console.log("Preload Loaded")