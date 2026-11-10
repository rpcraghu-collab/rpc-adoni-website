import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// One id per build. The page carries it in its code, and the build writes it to /version.json.
// When the two differ, the visitor has an old copy of the site and gets the new one (see src/lib/version.ts).
const BUILD_ID = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14)

function versionFile(): Plugin {
  return {
    name: 'rpc-version-json',
    apply: 'build',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ version: BUILD_ID, builtAt: new Date().toISOString() }, null, 2) + '\n' })
    },
  }
}

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss(), ...(isSsrBuild ? [] : [versionFile()])],
  define: { __APP_VERSION__: JSON.stringify(BUILD_ID), __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()) },
  // Local preview (phone testing on Wi-Fi): always ask the server for fresh pages instead of a cached copy.
  preview: { headers: { 'Cache-Control': 'no-cache' } },
  build: isSsrBuild
    ? {}
    : {
        rollupOptions: {
          output: {
            manualChunks: { react: ['react', 'react-dom', 'react-router-dom'], motion: ['motion'] },
          },
        },
      },
}))
