import { useRef, useState, useEffect, type ReactNode } from 'react'

type SnapPos = 'peek' | 'mid' | 'full'

interface Props {
  children: ReactNode
  snap: SnapPos
  onSnapChange: (s: SnapPos) => void
  peekH?: number
}

const HANDLE_H = 24

function getH(snap: SnapPos, peekH: number): number {
  if (typeof window === 'undefined') return 200
  const vh = window.innerHeight
  if (snap === 'peek') return peekH
  if (snap === 'mid') return Math.round(vh * 0.38)
  return Math.round(vh * 0.78)
}

function nearestSnap(h: number, peekH: number): SnapPos {
  const vh = window.innerHeight
  const snaps: [SnapPos, number][] = [
    ['peek', peekH],
    ['mid', Math.round(vh * 0.38)],
    ['full', Math.round(vh * 0.78)],
  ]
  return snaps.reduce(([bs, bv], [cs, cv]) =>
    Math.abs(cv - h) < Math.abs(bv - h) ? [cs, cv] : [bs, bv]
  )[0]
}

export default function SnapSheet({ children, snap, onSnapChange, peekH = 72 }: Props) {
  const [height, setHeight] = useState(() => getH(snap, peekH))
  const [animating, setAnimating] = useState(false)
  const dragging = useRef(false)
  const startY = useRef(0)
  const startH = useRef(0)
  const heightRef = useRef(height)
  heightRef.current = height

  useEffect(() => {
    const target = getH(snap, peekH)
    if (target === heightRef.current) return
    setAnimating(true)
    setHeight(target)
    const t = setTimeout(() => setAnimating(false), 320)
    return () => clearTimeout(t)
  }, [snap, peekH])

  const finishDrag = () => {
    if (!dragging.current) return
    dragging.current = false
    const best = nearestSnap(heightRef.current, peekH)
    setAnimating(true)
    setHeight(getH(best, peekH))
    onSnapChange(best)
    setTimeout(() => setAnimating(false), 320)
  }

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true
    startY.current = e.clientY
    startH.current = heightRef.current
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    const dy = startY.current - e.clientY
    const maxH = window.innerHeight * 0.85
    setHeight(Math.max(peekH, Math.min(Math.round(maxH), startH.current + dy)))
  }

  return (
    <div
      className="shrink-0 bg-card border-t border-border overflow-hidden"
      style={{
        height,
        transition: animating ? 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
      }}
    >
      {/* Drag handle */}
      <div
        className="flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none"
        style={{ height: HANDLE_H }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
      >
        <div className="w-10 h-1 rounded-full bg-border" />
      </div>
      <div
        className="overflow-y-auto"
        style={{ height: Math.max(0, height - HANDLE_H) }}
      >
        {children}
      </div>
    </div>
  )
}
