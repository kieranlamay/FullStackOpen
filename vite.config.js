import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Prevent Vite's file watcher from reacting to changes in the backend folder.
    // Backend lives at ../phonebook-backend relative to this frontend project root.
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true, 
      },
    },
    watch: {
      ignored: [
        path.resolve(__dirname, "..", "phonebook-backend") + "/**",
        "**/db.json",
      ],
    },
  },
});
