import type { Ref } from 'vue'
import { nextTick, onMounted, onUnmounted } from 'vue'
import { ToggleThemeOptions } from "../interfaces";
import {
  updateViewTransition,
  setupSystemThemeListener,
  getSystemTheme
} from './core';

/**
 * Vue 主题切换 Hook
 * @param isDark 是否为暗黑模式的响应式引用
 * @param setIsDark 设置暗黑模式的函数
 * @param isAutoChangeTheme 是否自动跟随系统主题变化
 */
export function useTransitionChangeTheme(
  isDark: Ref<boolean>,
  setIsDark: (isDark: boolean) => void,
  isAutoChangeTheme = true
) {
  let cleanup: (() => void) | null = null

  onMounted(() => {
    if (!isAutoChangeTheme) return

    // 设置监听器并保存清理函数
    cleanup = setupSystemThemeListener(setIsDark)

    // 初始化跟随系统
    setIsDark(getSystemTheme())
  })

  onUnmounted(() => {
    // 清理监听器
    cleanup?.()
  })

  return {
    /**
     * 切换主题
     * @param event 切换选项，包含点击位置坐标
     */
    toggleTheme: (event: ToggleThemeOptions) => {
      nextTick().then(() => {
        updateViewTransition(isDark.value, setIsDark, event)
      })
    },
  }
}
