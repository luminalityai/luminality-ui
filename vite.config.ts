import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import dts from "vite-plugin-dts"
import { resolve } from "path"

export default defineConfig({
  plugins: [
    react({ jsxRuntime: "automatic" }),
    tailwindcss(),
    dts({
      include: ["src"],
      // Tests and stories are not part of the public API; keep their .d.ts
      // out of dist/ (and so out of the packed tarball).
      exclude: ["node_modules/**", "src/test/**", "src/**/*.stories.tsx"],
      outDir: "dist",
      rollupTypes: true,
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        /^@radix-ui\//,
        "clsx",
        "tailwind-merge",
        // Declared dependencies — resolved by the consumer, like the rest.
        // Must be external under `preserveModules`: a bundled copy would be
        // emitted under dist/node_modules/, which npm never packs.
        /^date-fns(-tz)?(\/|$)/,
      ],
      output: {
        assetFileNames: "styles/[name][extname]",
        // One output module per source module, NOT one dist/index.js. With a
        // single file, a consumer importing any one export gets the whole
        // library (every component's top-level `forwardRef` call counts as a
        // side effect). Per-module output plus package.json `sideEffects` lets
        // the consumer's bundler skip every module it does not use.
        // src/test/bundle/platform-badge.treeshake.test.ts guards this.
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
      },
    },
    cssCodeSplit: false,
  },
})
