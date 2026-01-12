import React, { useState, useEffect, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import { useTransitionThemeReact } from '../../src/hooks/use-transition-theme.react'

import { Direction } from '../../src/interfaces'

type Animation = 'ease-in' | 'ease-out' | 'linear'

function App() {
  // 主题状态
  const [isDark, setIsDarkState] = useState(false)
  
  // 可调参数
  const [duration, setDuration] = useState(400)
  const [animation, setAnimation] = useState<Animation>('ease-in')
  const [direction, setDirection] = useState<Direction | undefined>(undefined)
  const [borderRadius, setBorderRadius] = useState<number | undefined>(undefined)
  
  // 同步 HTML class
  const setIsDark = useCallback((dark: boolean) => {
    setIsDarkState(dark)
    document.documentElement.classList.toggle('dark', dark)
  }, [])

  // 使用 Hook
  const { toggleTheme } = useTransitionThemeReact(isDark, setIsDark, true)
  
  // 处理点击
  const handleToggle = (event: React.MouseEvent) => {
    toggleTheme({
      x: event.clientX,
      y: event.clientY,
      duration,
      animation,
      direction,
      // borderRadius,
    })
  }
  
  const themeText = isDark ? '🌙 暗黑模式' : '☀️ 亮色模式'
  
  return (
    <div className="container" style={{height: '100vh', width: '100%'}}>
      <span className="framework-badge">⚛️ React</span>
      <h1>🎨 React 主题切换演示</h1>
      
      {/* 控制面板 */}
      {/* 控制面板 */}
      <div className="control-panel">
        {/* Duration 控制 */}
        <div className="control-group">
          <label>动画时长: {duration}ms</label>
          <input
            type="range"
            min={100}
            max={1500}
            step={50}
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
          />
          <div className="value-display">拖动滑块调整动画时长 (100ms - 1500ms)</div>
        </div>
        
        {/* Animation 控制 */}
        <div className="control-group">
          <label>动画曲线</label>
          <select
            value={animation}
            onChange={(e) => setAnimation(e.target.value as Animation)}
          >
            <option value="ease-in">ease-in (渐入)</option>
            <option value="ease-out">ease-out (渐出)</option>
            <option value="linear">linear (线性)</option>
          </select>
        </div>

        {/* Direction 控制 */}
        <div className="control-group">
          <label>动画方向</label>
          <select
            value={direction || ''}
            onChange={(e) => setDirection(e.target.value ? (e.target.value as Direction) : undefined)}
          >
            <option value="">自动 (点击位置)</option>
            <option value="top">Top (上)</option>
            <option value="bottom">Bottom (下)</option>
            <option value="left">Left (左)</option>
            <option value="right">Right (右)</option>
            <option value="top-left">Top Left (左上)</option>
            <option value="top-right">Top Right (右上)</option>
            <option value="bottom-left">Bottom Left (左下)</option>
            <option value="bottom-right">Bottom Right (右下)</option>
          </select>
        </div>

        {/* BorderRadius 控制 */}
        <div className="control-group">
          <label>圆角大小: {borderRadius ?? '默认 (圆形)'}</label>
          <input
            type="range"
            min={0}
            max={500}
            step={10}
            value={borderRadius ?? 0}
            // disabled={isCorner}
            onChange={(e) => setBorderRadius(parseInt(e.target.value))}
          />
          <button style={{marginLeft: 8}} onClick={(e) => { e.preventDefault(); setBorderRadius(undefined); }}>重置</button>
        </div>
      </div>
      
      {/* 切换按钮 */}
      <button className="theme-toggle-btn" onClick={handleToggle}>
        点击任意位置切换主题 → {themeText}
      </button>
      
      {/* 状态卡片 */}
      <div className="status-card">
        <h3>当前主题状态</h3>
        <div className="theme-indicator">
          <span className="theme-icon">{isDark ? '🌙' : '☀️'}</span>
          <span>{themeText}</span>
        </div>
      </div>
      
      {/* 演示卡片 */}
      <div className="demo-cards">
        <div className="demo-card">
          <h4>✨ 视图过渡</h4>
          <p>使用 View Transition API 实现平滑的主题切换动画</p>
        </div>
        <div className="demo-card">
          <h4>🎯 自定义坐标</h4>
          <p>动画从点击位置开始扩散，创造自然的视觉效果</p>
        </div>
        <div className="demo-card">
          <h4>⚡ 高性能</h4>
          <p>基于 CSS 动画，不阻塞主线程</p>
        </div>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
