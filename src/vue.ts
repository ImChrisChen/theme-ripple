// Vue 入口
export { useThemeRipple } from './hooks/use-transition-theme.vue'

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
export type { ToggleThemeOptions, Direction } from './interfaces'
