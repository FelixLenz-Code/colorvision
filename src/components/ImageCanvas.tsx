import { useRef, useState, useCallback, useEffect } from 'react'
import { ZoomIn, ZoomOut, Maximize2, Upload } from 'lucide-react'
import { getPixelColor, identifyColor, extractDominantColors } from '../lib/colors'
import type { PickedColor } from '../lib/colors'

interface Props {
  imageUrl: string
  onColorPicked: (color: PickedColor, x: number, y: number) => void
  onNewImage: () => void
  pickedPoint: { x: number; y: number } | null
  onDominantColors?: (colors: PickedColor[]) => void
}

interface Transform {
  zoom: number
  panX: number
  panY: number
}

const LENS_SIZE = 120   // px diameter of the magnifier circle
const LENS_SRC  = 24   // source pixels sampled from canvas (= 5× zoom)
const HOLD_MS   = 180  // ms finger must be held before lens appears

export default function ImageCanvas({ imageUrl, onColorPicked, onNewImage, pickedPoint, onDominantColors }: Props) {
  const canvasRef      = useRef<HTMLCanvasElement>(null)
  const containerRef   = useRef<HTMLDivElement>(null)
  const magnifierRef   = useRef<HTMLCanvasElement>(null)
  const [transform, setTransform] = useState<Transform>({ zoom: 1, panX: 0, panY: 0 })
  const [animating, setAnimating] = useState(false)
  const [lensPos, setLensPos]     = useState<{ x: number; y: number } | null>(null)
  const imgRef        = useRef<HTMLImageElement | null>(null)
  const isPanning     = useRef(false)
  const lastPointer   = useRef({ x: 0, y: 0 })
  const pinchDist     = useRef(0)
  const lastPickMs    = useRef(0)
  const holdTimer     = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isHeld        = useRef(false)
  const heldAt        = useRef<{ x: number; y: number } | null>(null)

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
      if (onDominantColors) onDominantColors(extractDominantColors(canvas, 5))
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

  const getCanvasCoords = useCallback((clientX: number, clientY: number) => {
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

  const pickAt = useCallback((clientX: number, clientY: number, relX: number, relY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const coords = getCanvasCoords(clientX, clientY)
    if (!coords) return
    const pixel = getPixelColor(canvas, coords.x, coords.y)
    if (!pixel) return
    onColorPicked(identifyColor(pixel.r, pixel.g, pixel.b), relX, relY)
  }, [getCanvasCoords, onColorPicked])

  // ── Magnifier ─────────────────────────────────────────────────────────────
  const renderLens = useCallback((clientX: number, clientY: number) => {
    const coords = getCanvasCoords(clientX, clientY)
    const src  = canvasRef.current
    const lens = magnifierRef.current
    if (!coords || !src || !lens) return
    const ctx = lens.getContext('2d')!
    const half = LENS_SRC / 2
    ctx.clearRect(0, 0, LENS_SIZE, LENS_SIZE)
    ctx.drawImage(src, coords.x - half, coords.y - half, LENS_SRC, LENS_SRC, 0, 0, LENS_SIZE, LENS_SIZE)
    // crosshair
    ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(LENS_SIZE/2 - 10, LENS_SIZE/2); ctx.lineTo(LENS_SIZE/2 + 10, LENS_SIZE/2); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(LENS_SIZE/2, LENS_SIZE/2 - 10); ctx.lineTo(LENS_SIZE/2, LENS_SIZE/2 + 10); ctx.stroke()
    ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.arc(LENS_SIZE/2, LENS_SIZE/2, 3, 0, Math.PI * 2); ctx.stroke()

    const rect = containerRef.current!.getBoundingClientRect()
    setLensPos({ x: clientX - rect.left, y: clientY - rect.top })
  }, [getCanvasCoords])

  const hideLens = useCallback(() => setLensPos(null), [])

  // ── Mouse handlers ────────────────────────────────────────────────────────
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning.current) {
      const dx = e.clientX - lastPointer.current.x
      const dy = e.clientY - lastPointer.current.y
      lastPointer.current = { x: e.clientX, y: e.clientY }
      setTransform(t => ({ ...t, panX: t.panX + dx, panY: t.panY + dy }))
    } else {
      renderLens(e.clientX, e.clientY)
    }
  }, [renderLens])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    hideLens()
    isPanning.current = true
    lastPointer.current = { x: e.clientX, y: e.clientY }
  }, [hideLens])

  const handleClick = useCallback((e: React.MouseEvent) => {
    const now = Date.now()
    if (now - lastPickMs.current < 400) return
    lastPickMs.current = now
    const rect = containerRef.current!.getBoundingClientRect()
    pickAt(e.clientX, e.clientY, e.clientX - rect.left, e.clientY - rect.top)
  }, [pickAt])

  // ── Touch handlers ────────────────────────────────────────────────────────
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      pinchDist.current = Math.hypot(dx, dy)
      // cancel any pending long-press
      if (holdTimer.current) { clearTimeout(holdTimer.current); holdTimer.current = null }
      hideLens(); isHeld.current = false
      return
    }
    const tx = e.touches[0].clientX
    const ty = e.touches[0].clientY
    lastPointer.current = { x: tx, y: ty }
    heldAt.current = { x: tx, y: ty }
    isHeld.current = false
    holdTimer.current = setTimeout(() => {
      isHeld.current = true
      renderLens(tx, ty)
    }, HOLD_MS)
  }, [renderLens, hideLens])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    if (e.touches.length === 2) {
      if (holdTimer.current) { clearTimeout(holdTimer.current); holdTimer.current = null }
      hideLens(); isHeld.current = false
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.hypot(dx, dy)
      const delta = dist / pinchDist.current
      pinchDist.current = dist
      setTransform(t => ({ ...t, zoom: clampZoom(t.zoom * delta) }))
      return
    }
    const tx = e.touches[0].clientX
    const ty = e.touches[0].clientY
    if (isHeld.current) {
      renderLens(tx, ty)
    } else {
      if (heldAt.current && Math.hypot(tx - heldAt.current.x, ty - heldAt.current.y) > 8) {
        if (holdTimer.current) { clearTimeout(holdTimer.current); holdTimer.current = null }
        heldAt.current = null
      }
      const dx = tx - lastPointer.current.x
      const dy = ty - lastPointer.current.y
      lastPointer.current = { x: tx, y: ty }
      setTransform(t => ({ ...t, panX: t.panX + dx, panY: t.panY + dy }))
    }
  }, [renderLens, hideLens])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (holdTimer.current) { clearTimeout(holdTimer.current); holdTimer.current = null }
    hideLens()
    const wasHeld = isHeld.current
    isHeld.current = false
    heldAt.current = null

    if (e.changedTouches.length === 1 && e.touches.length === 0) {
      e.preventDefault()
      const now = Date.now()
      if (now - lastPickMs.current < 400) return
      lastPickMs.current = now
      const touch = e.changedTouches[0]
      const rect = containerRef.current!.getBoundingClientRect()
      // long-press: pick at last held position; quick tap: pick at tap position
      void wasHeld
      pickAt(touch.clientX, touch.clientY, touch.clientX - rect.left, touch.clientY - rect.top)
    }
  }, [hideLens, pickAt])

  // ── Toolbar ────────────────────────────────────────────────────────────────
  const zoomIn  = () => setTransform(t => ({ ...t, zoom: clampZoom(t.zoom * 1.25) }))
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
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden cursor-crosshair"
        data-testid="canvas-container"
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => { isPanning.current = false }}
        onMouseLeave={() => { isPanning.current = false; hideLens() }}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div style={containerStyle}>
          <canvas ref={canvasRef} className="block rounded-lg select-none" data-testid="image-canvas" />
        </div>

        {/* Magnifier lens — always mounted so ref is available; visibility controlled via opacity */}
        <div
          className="pointer-events-none absolute z-20 transition-opacity duration-100"
          style={{
            left: lensPos?.x ?? 0,
            top: lensPos?.y ?? 0,
            transform: `translate(-50%, calc(-100% - 20px))`,
            opacity: lensPos ? 1 : 0,
          }}
        >
          <canvas
            ref={magnifierRef}
            width={LENS_SIZE}
            height={LENS_SIZE}
            className="rounded-full border-2 border-white shadow-2xl"
            style={{ width: LENS_SIZE, height: LENS_SIZE }}
          />
        </div>

        {/* Crosshair at last picked point */}
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

        {!pickedPoint && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-foreground/80 text-background text-xs px-3 py-1.5 rounded-full pointer-events-none">
            Tippe auf eine Farbe
          </div>
        )}
      </div>

      <div className="flex items-center px-4 py-2.5 border-t border-border bg-card shrink-0 gap-2">
        <button onClick={zoomOut} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors" title="Herauszoomen">
          <ZoomOut className="w-4 h-4 text-muted-foreground" />
        </button>
        <span className="text-xs font-mono text-muted-foreground w-10 text-center">
          {Math.round(transform.zoom * 100)}%
        </span>
        <button onClick={zoomIn} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors" title="Hineinzoomen">
          <ZoomIn className="w-4 h-4 text-muted-foreground" />
        </button>
        <button onClick={fitImage} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors" title="Bild einpassen">
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
