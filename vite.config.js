import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// 前端跑在 5173，后端 Spring Boot 跑在 8080
// /api 开头的请求会被代理到后端，所以前端里直接写 '/api/items'
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    open: false,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
