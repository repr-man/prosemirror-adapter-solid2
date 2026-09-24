import solid from '@solidjs/vite-plugin'
import { defineConfig } from 'vite'

export default defineConfig({
  root: 'playground',
  publicDir: false,
  plugins: [solid()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
