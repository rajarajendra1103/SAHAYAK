import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2015', // Support older browsers
    cssTarget: 'chrome61', // Support older CSS features
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['lucide-react']
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'react-router-dom']
  },
  server: {
    host: true, // Allow external connections
    port: 5173,
    strictPort: false
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: false
  },
  esbuild: {
    target: 'es2015' // Ensure compatibility with older browsers
  }
});