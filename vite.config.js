import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  plugins: [react()],
  base: '/',
  server: {
    host: true, // Expose to all network interfaces
    cors: true,
    // Proxy API requests during development to the backend server to avoid CORS
    // and to make BASE_URL = '/api/' work without extra backend config.
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: mode === 'development',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['react-toastify']
        }
      }
    }
  },
  define: {
    // Ensure proper environment variable handling
    'process.env.NODE_ENV': JSON.stringify(mode)
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
}))
