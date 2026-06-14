import { useRef, useState, useCallback, useEffect } from 'react'
import { ZoomIn, ZoomOut, Maximize2, Upload } from 'lucide-react'
import { getPixelColor, identifyColor } from '../lib/colors'
import type { PickedColor } from '../lib/colors'

interface Props {
  imageUrl: string
  onColorPicked: (color: PickedColor, x: number, y: number) => void
  onNewImage: () => void
  pickedPoint: { x: number; y: number } | null
}

interface Transform {
  zoom: number
  panX: number
  panY: number
}

export default function ImageCanvas({ imageUrl, onColorPicked, onNewImage, pickedPoint }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState<Transform>({ zoom: 1, panX: 0, panY: 0 })
  const [animating, setAnimating] = useState(false)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const isPanning = useRef(false)
  const lastPointer = useRef({ x: 0, y: 0 })
  const pinchDist = useRef(0)
  const lastPickMs = useRef(0)

  // Load image onto canvas
  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      imgRef.current = img
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0)
      fitImage()
    }
    img.src = imageUrl
  }, [imageUrl])

  const fitImage = useCallback(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    const { clientWidth: cw, clientHeight: ch } = container
    const iw = canvas.width, ih = canvas.height
    const scale = Math.min((cw * 0.9) / iw, (ch * 0.9) / ih, 1)
    setAnimating(true)
    setTransform({ zoom: scale, panX: 0, panY: 0 })
    setTimeout(() => setAnimating(false), 350)
  }, [])

  const clampZoom = (z: number) => Math.max(0.1, Math.min(8, z))

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.85 : 1 / 0.85
    setTransform(t => ({ ...t, zoom: clampZoom(t.zoom * delta) }))
  }, [])

  const getCanvasCoords = useCallback((clientX: number, clientY: number): { x: number; y: number } | null => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return null
    const rect = container.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const localX = (clientX - cx - transform.panX) / transform.zoom + canvas.width / 2
    const localY = (clientY - cy - transform.panY) / transform.zoom + canvas.height / 2
    return { x: localX, y: localY }
  }, [transform])



  const handleClick = useCallback((e: React.MouseEvent) => {
    const now = Date.now()
    if (now - lastPickMs.current < 400) return // block ghost click after touch
    lastPickMs.current = now
    const canvas = canvasRef.current
    if (!canvas) return
    const coords = getCanvasCoords(e.clientX, e.clientY)
    if (!coords) return
    const pixel = getPixelColor(canvas, coords.x, coords.y)
    if (!pixel) return
    const color = identifyColor(pixel.r, pixel.g, pixel.b)
    const container = containerRef.current!
    const rect = container.getBoundingClientRect()
    onColorPicked(color, e.clientX - rect.left, e.clientY - rect.top)
  }, [getCanvasCoords, onColorPicked])

  // Touch pinch-to-zoom
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      pinchDist.current = Math.hypot(dx, dy)
    } else if (e.touches.length === 1) {
      lastPointer.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.hypot(dx, dy)
      const delta = dist / pinchDist.current
      pinchDist.current = dist
      setTransform(t => ({ ...t, zoom: clampZoom(t.zoom * delta) }))
    } else if (e.touches.length === 1) {
      const dx = e.touches[0].clientX - lastPointer.current.x
      const dy = e.touches[0].clientY - lastPointer.current.y
      lastPointer.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      setTransform(t => ({ ...t, panX: t.panX + dx, panY: t.panY + dy }))
    }
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.changedTouches.length === 1 && e.touches.length === 0) {
      e.preventDefault() // verhindert den synthetischen click-Event danach
      const now = Date.now()
      if (now - lastPickMs.current < 400) return
      lastPickMs.current = now
      const touch = e.changedTouches[0]
      const canvas = canvasRef.current
      if (!canvas) return
      const coords = getCanvasCoords(touch.clientX, touch.clientY)
      if (!coords) return
      const pixel = getPixelColor(canvas, coords.x, coords.y)
      if (!pixel) return
      const color = identifyColor(pixel.r, pixel.g, pixel.b)
      const container = containerRef.current!
      const rect = container.getBoundingClientRect()
      onColorPicked(color, touch.clientX - rect.left, touch.clientY - rect.top)
    }
  }, [getCanvasCoords, onColorPicked])

  const zoomIn = () => setTransform(t => ({ ...t, zoom: clampZoom(t.zoom * 1.25) }))
  const zoomOut = () => setTransform(t => ({ ...t, zoom: clampZoom(t.zoom / 1.25) }))

  const containerStyle = {
    position: 'absolute' as const,
    top: '50%', left: '50%',
    transformOrigin: 'center center',
    transform: `translate(-50%, -50%) translate(${transform.panX}px, ${transform.panY}px) scale(${transform.zoom})`,
    willChange: 'transform' as const,
    transition: animating ? 'transform 0.32s cubic-bezier(0.34,1.56,0.64,1)' : 'none',
  }

  return (
    <div className="flex flex-col h-full">
      {/* Canvas area */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden cursor-crosshair"
        data-testid="canvas-container"
        onClick={handleClick}
        onMouseDown={e => { isPanning.current = true; lastPointer.current = { x: e.clientX, y: e.clientY } }}
        onMouseMove={e => { if (!isPanning.current) return; const dx = e.clientX - lastPointer.current.x; const dy = e.clientY - lastPointer.current.y; lastPointer.current = { x: e.clientX, y: e.clientY }; setTransform(t => ({ ...t, panX: t.panX + dx, panY: t.panY + dy })) }}
        onMouseUp={() => { isPanning.current = false }}
        onMouseLeave={() => { isPanning.current = false }}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div style={containerStyle}>
          <canvas
            ref={canvasRef}
            className="block rounded-lg select-none"
            data-testid="image-canvas"
          />
        </div>

        {/* Crosshair indicator */}
        {pickedPoint && (
          <div
            className="pointer-events-none absolute"
            style={{ left: pickedPoint.x, top: pickedPoint.y, transform: 'translate(-50%, -50%)' }}
          >
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border-2 border-white/80 shadow-lg" />
              <div className="absolute inset-1 rounded-full border border-black/20" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-white/80 -translate-y-px" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/80 -translate-x-px" />
            </div>
          </div>
        )}

        {/* Hint tooltip */}
        {!pickedPoint && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-foreground/80 text-background text-xs px-3 py-1.5 rounded-full pointer-events-none">
            Tippe auf eine Farbe
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex items-center px-4 py-2.5 border-t border-border bg-card shrink-0 gap-2">
        <button
          onClick={zoomOut}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
          title="Herauszoomen"
        >
          <ZoomOut className="w-4 h-4 text-muted-foreground" />
        </button>
        <span className="text-xs font-mono text-muted-foreground w-10 text-center">
          {Math.round(transform.zoom * 100)}%
        </span>
        <button
          onClick={zoomIn}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
          title="Hineinzoomen"
        >
          <ZoomIn className="w-4 h-4 text-muted-foreground" />
        </button>
        <button
          onClick={fitImage}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
          title="Bild einpassen"
        >
          <Maximize2 className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="flex-1" />
        <button
          onClick={onNewImage}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border border-border hover:bg-muted transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          Anderes Bild
        </button>
      </div>
    </div>
  )
}
