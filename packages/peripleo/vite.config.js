import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => ({
  base: '',
  plugins: [ react() ],
  build: {
    sourcemap: true,
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: (format) => `peripleo.${format}.js`
    }
  }
}));