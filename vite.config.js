import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: true,
    proxy: {
<<<<<<< HEAD
      "/api": {
        target: "http://localhost:8000",
=======
      "/backend": {
        target: "http://Numeros-y-Futbol.test",
>>>>>>> 69a266dcc41c27273305edd5b4db6564ded373c1
        changeOrigin: true,
      },
    },
  },
});
