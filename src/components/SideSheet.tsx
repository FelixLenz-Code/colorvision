import { useRef, useState, useEffect, type ReactNode } from 'react'

type SnapPos = 'narrow' | 'mid' | 'wide'

interface Props {
  children: ReactNode
  snap: SnapPos
  onSnapChange: (s: SnapPos) => void
  onTouchStart?: (e: React.TouchEvent) => void
  onTouchEnd?: (e: React.TouchEvent) => void
  onTouchCancel?: (e: React.TouchEvent) => void
}

const HANDLE_W = 20

function getW(snap: SnapPos): number {
  if (typeof window === 'undefined') return 288
  const vw = window.innerWidth
  if (snap === 'narrow') return Math.round(vw * 0.25)
  if (snap === 'mid') return Math.round(vw * 0.35)
  return Math.round(vw * 0.48)
}

function nearestSnap(w: number): SnapPos {
  const vw = window.innerWidth
  const snaps: [SnapPos, number][] = [
    ['narrow', Math.round(vw * 0.25)],
    ['mid',    Math.round(vw * 0.35)],
    ['wide',   Math.round(vw * 0.48)],
  ]
  return snaps.reduce(([bs, bv], [cs, cv]) =>
    Math.abs(cv - w) < Math.abs(bv - w) ? [cs, cv] : [bs, bv]
  )[0]
}

export default function SideSheet({ children, snap, onSnapChange, onTouchStart, onTouchEnd, onTouchCancel }: Props) {
  const [width, setWidth] = useState(() => getW(snap))
  const [animating, setAnimating] = useState(false)
  const dragging = useRef(false)
  const startX = useRef(0)
  const startW = useRef(0)
  const widthRef = useRef(width)
  widthRef.current = width

  useEffect(() => {
    const target = getW(snap)
    if (target === widthRef.current) return
    setAnimating(true)
    setWidth(target)
    const t = setTimeout(() => setAnimating(false), 320)
    return () => clearTimeout(t)
  }, [snap])

  const finishDrag = () => {
    if (!dragging.current) return
    dragging.current = false
    const best = nearestSnap(widthRef.current)
    setAnimating(true)
    setWidth(getW(best))
    onSnapChange(best)
    setTimeout(() => setAnimating(false), 320)
  }

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true
    startX.current = e.clientX
    startW.current = widthRef.current
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    const dx = startX.current - e.clientX
    const maxW = window.innerWidth * 0.65
    setWidth(Math.max(140, Math.min(Math.round(maxW), startW.current + dx)))
  }

  return (
    <div
      className="flex shrink-0 bg-card border-l border-border overflow-hidden"
      style={{
        width,
        transition: animating ? 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
      }}
    >
      {/* Drag handle — left edge */}
      <div
        className="flex items-center justify-center cursor-col-resize touch-none select-none shrink-0 bg-muted border-r border-border hover:bg-muted/60 transition-colors"
        style={{ width: HANDLE_W }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
      >
        <div className="w-1 h-10 rounded-full bg-muted-foreground/30" />
      </div>

      <div
        className="flex-1 overflow-y-auto min-w-0 h-full"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchCancel}
      >
        {children}
      </div>
    </div>
  )
}
