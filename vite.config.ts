import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import { visualizer } from 'rollup-plugin-visualizer';

import * as child from 'child_process';

const commitId = child.execSync('git rev-parse --short HEAD').toString();
const branch = child.execSync('git rev-parse --abbrev-ref HEAD').toString();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: '/regend-webui/',
    plugins: [
      react(),
      wasm(),
      VitePWA({
        includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
        registerType: 'prompt',
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
          maximumFileSizeToCacheInBytes: 12 * 1024 * 1024,
        },
        strategies: 'generateSW',
        manifest: {
          background_color: '#94c0fa',
          categories: ['graphics'],
          display: 'fullscreen',
          icons: [
            {
              src: '/regend-webui/192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/regend-webui/256.png',
              sizes: '256x256',
              type: 'image/png',
            },
            {
              src: '/regend-webui/384.png',
              sizes: '384x384',
              type: 'image/png',
            },
            {
              src: '/regend-webui/512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: '/regend-webui/512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
          ],
          name: 'Regend WebUI',
          orientation: 'any',
          scope: '/',
          short_name: 'Regend',
          start_url: '/regend-webui/',
          theme_color: '#3884eb',
        },
      }),
      topLevelAwait({
        // The export name of top-level await promise for each chunk module
        promiseExportName: '__tla',
        // The function to generate import names of top-level await promise in each chunk module
        promiseImportName: (i) => `__tla_${i}`,
      }),
      mode === 'analyze' &&
        visualizer({
          open: true,
          filename: 'dist/stats.html',
          gzipSize: true,
          brotliSize: true,
          template: 'treemap',
        }),
    ],
    define: {
      __COMMIT_ID__: JSON.stringify(commitId.trim()),
      __GIT_BRANCH__: JSON.stringify(branch.trim()),
    },
  };
});
