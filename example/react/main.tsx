import React, { useState, useEffect, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
// import { useThemeRipple } from '../../src/hooks/use-transition-theme.react'
import { useThemeRipple } from '../../dist/react'

import { Direction } from '../../src/interfaces'

type Animation = 'ease-in' | 'ease-out' | 'linear'

function App() {
  // Theme state
  const [isDark, setIsDarkState] = useState(false)
  
  // Configurable parameters
  const [duration, setDuration] = useState(400)
  const [animation, setAnimation] = useState<Animation>('ease-out')
  const [direction, setDirection] = useState<Direction | undefined>(undefined)
  
  // Sync HTML class
  const setIsDark = useCallback((dark: boolean) => {
    setIsDarkState(dark)
    document.documentElement.classList.toggle('dark', dark)
  }, [])

  // Use Hook
  const { toggleTheme } = useThemeRipple(isDark, setIsDark, true)
  
  // Handle click
  const handleToggle = (event: React.MouseEvent) => {
    toggleTheme({
      x: event.clientX,
      y: event.clientY,
      duration,
      animation,
      direction,
    })
  }
  
  const themeText = isDark ? '🌙 Dark Mode' : '☀️ Light Mode'

  const codeExample = `const handleClick = (event) => {
  toggleTheme({
    x: event.clientX,
    y: event.clientY,
    duration: ${duration},
    animation: '${animation}',${direction ? `\n    direction: '${direction}',` : ''}
  })
}`
  
  return (
    <div className="container" style={{minHeight: '100vh', width: '100%', paddingBottom: '50px'}}>
      
      <div className="header-section">
        <h1>@imccc/theme-ripple Live Demo</h1>
        <p className="subtitle">Switch themes as gracefully as water waves</p>
        <div className="badges">
          <span className="framework-badge react">React 18</span>
          <span className="framework-badge react">Vue 3</span>
          <a href="https://github.com/ImChrisChen/theme-ripple" target="_blank" className="github-link">
            View on GitHub ↗
          </a>
        </div>
      </div>
      
      {/* Control Panel */}
      <div className="control-panel">
        <h3>Configuration</h3>
        {/* Duration Control */}
        <div className="control-group">
          <label>Duration: {duration}ms</label>
          <input
            type="range"
            min={100}
            max={1500}
            step={50}
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
          />
        </div>
        
        {/* Animation Control */}
        <div className="control-group">
          <label>Easing</label>
          <select
            value={animation}
            onChange={(e) => setAnimation(e.target.value as Animation)}
          >
            <option value="ease-in">ease-in</option>
            <option value="ease-out">ease-out</option>
            <option value="linear">linear</option>
          </select>
        </div>

        {/* Direction Control */}
        <div className="control-group">
          <label>Direction</label>
          <select
            value={direction || ''}
            onChange={(e) => setDirection(e.target.value ? (e.target.value as Direction) : undefined)}
          >
            <option value="">Auto (Cursor Context)</option>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
            <option value="top-left">Top Left</option>
            <option value="top-right">Top Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="bottom-right">Bottom Right</option>
          </select>
        </div>
      </div>
      
      {/* Toggle Button */}
      <button className="theme-toggle-btn" onClick={handleToggle}>
        Toggle Theme {isDark ? '(Dark)' : '(Light)'}
      </button>
      
      {/* Code Example */}
      <div className="code-section">
        <h3>Usage</h3>
        <pre>
          <code>{codeExample}</code>
        </pre>
      </div>

      {/* Installation */}
      <div className="install-section">
        <h3>Installation</h3>
        <pre>
          <code>npm install @imccc/theme-ripple</code>
        </pre>
      </div>
      
      {/* Features Grid */}
      <div className="demo-cards">
        <div className="demo-card">
          <h4>✨ View Transitions</h4>
          <p>Powered by the native View Transition API for buttery smooth animations.</p>
        </div>
        <div className="demo-card">
          <h4>🎯 Cursor Origin</h4>
          <p>Ripple effect starts exactly from your click position by default.</p>
        </div>
        <div className="demo-card">
          <h4>⚡ Zero Runtime</h4>
          <p>Extremely lightweight, no heavy JS animations blocking the main thread.</p>
        </div>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
