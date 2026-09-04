import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Fora do Docker o backend está em localhost:5070; dentro do compose ele é o
// serviço "backend". Por isso o alvo do proxy é configurável.
const proxyTarget = process.env.VITE_PROXY_TARGET ?? 'http://localhost:5070'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // 0.0.0.0 para o dev server ser alcançável de fora do contêiner.
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: proxyTarget,
        changeOrigin: true,
      },
      // ws: true é obrigatório — o SignalR sobe para WebSocket após o handshake.
      '/hubs': {
        target: proxyTarget,
        changeOrigin: true,
        ws: true,
      },
    },
  },
})
