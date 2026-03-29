import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const proxyTarget = process.env.VITE_PROXY_API_TARGET || 'http://localhost:5000'

export default defineConfig({
  plugins: [react()],

  
  base: '/',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 5174, // Only used for local dev
    proxy: {
      '/api': {
        target: proxyTarget,
        changeOrigin: true,
      },
    },
    historyApiFallback: true,
  },

  build: {
    cssMinify: true,
    cssCodeSplit: true,
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // Ensure proper asset paths
        assetFileNames: 'assets/[name].[ext]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    },
    copyPublicDir: true,
    // Ensure index.html and 404.html are handled properly
    emptyOutDir: true,
    // Ensure proper sourcemaps for debugging
    sourcemap: false
  },
})
