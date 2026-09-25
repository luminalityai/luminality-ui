// @vitest-environment node
import { build, type Rollup } from "vite"
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { afterAll, beforeAll, describe, it, expect } from "vitest"

// Bundle check: a consumer that imports only `PlatformBadge` from the package
// root must not get the dropdown menu (or tailwind-merge) in its bundle.
//
// `PlatformSwitcher` with `interactive={false}` pulled in the menu — and, as
// the package was then built as ONE `dist/index.js`, the whole library with
// it: luminality-web measured +53.6 kB gzip on its initial load for a tile
// that renders no menu at all (luminality-web#1188). Tree-shaking across the
// package needs BOTH a per-module `dist/` (`preserveModules` in vite.config.ts)
// AND the `sideEffects` field in package.json, so this test exercises the real
// thing end to end:
//
//  1. build the library with the repo's own vite.config.ts into a temp dir,
//     next to a package.json carrying the real `sideEffects` field;
//  2. bundle a consumer entry against that build, the way an app would.
//
// The `PlatformSwitcher` case is the control: it proves the bundler really
// does keep the menu when it is reachable, so a pass here is not vacuous.

const root = resolve(fileURLToPath(new URL(".", import.meta.url)), "../../..")
const EXTERNAL =
  /^(react|react-dom|clsx|tailwind-merge|date-fns|date-fns-tz|@radix-ui\/[^/]+)(\/|$)/

let libDir: string

function chunksOf(result: Awaited<ReturnType<typeof build>>): string {
  const outputs = (
    Array.isArray(result) ? result : [result]
  ) as Rollup.RollupOutput[]
  return outputs
    .flatMap((o) => o.output)
    .map((chunk) => (chunk.type === "chunk" ? chunk.code : ""))
    .join("\n")
}

beforeAll(async () => {
  libDir = await mkdtemp(join(tmpdir(), "ui-treeshake-"))
  await build({
    configFile: resolve(root, "vite.config.ts"),
    logLevel: "silent",
    root,
    build: { outDir: libDir, emptyOutDir: true },
  })
  const pkg = JSON.parse(await readFile(join(root, "package.json"), "utf8"))
  await writeFile(
    join(libDir, "package.json"),
    JSON.stringify({
      name: "ui-treeshake",
      type: "module",
      sideEffects: pkg.sideEffects,
    }),
  )
}, 120_000)

afterAll(async () => {
  if (libDir) await rm(libDir, { recursive: true, force: true })
})

async function consumerBundle(exportName: string): Promise<string> {
  const entry = "virtual:consumer"
  return chunksOf(
    await build({
      configFile: false,
      logLevel: "silent",
      root: libDir,
      plugins: [
        {
          name: "consumer-entry",
          resolveId: (id) => (id === entry ? `\0${entry}` : null),
          load: (id) =>
            id === `\0${entry}`
              ? `import { ${exportName} } from ${JSON.stringify(join(libDir, "index.js"))}\nconsole.log(${exportName})`
              : null,
        },
      ],
      build: {
        write: false,
        minify: false,
        rollupOptions: { input: entry, external: (id) => EXTERNAL.test(id) },
      },
    }),
  )
}

describe("PlatformBadge bundle", () => {
  it("does not bundle the dropdown menu or tailwind-merge", async () => {
    const code = await consumerBundle("PlatformBadge")
    expect(code).toContain("PlatformBadge")
    expect(code).not.toContain("@radix-ui/react-dropdown-menu")
    expect(code).not.toContain("@radix-ui/react-avatar")
    // Nor `cn()`'s tailwind-merge: the badge lives on consumers' initial load.
    expect(code).not.toContain("tailwind-merge")
  })

  it("control: PlatformSwitcher does bundle the dropdown menu", async () => {
    const code = await consumerBundle("PlatformSwitcher")
    expect(code).toContain("@radix-ui/react-dropdown-menu")
  })
})
