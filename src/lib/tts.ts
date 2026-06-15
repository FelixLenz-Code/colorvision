import type { PickedColor } from './colors'

declare global {
  interface Window {
    electronAPI?: {
      saveFile?: (filename: string, content: string) => Promise<boolean>
      openFile?: () => Promise<string | null>
      printToPdf?: (html: string, filename: string) => Promise<boolean>
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

function getBestVoice(): SpeechSynthesisVoice | null {
  const all = window.speechSynthesis.getVoices()
  const de = all.filter(v => v.lang.startsWith('de'))
  const pool = de.length > 0 ? de : all
  if (pool.length === 0) return null

  const score = (v: SpeechSynthesisVoice): number => {
    const n = v.name.toLowerCase()
    if (n.includes('premium')) return 100
    if (n.includes('enhanced')) return 95
    if (n.includes('yannick')) return 90
    if (n.includes('markus')) return 82
    if (n.includes('anna')) return 80
    if (n.includes('lena')) return 78
    if (n.includes('hannah')) return 75
    if (n.includes('helena')) return 72
    if (n.includes('liselotte')) return 68
    if (n.includes('google')) return 65
    if (!v.localService) return 60
    if (v.lang.startsWith('de')) return 20
    return 10
  }
  return [...pool].sort((a, b) => score(b) - score(a))[0]
}

// Cached voice — populated at startup so speakColor never needs an async path
let cachedVoice: SpeechSynthesisVoice | null = null

// Only warn once per session
let silenceWarned = false

function isLinuxChrome(): boolean {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') return false
  if (window.electronAPI) return false
  const ua = navigator.userAgent
  return /Linux/.test(ua) && /Chrome\//.test(ua) && !/Android/.test(ua)
}

export function preloadVoices(): void {
  if (!('speechSynthesis' in window)) return
  const cacheVoice = () => { cachedVoice = getBestVoice() }
  cacheVoice()
  window.speechSynthesis.onvoiceschanged = () => {
    cacheVoice()
    // Keep listener alive — Chrome may fire this multiple times
  }
}

export function speakColor(color: PickedColor): void {
  const name = PRONUNCIATION_FIXES[color.nameDe] ?? color.nameDe
  const text = `${color.brightnessDeSpeech} ${name}`
  const rate = isIOS() ? 0.8 : 0.82

  // Electron on Linux: use espeak-ng directly (speech-dispatcher unreachable in AppImage)
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
  utter.onerror = (e) => console.error('[TTS]', e.error)
  // Use cached voice (may be null on first pick before voices load — browser uses default)
  const voice = cachedVoice ?? getBestVoice()
  if (voice) utter.voice = voice

  // Chrome bug: speechSynthesis can get stuck in paused state after ~15s idle
  if (window.speechSynthesis.paused) window.speechSynthesis.resume()

  // Detect silent failure on Chrome/Linux (speech-dispatcher often produces no audio)
  if (isLinuxChrome() && !silenceWarned) {
    const silenceTimer = setTimeout(() => {
      silenceWarned = true
      window.dispatchEvent(new CustomEvent('tts-silent-fail'))
    }, 600)
    utter.onstart = () => clearTimeout(silenceTimer)
  }

  window.speechSynthesis.speak(utter)
}

export function stopSpeaking(): void {
  if (window.electronAPI?.stopSpeakingElectron) {
    window.electronAPI.stopSpeakingElectron()
    return
  }
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}
