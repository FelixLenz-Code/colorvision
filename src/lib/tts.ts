import type { PickedColor } from './colors'

declare global {
  interface Window {
    electronAPI?: {
      saveFile?: (filename: string, content: string) => Promise<boolean>
      openFile?: () => Promise<string | null>
      speakElectron?: (text: string, rate: number) => void
      stopSpeakingElectron?: () => void
    }
  }
}

const PRONUNCIATION_FIXES: Record<string, string> = {
  Cyan: 'Zyan',
  Khaki: 'Kaki',
  Apricot: 'Aprikose',
  Neonpink: 'Neon-pink',
  Neonorange: 'Neon-orange',
  Bordeaux: 'Bordo',
  Taupe: 'Toup',
  Chartreuse: 'Schartrös',
  Fuchsia: 'Fuksia',
  Beige: 'Bäsch',
  Ecru: 'Ekrü',
  Magentarosa: 'Magenta-rosa',
  Pastellorange: 'Pastell-orange',
}

function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

let cachedVoice: SpeechSynthesisVoice | null = null

function pickBestVoice(): SpeechSynthesisVoice | null {
  const all = window.speechSynthesis.getVoices()
  if (all.length === 0) return null
  const de = all.filter(v => v.lang.startsWith('de'))
  const pool = de.length > 0 ? de : all

  const score = (v: SpeechSynthesisVoice): number => {
    const n = v.name.toLowerCase()
    if (n.includes('premium')) return 100
    if (n.includes('enhanced')) return 95
    if (n.includes('yannick')) return 90
    if (n.includes('markus')) return 82
    if (n.includes('lena')) return 78
    if (n.includes('hannah')) return 75
    if (n.includes('helena')) return 72
    if (n.includes('liselotte')) return 68
    if (!v.localService) return 60
    return 15
  }
  return [...pool].sort((a, b) => score(b) - score(a))[0]
}

export function preloadVoices(): void {
  if (!('speechSynthesis' in window)) return

  const tryLoad = () => {
    const v = pickBestVoice()
    if (v) cachedVoice = v
  }

  tryLoad()
  if (!cachedVoice) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null
      tryLoad()
    }
    setTimeout(tryLoad, 500)
    setTimeout(tryLoad, 2000)
  }
}

export function speakColor(color: PickedColor): void {
  const name = PRONUNCIATION_FIXES[color.nameDe] ?? color.nameDe
  const text = `${color.brightnessDeSpeech} ${name}`
  const rate = isIOS() ? 0.8 : 0.88

  // Electron on Linux: use espeak-ng via IPC (speech-dispatcher unreachable in AppImage)
  if (window.electronAPI?.speakElectron) {
    window.electronAPI.speakElectron(text, rate)
    return
  }

  if (!('speechSynthesis' in window)) return

  window.speechSynthesis.cancel()

  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = 'de-DE'
  utter.volume = 1
  utter.rate = rate
  utter.pitch = isIOS() ? 1 : 1.05

  const voice = cachedVoice ?? pickBestVoice()
  if (voice) utter.voice = voice

  utter.onerror = (e) => console.error('[TTS] Fehler:', e.error)
  window.speechSynthesis.speak(utter)
}

export function stopSpeaking(): void {
  if (window.electronAPI?.stopSpeakingElectron) {
    window.electronAPI.stopSpeakingElectron()
    return
  }
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}
