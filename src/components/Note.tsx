import React, { useEffect, useRef, useState } from 'react'
import type { NoteData } from './StickyBoard'

export default function Note({
  data,
  onRemove,
  onUpdate,
  onFocus,
}: {
  data: NoteData
  onRemove: () => void
  onUpdate?: (patch: Partial<NoteData>) => void
  onFocus?: () => void
}) {
  const [pos, setPos] = useState({ x: data.x, y: data.y })
  const [size, setSize] = useState({ w: data.width, h: data.height })
  const [text, setText] = useState(data.text ?? '')
  const dragging = useRef(false)
  const resizing = useRef(false)
  const start = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // keep internal state in sync when data changes externally
    setPos({ x: data.x, y: data.y })
    setSize({ w: data.width, h: data.height })
    setText(data.text ?? '')
  }, [data.x, data.y, data.width, data.height, data.text])

  return (
    <div
      className="note"
      style={{ position: 'absolute', left: pos.x, top: pos.y, width: size.w, height: size.h, background: '#fffb7d', padding: 8, boxShadow: '0 2px 6px rgba(0,0,0,0.15)', borderRadius: 6, userSelect: 'none', zIndex: data.z ?? 0 }}
      onMouseDown={(e) => {
        onFocus && onFocus()
        dragging.current = true
        start.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
        const onMove = (ev: MouseEvent) => {
          if (!dragging.current) return
          const nx = ev.clientX - start.current.x
          const ny = ev.clientY - start.current.y
          setPos({ x: nx, y: ny })
        }
        const onUp = () => {
          dragging.current = false
          onUpdate && onUpdate({ x: pos.x, y: pos.y })
          window.removeEventListener('mousemove', onMove)
          window.removeEventListener('mouseup', onUp)
        }
        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseup', onUp)
      }}
    >
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value)
        }}
        onBlur={() => onUpdate && onUpdate({ text })}
        style={{ width: '100%', height: '60%', resize: 'none', border: 'none', background: 'transparent', outline: 'none' }}
      />
      <div
        style={{ position: 'absolute', right: 6, bottom: 6, width: 12, height: 12, cursor: 'nwse-resize', background: '#333', borderRadius: 2 }}
        onMouseDown={(e) => {
          e.stopPropagation()
          resizing.current = true
          start.current = { x: e.clientX, y: e.clientY }
          const w0 = size.w
          const h0 = size.h
          const onMove = (ev: MouseEvent) => {
            if (!resizing.current) return
            const nw = Math.max(80, w0 + ev.clientX - start.current.x)
            const nh = Math.max(60, h0 + ev.clientY - start.current.y)
            setSize({ w: nw, h: nh })
          }
          const onUp = () => {
            resizing.current = false
            onUpdate && onUpdate({ width: size.w, height: size.h })
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mouseup', onUp)
          }
          window.addEventListener('mousemove', onMove)
          window.addEventListener('mouseup', onUp)
        }}
      />

      <button
        style={{ position: 'absolute', left: 6, bottom: 6 }}
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
      >
        Remove
      </button>
    </div>
  )
}
