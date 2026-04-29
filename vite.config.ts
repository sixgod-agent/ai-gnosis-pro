import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// 如果用 username.github.io 仓库，base 设为 '/'
// 如果用项目子路径如 username.github.io/ai-gnosis-pro，改为 '/ai-gnosis-pro/'
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
})
