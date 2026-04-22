import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './', // ETTŐL FOGJA MEGTALÁLNI A FÁJLOKAT!
  plugins: [react()],
})