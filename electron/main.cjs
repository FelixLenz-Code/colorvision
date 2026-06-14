const { app, BrowserWindow, nativeTheme } = require('electron')
const path = require('path')
const { existsSync } = require('fs')

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

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
