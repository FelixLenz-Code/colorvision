const { contextBridge, ipcRenderer, process: electronProcess } = require('electron')

const api = {
  saveFile: (filename, content) => ipcRenderer.invoke('save-file', filename, content),
  openFile: () => ipcRenderer.invoke('open-file'),
}

// On Linux, Web Speech API can't reach speech-dispatcher from inside an AppImage.
// Expose espeak-ng IPC so tts.ts can use it instead.
if (electronProcess.platform === 'linux') {
  api.speakElectron = (text, rate) => ipcRenderer.invoke('speak-text', text, rate)
  api.stopSpeakingElectron = () => ipcRenderer.invoke('stop-speaking')
}

contextBridge.exposeInMainWorld('electronAPI', api)
