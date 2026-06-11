import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://emma-zanoli-accenture.github.io/ppc-regulatory-monitoring/
  base: '/ppc-regulatory-monitoring/',
  plugins: [react()],
})
