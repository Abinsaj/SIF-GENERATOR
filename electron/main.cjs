const { app, BrowserWindow, ipcMain, dialog } = require("electron")
const path = require("path")
const fs = require("fs")


function createWindow() {

  const win = new BrowserWindow({
    width: 1200,
    height: 900,

    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  const isDev =
    process.env.NODE_ENV === "development"

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

ipcMain.handle("save-sif-file",async (_, payload, payerEid, payerBankShortName, fileCreationDate, fileCreationTime) => {
    try {
      const { employer, employees, generatedContent} = payload

      const { filePath } = await dialog.showSaveDialog({
          defaultPath: `SIF_${payerEid}_${payerBankShortName}_${fileCreationDate}_${fileCreationTime}.csv`,

          filters: [
            {
              name: "CSV Files",
              extensions: ["csv"],
            },
          ],
        })

      if (!filePath) {
        return {
          success: false,
        }
      }
      
      let finalContent = generatedContent
      // if (fs.existsSync(filePath)) {

      //   const existingContent =
      //     fs.readFileSync(filePath, "utf-8")

      //   const lines = existingContent
      //     .split("\n")
      //     .filter(Boolean)

      //   const employerRow = lines[1]?.split(",")

      //   if (employerRow) {
      //     const existingEmployerEid =
      //       employerRow[0]
      //     const existingPayerEid =
      //       employerRow[3]
      //     const existingPayerBank =
      //       employerRow[5]
      //     const currentEmployerMatch =
      //       existingEmployerEid === employer.employerEid &&
      //       existingPayerEid === employer.payerEid &&
      //       existingPayerBank === employer.payerBankShortName

      //     if (!currentEmployerMatch) {

      //       return {
      //         success: false,
      //         error:
      //           "Employer details do not match existing file.",
      //       }
      //     }
      //   }
      // }
      fs.writeFileSync(filePath, finalContent)
      return {
        success: true,
      }
    } catch (error) {

      return {
        success: false,
        error: error.message,
      }
    }
  }
)