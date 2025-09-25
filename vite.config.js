import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/workoutPlan/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})