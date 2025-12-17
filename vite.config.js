import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 2114,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:2113',
        changeOrigin: true,
      }
    }
  },
  preview: {
    port: 2114,
    strictPort: true
  }
})