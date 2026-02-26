import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "path"

export default defineConfig({
  root: __dirname,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@rarebit-one/luminality-ui": path.resolve(__dirname, "../src/index.ts"),
    },
  },
  server: {
    port: 5174,
  },
})
