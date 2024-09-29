import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all addresses, equivalent to `--host`
    port: 5173, // Specify the port if needed (default for Vite is 5173)
    strictPort: true, // Fail if the port is already in use
    hmr: {
      clientPort: 5173, // Ensures the HMR connection uses the correct port
    },
  },
})
