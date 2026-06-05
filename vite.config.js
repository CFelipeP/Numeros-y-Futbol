import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const PROXY_TARGET = process.env.VITE_PROXY_TARGET || "http://localhost/Numeros-y-Futbol";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: true,
    proxy: {
      "/backend": {
        target: PROXY_TARGET,
        changeOrigin: true,
      },
    },
  },
});