import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// IMPORTANT: change 'world-cup-2026-simulator' to match your GitHub repo name.
// If your repo is https://github.com/tuusuario/world-cup-2026-simulator
// then base should be '/world-cup-2026-simulator/'
export default defineConfig({
  plugins: [react()],
  base: '/world-cup-2026/',
});
