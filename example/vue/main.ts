import { createApp, ref, computed, defineComponent, h } from 'vue'
// import { useThemeRipple } from '../../src/hooks/use-transition-theme.vue'
import { useThemeRipple } from '../../dist/vue'
import type { Direction } from '../../src'

type Animation = 'ease-in' | 'ease-out' | 'linear'

const App = defineComponent({
    setup() {
        // 主题状态
        const isDark = ref(false)

        // 可调参数
        const duration = ref(400)
        const animation = ref<Animation>('ease-in')
        const direction = ref<Direction | undefined>(undefined)

        // 使用 Hook
        const { toggleTheme } = useThemeRipple(
            isDark,
            (dark) => {
                isDark.value = dark
                // 同步 HTML class
                document.documentElement.classList.toggle('dark', dark)
            },
            true
        )

        // 处理点击
        const handleToggle = (event: MouseEvent) => {
            toggleTheme({
                x: event.clientX,
                y: event.clientY,
                duration: duration.value,
                animation: animation.value,
                direction: direction.value,
            })
        }

        const themeText = computed(() => isDark.value ? '🌙 暗黑模式' : '☀️ 亮色模式')

        return () => h('div', { class: 'container', style: { height: '100vh', width: '100%' } }, [
            // h('span', { class: 'framework-badge' }, '💚 Vue'),
            h('h1', '🎨 Vue 主题切换演示'),

            // 控制面板
            h('div', { class: 'control-panel' }, [
                // Duration 控制
                h('div', { class: 'control-group' }, [
                    h('label', `动画时长: ${duration.value}ms`),
                    h('input', {
                        type: 'range',
                        min: 100,
                        max: 1500,
                        step: 50,
                        value: duration.value,
                        onInput: (e: Event) => {
                            duration.value = parseInt((e.target as HTMLInputElement).value)
                        }
                    }),
                    h('div', { class: 'value-display' }, '拖动滑块调整动画时长 (100ms - 1500ms)')
                ]),

                // Animation 控制
                h('div', { class: 'control-group' }, [
                    h('label', '动画曲线'),
                    h('select', {
                        value: animation.value,
                        onChange: (e: Event) => {
                            animation.value = (e.target as HTMLSelectElement).value as Animation
                        }
                    }, [
                        h('option', { value: 'ease-in' }, 'ease-in (渐入)'),
                        h('option', { value: 'ease-out' }, 'ease-out (渐出)'),
                        h('option', { value: 'linear' }, 'linear (线性)')
                    ])
                ]),

                // Direction 控制
                h('div', { class: 'control-group' }, [
                    h('label', '动画方向'),
                    h('select', {
                        value: direction.value || '',
                        onChange: (e: Event) => {
                            const val = (e.target as HTMLSelectElement).value
                            direction.value = val ? val as Direction : undefined
                        }
                    }, [
                        h('option', { value: '' }, '自动 (点击位置)'),
                        h('option', { value: 'top' }, 'Top (上)'),
                        h('option', { value: 'bottom' }, 'Bottom (下)'),
                        h('option', { value: 'left' }, 'Left (左)'),
                        h('option', { value: 'right' }, 'Right (右)'),
                        h('option', { value: 'top-left' }, 'Top Left (左上)'),
                        h('option', { value: 'top-right' }, 'Top Right (右上)'),
                        h('option', { value: 'bottom-left' }, 'Bottom Left (左下)'),
                        h('option', { value: 'bottom-right' }, 'Bottom Right (右下)')
                    ])
                ])
            ]),

            // 切换按钮
            h('button', {
                class: 'theme-toggle-btn',
                onClick: handleToggle
            }, `点击任意位置切换主题 → ${themeText.value}`),

            // 状态卡片
            h('div', { class: 'status-card' }, [
                h('h3', '当前主题状态'),
                h('div', { class: 'theme-indicator' }, [
                    h('span', { class: 'theme-icon' }, isDark.value ? '🌙' : '☀️'),
                    h('span', themeText.value)
                ])
            ]),

            // 演示卡片
            h('div', { class: 'demo-cards' }, [
                h('div', { class: 'demo-card' }, [
                    h('h4', '✨ 视图过渡'),
                    h('p', '使用 View Transition API 实现平滑的主题切换动画')
                ]),
                h('div', { class: 'demo-card' }, [
                    h('h4', '🎯 自定义坐标'),
                    h('p', '动画从点击位置开始扩散，创造自然的视觉效果')
                ]),
                h('div', { class: 'demo-card' }, [
                    h('h4', '⚡ 高性能'),
                    h('p', '基于 CSS 动画，不阻塞主线程')
                ])
            ])
        ])
    }
})

createApp(App).mount('#app')
