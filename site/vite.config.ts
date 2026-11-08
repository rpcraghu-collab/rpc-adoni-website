import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
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
