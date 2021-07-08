import vue from '@vitejs/plugin-vue'
import path from 'path'
import {defineConfig} from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: '../../dist/public',
  },
  plugins: [vue()],
  publicDir: path.resolve('./public'),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/client'),
    },
  },
  root: 'src/client',
  server: {
    port: 3001,
    proxy: {
      '/api': 'http://localhost:3000/api',
    },
  },
})
