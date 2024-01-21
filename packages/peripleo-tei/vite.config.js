import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => ({
  base: '',
  plugins: [ react() ],
  build: {
    rollupOptions: {
      input: {
        app: 'test/index.html',
      },
      output: {
        manualChunks: {
          'react': ['react'],
          'react-dom': ['react-dom'],
          'maplibre-gl': ['maplibre-gl']
        }
      }
    }
  }
}));