const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("electronAPI", {

  saveSIFFile: (payload, name) =>
    ipcRenderer.invoke("save-sif-file", payload, name),

})

console.log("Preload Loaded")