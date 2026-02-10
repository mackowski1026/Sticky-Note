import React, { useEffect, useState } from 'react'
import Note from './Note'

export type NoteData = {
  id: string
  x: number
  y: number
  width: number
  height: number
  text?: string
  color?: string
  z?: number
}

const STORAGE_KEY = 'sticky_notes_v1'

export default function StickyBoard() {
  const [notes, setNotes] = useState<NoteData[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
    } catch {}
  }, [notes])

  function createNoteAt(x: number, y: number) {
    const id = String(Date.now())
    const maxZ = notes.reduce((m, n) => Math.max(m, n.z ?? 0), 0)
    const note: NoteData = { id, x, y, width: 200, height: 160, text: 'New note', z: maxZ + 1 }
    setNotes((s) => [...s, note])
  }

  function removeNote(id: string) {
    setNotes((s) => s.filter((n) => n.id !== id))
  }

  function updateNote(id: string, patch: Partial<NoteData>) {
    setNotes((s) => s.map((n) => (n.id === id ? { ...n, ...patch } : n)))
  }

  function bringToFront(id: string) {
    setNotes((s) => {
      const maxZ = s.reduce((m, n) => Math.max(m, n.z ?? 0), 0)
      return s.map((n) => (n.id === id ? { ...n, z: maxZ + 1 } : n))
    })
  }

  return (
    <div
      className="sticky-board"
      style={{ position: 'relative', width: '100%', height: '100%' }}
      onDoubleClick={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        createNoteAt(e.clientX - rect.left, e.clientY - rect.top)
      }}
    >
      {notes.map((n) => (
        <Note
          key={n.id}
          data={n}
          onRemove={() => removeNote(n.id)}
          onUpdate={(patch) => updateNote(n.id, patch)}
          onFocus={() => bringToFront(n.id)}
        />
      ))}
      <div style={{ position: 'absolute', right: 12, bottom: 12, padding: 8, background: '#fff', borderRadius: 6, boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}>
        Double-click to create a note
      </div>
    </div>
  )
}
