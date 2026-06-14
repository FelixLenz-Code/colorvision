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

function getBestGermanVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('de'))
  if (voices.length === 0) return null

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

  const best = [...voices].sort((a, b) => score(b) - score(a))[0]
  return score(best) < 50 ? null : best
}

export function speakColor(color: PickedColor): void {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()

  const name = PRONUNCIATION_FIXES[color.nameDe] ?? color.nameDe
  const text = `${color.brightnessDeSpeech} ${name}`
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'de-DE'

  if (isIOS()) {
    utterance.rate = 0.8
    utterance.pitch = 1
  } else {
    utterance.rate = 0.88
    utterance.pitch = 1.05
  }

  const speak = () => {
    const voice = getBestGermanVoice()
    if (voice) utterance.voice = voice
    window.speechSynthesis.speak(utterance)
  }

  if (window.speechSynthesis.getVoices().length > 0) {
    speak()
  } else {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null
      speak()
    }
  }
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}
