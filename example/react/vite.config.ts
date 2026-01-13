import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Ensure relative paths for assets
  server: {
    port: 3002
  },
  build: {
    outDir: '../../docs', // Output to docs folder in project root
    emptyOutDir: true,
  }
})
