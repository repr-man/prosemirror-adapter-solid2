import { defineConfig } from 'vite'
import solid from '@solidjs/vite-plugin'

export default defineConfig({
  publicDir: false,
  build: {
    emptyOutDir: false,
    lib: {
      entry: './src/index.ts',
      name: 'prosemirror-adapter_solid',
      formats: ['es'],
      fileName: 'index',
    },
    minify: false,
    rollupOptions: {
      external: [
        '@prosemirror-adapter/core',
        '@solidjs/web',
        'solid-js',
        'prosemirror-model',
        'prosemirror-state',
        'prosemirror-view',
      ],
    },
  },
  plugins: [solid()],
})
