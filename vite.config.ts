import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative asset paths let this app work from a GitHub Pages project URL.
  base: './',
  plugins: [react()],
})
