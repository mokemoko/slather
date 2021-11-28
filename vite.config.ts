import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => {
  return {
    jsx: 'react',
    plugins: [react()],
    server: {
      open: true,
    },
    build: {
      rollupOptions: {
        plugins: [
          visualizer({
            open: true,
            filename: 'docs/stats.html',
            gzipSize: true,
            brotliSize: true,
          }),
        ],
      },
    },
  }
})
