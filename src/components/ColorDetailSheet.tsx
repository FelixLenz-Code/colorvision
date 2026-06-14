import { useState, useRef, useEffect } from 'react'
import { Heart, Volume2, Copy, Check, Info, X, Trash2, Edit2 } from 'lucide-react'
import type { PickedColor } from '../lib/colors'
import { speakColor } from '../lib/tts'

export interface ColorDetail extends PickedColor {
  timestamp?: number
  sourceFile?: string
  customLabel?: string
}

interface Props {
  color: ColorDetail
  isFavorite: boolean
  onToggleFavorite: () => void
  onDelete?: () => void
  onClose: () => void
  onSaveCustomLabel?: (label: string) => void
}

function getTextColor(l: number): string {
  return l > 55 ? '#1a1a2e' : '#ffffff'
}

export default function ColorDetailSheet({ color, isFavorite, onToggleFavorite, onDelete, onClose, onSaveCustomLabel }: Props) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [showDescription, setShowDescription] = useState(false)
  const [editingLabel, setEditingLabel] = useState(false)
  const [labelValue, setLabelValue] = useState(color.customLabel ?? '')
  const labelInputRef = useRef<HTMLInputElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerH, setHeaderH] = useState(0)
  const textColor = getTextColor(color.hsl.l)

  useEffect(() => {
    if (headerRef.current) setHeaderH(headerRef.current.offsetHeight)
  })

  useEffect(() => {
    if (editingLabel) labelInputRef.current?.focus()
  }, [editingLabel])

  const copyField = async (field: string, value: string) => {
    await navigator.clipboard.writeText(value).catch(() => {})
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 1500)
  }

  const saveLabel = () => {
    setEditingLabel(false)
    onSaveCustomLabel?.(labelValue.trim())
  }

  const colorValues = [
    { label: 'HEX', field: 'hex', value: color.hex },
    { label: 'RGB', field: 'rgb', value: `${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}` },
    { label: 'HSL', field: 'hsl', value: `${color.hsl.h}° ${color.hsl.s}% ${color.hsl.l}%` },
  ]

  const timeStr = color.timestamp
    ? new Date(color.timestamp).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet — no overflow-hidden so the popup can float above content */}
      <div className="relative z-10 w-full max-w-lg rounded-t-2xl shadow-xl flex flex-col" style={{ maxHeight: '85vh' }}>

        {/* Description popup — floats above the content */}
        {showDescription && color.descriptionDe && (
          <div
            className="absolute left-3 right-3 z-20 bg-card border border-border rounded-xl shadow-xl p-4"
            style={{ top: headerH + 6 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
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

        {/* Color header — rounded-t-2xl and overflow-hidden for corner clipping */}
        <div ref={headerRef} className="shrink-0 px-5 pt-4 pb-5 rounded-t-2xl overflow-hidden" style={{ backgroundColor: color.hex }}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex gap-2">
              <button
                onClick={onToggleFavorite}
                className="w-9 h-9 flex items-center justify-center rounded-full transition-all"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                title={isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
              >
                <Heart className="w-4 h-4" fill={isFavorite ? '#ff4d6d' : 'none'}
                  stroke={isFavorite ? '#ff4d6d' : textColor} />
              </button>
              <button
                onClick={() => setShowDescription(v => !v)}
                className="w-9 h-9 flex items-center justify-center rounded-full transition-all"
                style={{
                  backgroundColor: showDescription ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)',
                  color: textColor,
                }}
                title="Farbbeschreibung anzeigen"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full transition-all"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: textColor }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-2xl font-bold leading-none" style={{ color: textColor }}>{color.nameDe}</h2>
          <p className="text-sm mt-1 opacity-75" style={{ color: textColor }}>{color.nameEn}</p>

          {/* Custom label for favorites */}
          {onSaveCustomLabel && (
            <div className="mt-3">
              {editingLabel ? (
                <div className="flex items-center gap-2">
                  <input
                    ref={labelInputRef}
                    value={labelValue}
                    onChange={e => setLabelValue(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') saveLabel(); if (e.key === 'Escape') setEditingLabel(false) }}
                    placeholder="Eigener Name (z.B. Wandfarbe Küche)"
                    className="flex-1 bg-white/20 rounded-lg px-3 py-1.5 text-sm outline-none placeholder:opacity-60"
                    style={{ color: textColor }}
                  />
                  <button
                    onClick={saveLabel}
                    className="w-7 h-7 flex items-center justify-center rounded-lg"
                    style={{ backgroundColor: 'rgba(255,255,255,0.3)', color: textColor }}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => { setEditingLabel(false); setLabelValue(color.customLabel ?? '') }}
                    className="w-7 h-7 flex items-center justify-center rounded-lg"
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: textColor }}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingLabel(true)}
                  className="flex items-center gap-1.5 text-sm opacity-80 hover:opacity-100 transition-opacity"
                  style={{ color: textColor }}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  {labelValue || 'Eigenen Namen vergeben …'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Scrollable details */}
        <div className="flex-1 overflow-y-auto bg-card p-4 space-y-3">
          {/* Brightness + Zeit */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/60 rounded-xl p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">Helligkeit</p>
              <p className="text-base font-bold text-foreground capitalize">{color.brightnessDe}</p>
            </div>
            {timeStr && (
              <div className="bg-muted/60 rounded-xl p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">Uhrzeit</p>
                <p className="text-base font-bold text-foreground">{timeStr}</p>
              </div>
            )}
          </div>

          {/* Source file */}
          {color.sourceFile && (
            <div className="bg-muted/60 rounded-xl p-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-muted-foreground shrink-0"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Quelldatei</p>
                <p className="text-sm font-medium text-foreground truncate">{color.sourceFile}</p>
              </div>
            </div>
          )}

          {/* HEX / RGB / HSL */}
          <div className="grid grid-cols-3 gap-2">
            {colorValues.map(({ label, field, value }) => (
              <div key={field} className="bg-muted/60 rounded-xl p-2.5 flex flex-col items-center gap-1 relative">
                <div className="flex items-center gap-1 w-full justify-between">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
                  <button onClick={() => copyField(field, value)} className="p-0.5 rounded text-muted-foreground/60 hover:text-foreground transition-all" title={`${label} kopieren`}>
                    {copiedField === field ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <p className="font-mono text-xs font-semibold text-foreground text-center leading-tight break-all">{value}</p>
                {copiedField === field && (
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap pointer-events-none">Kopiert!</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 bg-card border-t border-border shrink-0">
          <button
            onClick={() => speakColor(color)}
            className="flex-1 py-3 rounded-xl font-semibold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <Volume2 className="w-4 h-4" />
            Vorlesen
          </button>
          {onDelete && (
            <button
              onClick={() => { onDelete(); onClose() }}
              className="w-12 flex items-center justify-center rounded-xl border border-border hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all text-muted-foreground"
              title="Löschen"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
