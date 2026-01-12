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
  x?: number
  y?: number
  duration?: number
  styleClass?: string
  animation?: Animation
  direction?: Direction
  borderRadius?: number
}

