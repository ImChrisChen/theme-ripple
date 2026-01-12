// Vue Hook
export { useTransitionChangeTheme } from './hooks/use-transition-theme.vue'

// React Hook  
export { useTransitionThemeReact } from './hooks/use-transition-theme.react'

// 核心函数 (可用于其他框架)
export {
  updateViewTransition,
  setupSystemThemeListener,
  getSystemTheme,
  injectTransitionStyles,
  calculateClipPath,
  executeThemeAnimation,
  DEFAULT_OPTIONS,
  TRANSITION_STYLES,
} from './hooks/core'

// 类型
export type { ToggleThemeOptions } from './interfaces'
