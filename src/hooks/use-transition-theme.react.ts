import { useEffect, useCallback } from "react";
import { flushSync } from 'react-dom';
import { ToggleThemeOptions } from "../interfaces";
import {
  updateViewTransition,
  setupSystemThemeListener,
  getSystemTheme
} from './core';

/**
 * React 主题切换 Hook
 * @param isDark 是否为暗黑模式
 * @param setIsDark 设置暗黑模式的函数
 * @param isAutoChangeTheme 是否自动跟随系统主题变化
 */
export function useTransitionThemeReact(
  isDark: boolean,
  setIsDark: (isDark: boolean) => void,
  isAutoChangeTheme = true
) {
  useEffect(() => {
    if (!isAutoChangeTheme) return

    // 初始化跟随系统
    setIsDark(getSystemTheme())

    // 设置监听器并返回清理函数
    const cleanup = setupSystemThemeListener(setIsDark)

    return cleanup
  }, [isAutoChangeTheme, setIsDark])

  /**
   * 切换主题
   * @param options 切换选项，包含点击位置坐标
   */
  const toggleTheme = useCallback((options: ToggleThemeOptions) => {
    // 使用 requestAnimationFrame 确保在下一帧执行
    requestAnimationFrame(() => {
      // React 状态更新是异步的，必须强制同步更新 DOM
      // 否则 startViewTransition 无法捕获正确的新旧状态
      flushSync(() => {
        updateViewTransition(isDark, setIsDark, options)
      })
    })
  }, [isDark, setIsDark])

  return {
    toggleTheme,
  }
}
