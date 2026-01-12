import { ToggleThemeOptions, Direction } from "../interfaces";

// 默认配置
export const DEFAULT_OPTIONS: Omit<ToggleThemeOptions, 'x' | 'y'> = {
  duration: 400,
  styleClass: 'transition-style',
  animation: 'ease-in',
}

// 默认的过渡样式
export const TRANSITION_STYLES = `
  /* 默认主题样式 */
  html.dark {
    background-color: #1b1b1b;
  }
  /* Alternative custom animation style */
  ::view-transition-old(root),
  ::view-transition-new(root) {
    height: auto;
    width: 100vw;
    animation: none;
    mix-blend-mode: normal;
  }
  html.dark::view-transition-old(root) {
    z-index: 1;
  }
  html.dark::view-transition-new(root) {
    z-index: 2147483646;
  }
  html::view-transition-old(root) {
    z-index: 2147483646;
  }
  html::view-transition-new(root) {
    z-index: 1;
  }
}
`

/**
 * 注入过渡样式到 head
 */
export function injectTransitionStyles(styleClass: string): void {
  const hasStyle = document.querySelector(`.${styleClass}`)
  if (!hasStyle) {
    const style = document.createElement('style')
    style.textContent = TRANSITION_STYLES
    style.classList.add(styleClass)
    document.head.appendChild(style)
  }
}

/**
 * 根据方向获取坐标
 */
function getCoordinatesFromDirection(direction: Direction): { x: number, y: number } {
  const width = window.innerWidth
  const height = window.innerHeight

  switch (direction) {
    case 'top': return { x: width / 2, y: 0 }
    case 'bottom': return { x: width / 2, y: height }
    case 'left': return { x: 0, y: height / 2 }
    case 'right': return { x: width, y: height / 2 }
    case 'top-left': return { x: 0, y: 0 }
    case 'top-right': return { x: width, y: 0 }
    case 'bottom-left': return { x: 0, y: height }
    case 'bottom-right': return { x: width, y: height }
    default: return { x: width / 2, y: height / 2 }
  }
}

/**
 * 计算裁剪路径动画参数
 * 纯粹根据坐标和 borderRadius 计算，方向逻辑在 updateViewTransition 中已经转换为坐标
 */
export function calculateClipPath(x: number, y: number, borderRadius?: number): string[] {
  // 如果提供了 borderRadius，使用 inset (矩形/圆角矩形扩散)
  if (borderRadius !== undefined) {
    const width = window.innerWidth
    const height = window.innerHeight

    // Start: 一个在坐标位置的小矩形
    // End: 全屏覆盖 = inset(0 0 0 0)
    return [
      `inset(${y}px ${Math.max(0, width - x)}px ${Math.max(0, height - y)}px ${x}px round ${borderRadius}px)`,
      `inset(0px 0px 0px 0px round 0px)`
    ]
  }

  // 默认圆形扩散
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  )
  return [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${endRadius}px at ${x}px ${y}px)`,
  ]
}

/**
 * 执行主题切换动画
 */
export function executeThemeAnimation(
  isDark: boolean,
  options: Required<ToggleThemeOptions>,
  clipPath: string[]
): void {
  document.documentElement.animate(
    {
      clipPath: isDark ? [...clipPath].reverse() : clipPath,
    },
    {
      duration: options.duration,
      easing: options.animation,
      pseudoElement: isDark
        ? '::view-transition-old(root)'
        : '::view-transition-new(root)',
      fill: 'forwards',   // fix animation ZoomIn blink issue
    },
  )
}

/**
 * 核心视图更新逻辑
 * @param isDark 当前是否为暗黑模式
 * @param setIsDark 设置暗黑模式的函数
 * @param options 切换选项
 */
export function updateViewTransition(
  isDark: boolean,
  setIsDark: (isDark: boolean) => void,
  options: ToggleThemeOptions
): void {
  if (!document) {
    console.error('document is not defined')
    return
  }

  const opts = { ...DEFAULT_OPTIONS, ...options } as Required<ToggleThemeOptions>

  // 在不支持的浏览器里不做动画
  if (!document.startViewTransition) {
    console.warn('document.startViewTransition is not defined')
    setIsDark(!isDark)
    return
  }

  // 注入样式
  injectTransitionStyles(opts.styleClass)

  // 开始一次视图过渡
  const transition = document.startViewTransition(() => setIsDark(!isDark))

  transition.ready.then(() => {
    let { x, y, direction } = options

    switch (direction) {
      case 'top':
        // x = 0;
        // y = window.innerWidth / 2;
        x = window.innerHeight / 2;
        y = 0;
        break
      case 'bottom':
        x = window.innerHeight / 2;
        y = window.innerHeight;
        break
      case 'left':
        x = 0;
        y = window.innerHeight / 2;
        break
      case 'right':
        x = window.innerWidth;
        y = window.innerHeight / 2;
        break
      case 'top-left':
        x = 0;
        y = 0;
        break
      case 'top-right':
        x = window.innerHeight;
        y = 0;
        break
      case 'bottom-left':
        x = 0;
        y = window.innerHeight;
        break
      case 'bottom-right':
        x = window.innerHeight;
        y = window.innerHeight;
        break
      default:
        break
    }

    // 如果仍然没有坐标，默认为中心 (或任何兜底)
    // 之前是必传 x,y。现在变成可选，需要兜底
    if (x === undefined) x = window.innerWidth / 2
    if (y === undefined) y = window.innerHeight / 2

    const clipPath = calculateClipPath(x, y, options.borderRadius)

    // 开始动画
    executeThemeAnimation(isDark, opts, clipPath)
  })
}

/**
 * 设置系统主题变化监听器
 * @param setIsDark 设置暗黑模式的函数
 * @returns 清理函数
 */
export function setupSystemThemeListener(
  setIsDark: (isDark: boolean) => void
): () => void {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  const handler = (e: MediaQueryListEvent) => {
    setIsDark(e.matches)
  }

  mediaQuery.addEventListener('change', handler)

  // 返回清理函数
  return () => {
    mediaQuery.removeEventListener('change', handler)
  }
}

/**
 * 获取系统当前主题
 */
export function getSystemTheme(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}
