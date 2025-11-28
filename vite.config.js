import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // 自動更新 App 版本
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', 'sounds/*.mp3'], // 重要：讓音效也能離線使用
      manifest: {
        name: 'FocusPet: 專注寵物',
        short_name: 'FocusPet',
        description: 'Gamified Focus Timer with Pixel Pets',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone', // 讓手機打開時沒有網址列 (全螢幕)
        orientation: 'portrait', // 強制直屏
        start_url: '/',
        icons: [
          {
            src: 'icons/icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})