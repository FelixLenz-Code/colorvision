import { useRef, useState, useCallback } from 'react'
import { Upload, Clipboard, Crosshair, Volume2, Globe, ZoomIn } from 'lucide-react'

interface Props {
  onImageLoaded: (url: string) => void
}

export default function UploadScreen({ onImageLoaded }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    onImageLoaded(url)
  }, [onImageLoaded])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) loadFile(file)
  }

  const handlePaste = async () => {
    try {
      const items = await navigator.clipboard.read()
      for (const item of items) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            const blob = await item.getType(type)
            onImageLoaded(URL.createObjectURL(blob))
            return
          }
        }
      }
    } catch { /* clipboard not available */ }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) loadFile(file)
  }

  const features = [
    { icon: Crosshair, text: 'Farbe per Tipp erkennen' },
    { icon: Volume2, text: 'Automatische Sprachausgabe' },
    { icon: Globe, text: 'Deutsch & Englisch' },
    { icon: ZoomIn, text: 'Zoom mit Pinch-Geste' },
  ]

  return (
    <div
      className={`flex-1 flex items-center justify-center m-4 rounded-2xl border-2 border-dashed transition-all duration-200 ${
        dragging ? 'border-primary bg-primary/5' : 'border-border bg-card'
      }`}
      data-testid="drop-zone"
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        type="file"
        onChange={handleFileChange}
        data-testid="file-input"
      />
      <div className="text-center px-6 py-10 max-w-sm w-full">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 text-primary">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Bild laden</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Wähle ein Foto aus der Mediathek, füge es aus der Zwischenablage ein oder ziehe es per Drag &amp; Drop hierher
        </p>
        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground font-semibold py-3 px-5 rounded-xl shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all"
            data-testid="pick-photo-btn"
          >
            <Upload className="w-4 h-4" />
            Foto aus Mediathek
          </button>
          <button
            onClick={handlePaste}
            className="flex items-center justify-center gap-2 w-full bg-muted border border-border text-foreground font-medium py-3 px-5 rounded-xl hover:bg-muted/80 active:scale-[0.98] transition-all"
            data-testid="paste-btn"
          >
            <Clipboard className="w-4 h-4" />
            Aus Zwischenablage einfügen
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 text-left text-xs text-muted-foreground">
          {features.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-2">
              <Icon className="w-4 h-4 mt-0.5 text-primary shrink-0" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
