import type { PickedColor } from './colors'

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

let cachedVoice: SpeechSynthesisVoice | null | undefined = undefined
// Modul-Variable verhindert Garbage Collection der Utterance vor dem Sprechen
let activeUtterance: SpeechSynthesisUtterance | null = null

function pickBestVoice(): SpeechSynthesisVoice | null {
  const all = window.speechSynthesis.getVoices()
  const de = all.filter(v => v.lang.startsWith('de'))
  const pool = de.length > 0 ? de : all // fall back to any voice if no German found
  if (pool.length === 0) return null

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
    if (v.localService) return 15
    return 60
  }
  return [...pool].sort((a, b) => score(b) - score(a))[0]
}

/** Voices im Hintergrund voraden — in App.tsx beim Start aufrufen. */
export function preloadVoices(): void {
  if (!('speechSynthesis' in window)) return
  const tryLoad = () => {
    const v = pickBestVoice()
    if (v !== null) { cachedVoice = v; return }
    cachedVoice = null
  }
  tryLoad()
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.onvoiceschanged = null
    tryLoad()
  }
  // Nochmal nach 1s falls onvoiceschanged nie feuert
  setTimeout(tryLoad, 1000)
}

function getBestGermanVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice !== undefined) return cachedVoice
  return pickBestVoice()
}

export function speakColor(color: PickedColor): void {
  if (!('speechSynthesis' in window)) return

  if (window.speechSynthesis.paused) window.speechSynthesis.resume()
  window.speechSynthesis.cancel()

  const name = PRONUNCIATION_FIXES[color.nameDe] ?? color.nameDe
  const text = `${color.brightnessDeSpeech} ${name}`

  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = 'de-DE'
  utter.volume = 1

  if (isIOS()) {
    utter.rate = 0.8
    utter.pitch = 1
  } else {
    utter.rate = 0.88
    utter.pitch = 1.05
  }

  const voice = getBestGermanVoice()
  if (voice) utter.voice = voice

  utter.onerror = (e) => console.error('[TTS] Fehler:', e.error)

  activeUtterance = utter

  // Chrome/Linux: nach cancel() kurz warten, sonst wird speak() ignoriert
  setTimeout(() => {
    if (activeUtterance === utter) window.speechSynthesis.speak(utter)
  }, 50)
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
  activeUtterance = null
}
