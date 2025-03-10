import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Change if needed
    proxy: {
      '/api': {
        target: 'http://localhost:5000/',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});