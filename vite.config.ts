import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => {
  return {
    base: './',
    jsx: 'react',
    plugins: [react()],
    server: {
      open: true,
    },
    build: {
      rollupOptions: {
        output: {
          dir: 'docs'
        },
        plugins: [
          visualizer({
            open: true,
            gzipSize: true,
            brotliSize: true,
          }),
        ],
      },
    },
  }
})
