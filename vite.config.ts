import { defineConfig, type Plugin } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import dts from "vite-plugin-dts"
import { resolve } from "path"

// Emit declarations only for the package build itself (`vite build` into
// dist/). Other builds that load this config — the treeshake test (into a temp
// dir) and Storybook — don't need types, and with `bundleTypes` they fail
// outright: the plugin emits into their outDir but bundles from package.json
// `types` (dist/index.d.ts), which does not exist there.
const packageBuildOnly = (plugins: Plugin | Plugin[]): Plugin[] =>
  [plugins].flat().map((plugin) => ({
    ...plugin,
    apply: (config, { command }) =>
      command === "build" && (config.build?.outDir ?? "dist") === "dist",
  }))

export default defineConfig({
  plugins: [
    react({ jsxRuntime: "automatic" }),
    tailwindcss(),
    ...packageBuildOnly(
      dts({
        include: ["src"],
        // Tests and stories are not part of the public API; keep their .d.ts
        // out of dist/ (and so out of the packed tarball). src/css.d.ts only
        // types this repo's own `import "./styles/index.css"` (and pulls in
        // `vite/client`); with bundleTypes the plugin appends every source .d.ts
        // to the bundle, which would leak both into consumers' types.
        exclude: [
          "node_modules/**",
          "src/test/**",
          "src/**/*.stories.tsx",
          "src/css.d.ts",
        ],
        // ...and without css.d.ts the declaration program can't type the CSS
        // side-effect import (TS2882). `npm run check` still checks it with
        // css.d.ts in scope; only this emit-only program skips it.
        compilerOptions: { noUncheckedSideEffectImports: false },
        // Roll the per-module declarations up into ONE dist/index.d.ts via
        // @microsoft/api-extractor. (vite-plugin-dts 5 renamed `rollupTypes` to
        // `bundleTypes`; the old name is silently ignored.) Only types are
        // bundled — the JS stays per-module (`preserveModules` below).
        // Verified by scripts/verify-dts.mjs.
        bundleTypes: true,
      }),
    ),
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
