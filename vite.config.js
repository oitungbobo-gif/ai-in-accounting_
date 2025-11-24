import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,
    host: true,
    allowedHosts: [
      'zapvo-2605-a601-a9da-dc00-a007-ec72-d965-2fda.a.free.pinggy.link',
      '.pinggy.link', // Allow all Pinggy subdomains
      'localhost',
    ],
  },
})
