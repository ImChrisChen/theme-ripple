import { useState, useCallback } from "react";
import { flushSync } from 'react-dom';
import { ToggleThemeOptions } from "../interfaces";
import { updateViewTransition } from './core';

/**
 * React 主题切换 Hook (使用 View Transition API 实现涟漪效果)
 * @param isDark 是否为暗黑模式
 * @param setIsDark 设置暗黑模式的函数
 */
export function useThemeRipple(
  isDark: boolean,
  setIsDark: (isDark: boolean) => void,
) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isSupported, setIsSupported] = useState(false)

  /**
   * 切换主题
   * @param options 切换选项，包含点击位置坐标
   */
  const toggleTheme = useCallback(async (options: ToggleThemeOptions) => {
    // 如果不支持，直接切换
    if (!document.startViewTransition) {
      setIsDark(!isDark)
      return
    }

    if (isTransitioning) return

    setIsTransitioning(true)
    try {
      // 使用 requestAnimationFrame 确保在下一帧执行
      await new Promise<void>((resolve) => {
        requestAnimationFrame(async () => {
          // React 状态更新是异步的，必须强制同步更新 DOM
          // 否则 startViewTransition 无法捕获正确的新旧状态
          flushSync(() => {
            updateViewTransition(isDark, setIsDark, options)
          })
          resolve()
        })
      })
    } finally {
      // 延迟重置状态，确保动画完成
      setTimeout(() => {
        setIsTransitioning(false)
      }, options.duration ?? 400)
    }
  }, [isDark, setIsDark, isTransitioning])

  return {
    /**
     * 是否支持 View Transition API
     */
    isSupported,

    /**
     * 是否正在进行过渡动画
     */
    isTransitioning,
    toggleTheme,
  }
}
