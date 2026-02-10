import React from 'react'
import StickyBoard from './components/StickyBoard'

export default function App() {
  return (
    <div className="app-root">
      <header className="app-header">Sticky Notes</header>
      <main className="app-main">
        <StickyBoard />
      </main>
    </div>
  )
}
