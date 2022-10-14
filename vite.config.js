import { defineConfig } from 'vite';
import { splitVendorChunkPlugin } from 'vite';

import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [ react(), splitVendorChunkPlugin() ],
  resolve: {
    alias: {
      'mapbox-gl': 'maplibre-gl'
    }
  }
})
