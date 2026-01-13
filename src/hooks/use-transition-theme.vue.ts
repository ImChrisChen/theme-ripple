import type { Ref } from 'vue'
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { ToggleThemeOptions } from "../interfaces";
import {
  updateViewTransition,
  setupSystemThemeListener,
  getSystemTheme
} from './core';

/**
 * Vue 主题切换 Hook (使用 View Transition API 实现涟漪效果)
 * @param isDark 是否为暗黑模式的响应式引用
 * @param setIsDark 设置暗黑模式的函数
 * @param isAutoChangeTheme 是否自动跟随系统主题变化
 */
export function useThemeRipple(
  isDark: Ref<boolean>,
  setIsDark: (isDark: boolean) => void,
  isAutoChangeTheme = true
) {
  const isTransitioning = ref(false)
  const isSupported = ref(!!document.startViewTransition)
  let cleanup: (() => void) | null = null

  onMounted(() => {
    // 再次更新，确保 SSR 兼容
    isSupported.value = !!document.startViewTransition

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
     * 是否支持 View Transition API
     */
    isSupported,

    /**
     * 是否正在进行过渡动画
     */
    isTransitioning,

    /**
     * 切换主题
     * @param options 切换选项，包含点击位置坐标
     */
    toggleTheme: async (options: ToggleThemeOptions) => {
      // 如果不支持，直接切换并返回
      if (!isSupported.value) {
        setIsDark(!isDark.value)
        return
      }

      if (isTransitioning.value) return

      isTransitioning.value = true
      try {
        await nextTick()
        await updateViewTransition(isDark.value, setIsDark, options)
      } finally {
        isTransitioning.value = false
      }
    },
  }
}
