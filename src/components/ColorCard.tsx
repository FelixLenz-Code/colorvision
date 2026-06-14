import { useState, useEffect, useRef } from 'react'
import { Heart, Volume2, VolumeX, Copy, Check, Info, X, AlertTriangle } from 'lucide-react'
import type { PickedColor } from '../lib/colors'
import { speakColor, stopSpeaking } from '../lib/tts'

interface Props {
  color: PickedColor
  isFavorite: boolean
  onToggleFavorite: () => void
  autoSpeak: boolean
  onToggleAutoSpeak: () => void
  customLabel?: string
}

function getContrastColors(r: number, g: number, b: number) {
  const lin = (c: number) => { const s = c / 255; return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4 }
  const lum = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
  const useDark = (lum + 0.05) / 0.05 > 1.05 / (lum + 0.05)
  return {
    text: useDark ? '#1a1a2e' : '#ffffff',
    btnBg: useDark ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.22)',
    btnBgActive: useDark ? 'rgba(0,0,0,0.22)' : 'rgba(255,255,255,0.40)',
    pillBg: useDark ? 'rgba(0,0,0,0.09)' : 'rgba(255,255,255,0.28)',
  }
}

export default function ColorCard({ color, isFavorite, onToggleFavorite, autoSpeak, onToggleAutoSpeak, customLabel }: Props) {
  const [speaking, setSpeaking] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [showDescription, setShowDescription] = useState(false)
  const speakTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerH, setHeaderH] = useState(0)
  const { text: textColor, btnBg, btnBgActive, pillBg } = getContrastColors(color.rgb.r, color.rgb.g, color.rgb.b)

  useEffect(() => {
    if (headerRef.current) setHeaderH(headerRef.current.offsetHeight)
  })

  useEffect(() => {
    setSpeaking(false)
    stopSpeaking()
    setShowDescription(false)
    return () => {
      if (speakTimeoutRef.current) clearTimeout(speakTimeoutRef.current)
    }
  }, [color.hex])

  const copyField = async (field: string, value: string) => {
    await navigator.clipboard.writeText(value).catch(() => {})
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 1500)
  }

  const handleSpeak = () => {
    if (speaking) {
      stopSpeaking()
      setSpeaking(false)
      if (speakTimeoutRef.current) clearTimeout(speakTimeoutRef.current)
    } else {
      setSpeaking(true)
      speakColor(color)
      speakTimeoutRef.current = setTimeout(() => setSpeaking(false), 5000)
    }
  }

  const colorValues = [
    { label: 'HEX', field: 'hex', value: color.hex },
    { label: 'RGB', field: 'rgb', value: `${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}` },
    { label: 'HSL', field: 'hsl', value: `${color.hsl.h}° ${color.hsl.s}% ${color.hsl.l}%` },
  ]

  return (
    <div className="relative flex flex-col h-full">
      {/* Color header */}
      <div ref={headerRef} className="shrink-0 px-5 py-4" style={{ backgroundColor: color.hex }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold leading-none" style={{ color: textColor }}>
              {color.nameDe}
            </h2>
            <p className="text-sm mt-0.5 opacity-75" style={{ color: textColor }}>
              {color.nameEn}
            </p>
            {customLabel && (
              <p className="text-xs mt-1 font-semibold px-2 py-0.5 rounded-full inline-block"
                style={{ backgroundColor: pillBg, color: textColor }}>
                {customLabel}
              </p>
            )}
            {color.borderHint && (
              <p className="text-xs mt-1.5 flex items-center gap-1 opacity-80" style={{ color: textColor }}>
                <AlertTriangle className="w-3 h-3 shrink-0" />
                Grenzt an {color.borderHint}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleFavorite}
              className="w-9 h-9 flex items-center justify-center rounded-full transition-all"
              style={{ backgroundColor: btnBg }}
              title={isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
              data-testid="favorite-btn"
            >
              <Heart
                className="w-4 h-4"
                fill={isFavorite ? '#ff4d6d' : 'none'}
                stroke={isFavorite ? '#ff4d6d' : textColor}
              />
            </button>
            <button
              onClick={() => setShowDescription(v => !v)}
              className="w-9 h-9 flex items-center justify-center rounded-full transition-all"
              style={{ backgroundColor: showDescription ? btnBgActive : btnBg, color: textColor }}
              title="Farbbeschreibung"
              data-testid="info-btn"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Description popup — floats above the details */}
      {showDescription && color.descriptionDe && (
        <div
          className="absolute left-3 right-3 z-10 bg-card border border-border rounded-xl shadow-xl p-4"
          style={{ top: headerH + 4 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-start gap-3">
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">{color.descriptionDe}</p>
            <button
              onClick={() => setShowDescription(false)}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-muted shrink-0 mt-0.5"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>
      )}

      {/* Details — scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="bg-card rounded-xl p-3 border border-border">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">Helligkeit</p>
          <p className="text-lg font-bold text-foreground capitalize">{color.brightnessDe}</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {colorValues.map(({ label, field, value }) => (
            <div key={field} className="bg-muted/60 rounded-xl p-2.5 flex flex-col items-center gap-1 group relative">
              <div className="flex items-center gap-1 w-full justify-between">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
                <button
                  onClick={() => copyField(field, value)}
                  className="p-0.5 rounded text-muted-foreground/60 hover:text-foreground active:scale-90 transition-all"
                  title={`${label} kopieren`}
                >
                  {copiedField === field
                    ? <Check className="w-3 h-3 text-green-500" />
                    : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <p className="font-mono text-xs font-semibold text-foreground text-center leading-tight break-all">{value}</p>
              {copiedField === field && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap pointer-events-none">
                  Kopiert!
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSpeak}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              speaking
                ? 'bg-background border-2 border-primary text-primary'
                : 'bg-primary text-primary-foreground hover:opacity-90'
            }`}
            data-testid="speak-btn"
          >
            {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            {speaking ? 'Stopp' : 'Vorlesen'}
          </button>
          <button
            onClick={onToggleAutoSpeak}
            className={`px-3.5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-1.5 border-2 ${
              autoSpeak
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-muted/60 text-muted-foreground hover:border-primary/40'
            }`}
            title={autoSpeak ? 'Auto-Vorlesen aktiv' : 'Auto-Vorlesen aus'}
            data-testid="autospeak-toggle"
          >
            {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="text-xs font-medium">Auto</span>
          </button>
        </div>

        <p className="text-[11px] text-muted-foreground text-center">
          {autoSpeak
            ? 'Jede erkannte Farbe wird automatisch vorgelesen'
            : 'Auto-Vorlesen ist deaktiviert'}
        </p>
      </div>
    </div>
  )
}
