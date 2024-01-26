import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import react from '@vitejs/plugin-react';

import * as packageJson from './package.json';

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
      external: [
        ...Object.keys(packageJson.peerDependencies)
      ],
      output: {
        preserveModules: true,
        assetFileNames: 'peripleo-maplibre.[ext]',
        globals: {
          react: 'React'
        }
      }
    }
  }
}));