import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The frontend runs on :5173 in dev and proxies API calls to the Express
// backend on :4000. In production the backend serves the built files itself,
// so no proxy is needed there.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
  build: {
    outDir: 'dist',
  },
})
