import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // html2canvas is imported on demand (bug-report screenshots); pre-bundle it so dev does not reload on first use
  optimizeDeps: { include: ['html2canvas'] },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
