type Animation = 'ease-in' | 'ease-out' | 'linear'

export type Direction =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

export interface ToggleThemeOptions {
  // Animation center position x
  x?: number
  // Animation center position y
  y?: number
  // Animation duration ms
  duration?: number
  // Custom style class
  styleClass?: string
  // Animation easing
  animation?: Animation
  // Animation direction
  direction?: Direction
  // Border radius for clip path
  borderRadius?: number
}

