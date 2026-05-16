const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("electronAPI", {

  saveSIFFile: (payload, payerEid, payerBankShortName, fileCreationDate, fileCreationTime) =>
    ipcRenderer.invoke("save-sif-file", payload, payerEid, payerBankShortName, fileCreationDate, fileCreationTime),

})

console.log("Preload Loaded")