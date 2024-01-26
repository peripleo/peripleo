import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import react from '@vitejs/plugin-react';

export default defineConfig(() => ({
  base: '',
  plugins: [
    react(),
    dts({ 
      insertTypesEntry: true,
      include: ['./src/'],
      entryRoot: './src'
    })
  ],
  build: {
    sourcemap: true,
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: (format) => `peripleo-maplibre.${format}.js`
    },
    rollupOptions: {
      output: {
        assetFileNames: 'peripleo-maplibre.[ext]'
      }
    }
  }
}));