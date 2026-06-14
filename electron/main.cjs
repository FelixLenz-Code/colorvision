const { app, BrowserWindow, nativeTheme, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')
const { existsSync } = fs

const isDev = !existsSync(path.join(__dirname, '../dist/index.html'))

function createWindow() {
  const win = new BrowserWindow({
    width: 420,
    height: 820,
    minWidth: 320,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
    icon: path.join(__dirname, '../public/icons/icon-512.png'),
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    title: 'ColorVision',
    backgroundColor: '#f4f5f8',
  })

  if (isDev) {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Remove default menu
  win.setMenuBarVisibility(false)

  // Force light theme
  nativeTheme.themeSource = 'light'
}

// Linux TTS via espeak-ng (speech-dispatcher is unreachable inside an AppImage)
if (process.platform === 'linux') {
  const { execFile } = require('child_process')
  let speakProc = null

  ipcMain.handle('speak-text', (_event, text, rate) => {
    if (speakProc) { speakProc.kill(); speakProc = null }
    const r = Number(rate)
    const wpm = String(isFinite(r) ? Math.max(80, Math.min(500, Math.round(r * 160))) : 130)
    speakProc = execFile('espeak-ng', ['-v', 'de', '-s', wpm, '--', text], (err) => {
      if (err && err.signal !== 'SIGTERM') console.error('[espeak-ng]', err.message)
      speakProc = null
    })
  })

  ipcMain.handle('stop-speaking', () => {
    if (speakProc) { speakProc.kill(); speakProc = null }
  })
}

ipcMain.handle('save-file', async (event, filename, content) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  const { filePath } = await dialog.showSaveDialog(win, {
    defaultPath: path.join(app.getPath('downloads'), filename),
    filters: [{ name: 'CSV', extensions: ['csv'] }],
  })
  if (!filePath) return false
  fs.writeFileSync(filePath, content, 'utf-8')
  return true
})

ipcMain.handle('open-file', async (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  const { filePaths } = await dialog.showOpenDialog(win, {
    filters: [{ name: 'CSV', extensions: ['csv'] }],
    properties: ['openFile'],
  })
  if (!filePaths[0]) return null
  return fs.readFileSync(filePaths[0], 'utf-8')
})

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
