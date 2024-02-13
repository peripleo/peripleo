import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import react from '@vitejs/plugin-react';

import * as packageJson from './package.json';

export default defineConfig(({ command, mode }) => ({
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
      formats: ['es', 'cjs'],
      fileName: (format) => `peripleo.${format}.js`
    },
    rollupOptions: {
      external: [
        ...Object.keys(packageJson.peerDependencies)
      ],
      output: {
        preserveModules: true,
        assetFileNames: 'peripleo.[ext]',
        globals: {
          react: 'React'
        }
      }
    }
  }
}));