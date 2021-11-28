import * as reactPlugin from 'vite-plugin-react'
import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => {
  return {
    jsx: 'react',
    plugins: [reactPlugin],
    build: {
      rollupOptions: {
        plugins: [
          mode === 'analyze' && visualizer({
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
