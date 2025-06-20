// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // "/api" 로 들어오는 요청은 모두 http://localhost:8080 으로 프록시
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,         // 호스트 헤더를 타겟의 것으로 변경
        secure: false,              // HTTPS 셀프사인 인증서 허용 여부
        rewrite: (path) => path,
      },
      '/api/login': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    }
  }
});
