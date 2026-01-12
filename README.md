# use-transition-change-theme

[![npm version](https://img.shields.io/npm/v/@imccc/use-transition-change-theme.svg)](https://www.npmjs.com/package/@imccc/use-transition-change-theme)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Smooth theme transitions for **Vue** and **React** using the [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API).

![Demo](example/img_1.png)

## ✨ Features

- 🎨 **Smooth Animations** - Beautiful circular/directional transitions powered by View Transition API
- ⚛️ **Vue & React** - First-class support for both frameworks
- 🧭 **8 Directions** - Animate from any edge or corner
- 🎛️ **Customizable** - Control duration, easing, and animation origin
- 🌐 **System Theme** - Auto-detect and sync with OS theme preference
- 📦 **Lightweight** - No dependencies, tree-shakeable

## 📦 Installation

```bash
# npm
npm install @imccc/use-transition-change-theme

# pnpm
pnpm add @imccc/use-transition-change-theme

# yarn
yarn add @imccc/use-transition-change-theme
```

## 🚀 Quick Start

### Vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useTransitionChangeTheme } from '@imccc/use-transition-change-theme'

const isDark = ref(false)

const { toggleTheme } = useTransitionChangeTheme(
  isDark,
  (dark) => {
    isDark.value = dark
    document.documentElement.classList.toggle('dark', dark)
  },
  true // sync with system theme
)

const handleClick = (event: MouseEvent) => {
  toggleTheme({
    x: event.clientX,
    y: event.clientY,
    duration: 400,
    animation: 'ease-out'
  })
}
</script>

<template>
  <button @click="handleClick">Toggle Theme</button>
</template>
```

### React

```tsx
import { useState, useCallback } from 'react'
import { useTransitionThemeReact } from '@imccc/use-transition-change-theme'

function App() {
  const [isDark, setIsDarkState] = useState(false)

  const setIsDark = useCallback((dark: boolean) => {
    setIsDarkState(dark)
    document.documentElement.classList.toggle('dark', dark)
  }, [])

  const { toggleTheme } = useTransitionThemeReact(isDark, setIsDark, true)

  const handleClick = (event: React.MouseEvent) => {
    toggleTheme({
      x: event.clientX,
      y: event.clientY,
      duration: 400,
      animation: 'ease-out'
    })
  }

  return <button onClick={handleClick}>Toggle Theme</button>
}
```

## 📖 API Reference

### `toggleTheme(options)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `x` | `number` | - | X coordinate of animation origin |
| `y` | `number` | - | Y coordinate of animation origin |
| `duration` | `number` | `400` | Animation duration in ms |
| `animation` | `string` | `'ease-in'` | CSS easing function |
| `direction` | `Direction` | - | Preset direction (overrides x/y) |
| `borderRadius` | `number` | - | Use rounded rectangle instead of circle |

### Direction Options

| Value | Description |
|-------|-------------|
| `'top'` | Expand from top center |
| `'bottom'` | Expand from bottom center |
| `'left'` | Expand from left center |
| `'right'` | Expand from right center |
| `'top-left'` | Expand from top-left corner |
| `'top-right'` | Expand from top-right corner |
| `'bottom-left'` | Expand from bottom-left corner |
| `'bottom-right'` | Expand from bottom-right corner |

## 🌐 Browser Support

This library uses the [View Transition API](https://caniuse.com/view-transitions). For unsupported browsers, the theme will change immediately without animation.

| Browser | Support |
|---------|---------|
| Chrome | ✅ 111+ |
| Edge | ✅ 111+ |
| Safari | ✅ 18+ |
| Firefox | ❌ Not yet |

## 📄 License

[MIT](LICENSE) © [ImChrisChen](https://github.com/ImChrisChen)
