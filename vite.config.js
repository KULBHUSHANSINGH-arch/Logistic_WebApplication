// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 3031,  // Replace 3001 with your desired custom port number
    hmr: {
      port: 3031,  // Ensures HMR uses the same port
    },
  },
  plugins: [react()],
});

