import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

import * as child from 'child_process';

const commitId = child.execSync('git rev-parse --short HEAD').toString();
const branch = child.execSync('git rev-parse --abbrev-ref HEAD').toString();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    wasm(),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: '__tla',
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: (i) => `__tla_${i}`,
    }),
  ],
  define: {
    __COMMIT_ID__: JSON.stringify(commitId.trim()),
    __GIT_BRANCH__: JSON.stringify(branch.trim()),
  },
});
