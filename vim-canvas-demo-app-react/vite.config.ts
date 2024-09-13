import { defineConfig } from "vite";
import path from "path"
import react from "@vitejs/plugin-react";
import { apiPlugin } from "./vite.api"


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), apiPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
  },
});
