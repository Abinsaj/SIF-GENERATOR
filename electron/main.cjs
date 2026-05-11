
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')


function createWindow() {

  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  const isDev = process.env.NODE_ENV === "development"

  if (isDev) {
    win.loadURL("http://localhost:5173")
  } else {
    win.loadFile(
      path.join(__dirname, "../dist/index.html")
    )
  }

  // win.webContents.openDevTools()

}


app.whenReady().then(() => {
  createWindow()
})

ipcMain.handle("save-sif-file", async (_, content) => {
  const { filePath } = await dialog.showSaveDialog({
    defaultPath: "employee.sif",
    filters: [
      {
        name: "SIF Files",
        extensions: ["sif"],
      },
    ],
  })

  if (filePath) {
    fs.writeFileSync(filePath, content)
    return {
      success: true,
    }
  }

  return {
    success: false,
  }
})