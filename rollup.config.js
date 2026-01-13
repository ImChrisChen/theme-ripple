import vue from 'rollup-plugin-vue';
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';

const createConfig = (input, outputName, external) => ({
  input,
  output: [
    {
      file: `dist/${outputName}.mjs`,
      format: 'esm',
      sourcemap: true,
    },
    {
      file: `dist/${outputName}.cjs`,
      format: 'cjs',
      sourcemap: true,
    },
  ],
  plugins: [
    commonjs(),
    vue({
      css: true,
      template: {
        isProduction: true,
      },
    }),
    typescript({
      tsconfig: 'tsconfig.json',
      useTsconfigDeclarationDir: true,
    }),
  ],
  external,
});

export default [
  // 主入口 (包含所有)
  createConfig('src/index.ts', 'index', ['vue', 'react', 'react-dom']),
  // Vue 入口
  createConfig('src/vue.ts', 'vue', ['vue']),
  // React 入口
  createConfig('src/react.ts', 'react', ['react', 'react-dom']),
];
