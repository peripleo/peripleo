import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsConfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';

import * as packageJson from './package.json';

export default defineConfig(() => ({
  base: '',
  plugins: [
    react(),
    tsConfigPaths(),
    dts({ 
      include: ['./src/'],
      entryRoot: './src'
    })
  ],
  server: {
    open: '/test/index.html'
  },
  build: {
    sourcemap: true,
    lib: {
      entry: './src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => `peripleo-maplibre.${format}.js`
    },
    rollupOptions: {
      external: [
        ...Object.keys(packageJson.peerDependencies)
      ],
      output: {
        assetFileNames: 'peripleo-maplibre.[ext]',    
        exports: 'named',    
        globals: {
          react: 'React'
        },
        preserveModules: true,
      }
    }
  }
}));