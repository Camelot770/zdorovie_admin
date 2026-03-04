import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://zdorov-e-sem-i-camelot770.amvera.io",
        changeOrigin: true,
      },
    },
  },
});
