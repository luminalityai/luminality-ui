#!/usr/bin/env node
/*
 * Verify the published type declarations after `npm run build`.
 *
 * Why this exists
 * ---------------
 * vite-plugin-dts can "succeed" while emitting useless types: sidekick-ui
 * shipped a bare `export { }` stub (sidekick-ui#122), and this package's own
 * `rollupTypes: true` was silently ignored by vite-plugin-dts 5 (renamed to
 * `bundleTypes`), so 0.9.0 and 0.10.0 shipped a 345-byte barrel of `export *`
 * lines instead of the rolled-up file we thought we had
 * (luminalityai/delivery-ops#441). Byte counts and grep-for-`export` checks
 * cannot tell a real declaration build from either of those, so this checks
 * what a consumer actually relies on:
 *
 *   1. dist/index.d.ts exists and is ONE self-contained file: no relative
 *      imports/re-exports (nothing else is emitted for them to point at) and
 *      no triple-slash references (they would leak into consumers' programs).
 *   2. It typechecks on its own with `skipLibCheck: false` — a dangling type
 *      reference or unresolvable import fails here instead of in a consumer.
 *   3. Its exports match dist/index.js: every runtime export has a declaration,
 *      and every declared VALUE export exists at runtime. A missing export, or
 *      an empty stub, fails here.
 *
 * Used by the /ship skill's dts guard (.claude/skills/ship/SKILL.md, 3e), CI,
 * and the publish workflow.
 */
import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import ts from "typescript"

// Not `import.meta.dirname`: that needs Node >= 20.11, engines allows >= 20.0.
const DIST = fileURLToPath(new URL("../dist", import.meta.url))
const DTS = resolve(DIST, "index.d.ts")
const JS = resolve(DIST, "index.js")
// Floor on the public surface. It only guards against a catastrophically
// truncated build; the runtime/types parity check below is the real test.
const MIN_EXPORTS = 20

const errors = []
const fail = (msg) => errors.push(msg)
const done = () => {
  if (errors.length) {
    for (const e of errors) console.error(`verify-dts: FAIL: ${e}`)
    process.exit(1)
  }
}

for (const f of [DTS, JS]) {
  if (!existsSync(f)) fail(`${f} is missing — run \`npm run build\` first.`)
}
done()

// 1. Self-contained single file.
const dtsText = readFileSync(DTS, "utf8")
const relative = dtsText.match(/\bfrom\s+['"]\.{1,2}\/[^'"]*['"]/g) ?? []
if (relative.length) {
  fail(
    `dist/index.d.ts is not rolled up — it still points at sibling files ` +
      `(${relative.slice(0, 3).join(", ")}${relative.length > 3 ? ", ..." : ""}). ` +
      `Check vite.config.ts \`bundleTypes\` and that @microsoft/api-extractor is installed.`,
  )
}
if (/^\s*\/\/\/\s*<reference/m.test(dtsText)) {
  fail(
    "dist/index.d.ts contains a triple-slash reference — a source .d.ts leaked into the bundle (see the dts `exclude` in vite.config.ts).",
  )
}

// 2. Typecheck the declaration file on its own.
const program = ts.createProgram([DTS], {
  strict: true,
  noEmit: true,
  skipLibCheck: false,
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.ReactJSX,
  // No ambient @types: the file must bring in everything it needs itself.
  types: [],
})
const diagnostics = ts.getPreEmitDiagnostics(program)
if (diagnostics.length) {
  const text = ts.formatDiagnostics(diagnostics.slice(0, 10), {
    getCanonicalFileName: (f) => f,
    getCurrentDirectory: () => process.cwd(),
    getNewLine: () => "\n",
  })
  fail(
    `dist/index.d.ts does not typecheck (${diagnostics.length} errors):\n${text}`,
  )
}

// 3. Runtime exports vs declared exports.
const checker = program.getTypeChecker()
const moduleSymbol = checker.getSymbolAtLocation(program.getSourceFile(DTS))
const declared = new Map()
for (const sym of moduleSymbol
  ? checker.getExportsOfModule(moduleSymbol)
  : []) {
  const target =
    sym.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(sym) : sym
  declared.set(sym.getName(), (target.flags & ts.SymbolFlags.Value) !== 0)
}

// Let TypeScript enumerate dist/index.js's exports too, so every form counts
// (`export { }`, `export const`, `export default`, `export *` from a chunk).
const jsProgram = ts.createProgram([JS], {
  allowJs: true,
  noEmit: true,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  types: [],
})
const jsChecker = jsProgram.getTypeChecker()
const jsModule = jsChecker.getSymbolAtLocation(jsProgram.getSourceFile(JS))
const runtime = new Set(
  (jsModule ? jsChecker.getExportsOfModule(jsModule) : []).map((s) =>
    s.getName(),
  ),
)

const undeclared = [...runtime].filter((n) => !declared.has(n))
if (undeclared.length) {
  fail(
    `exported by dist/index.js but missing from dist/index.d.ts: ${undeclared.join(", ")}`,
  )
}
const phantom = [...declared]
  .filter(([n, isValue]) => isValue && !runtime.has(n))
  .map(([n]) => n)
if (phantom.length) {
  fail(
    `declared as values in dist/index.d.ts but not exported by dist/index.js: ${phantom.join(", ")}`,
  )
}
if (runtime.size < MIN_EXPORTS) {
  fail(
    `dist/index.js exports only ${runtime.size} names (expected >= ${MIN_EXPORTS}) — suspect a broken build.`,
  )
}

done()
console.log(
  `verify-dts: OK — dist/index.d.ts (${Buffer.byteLength(dtsText)} bytes) is self-contained, typechecks with skipLibCheck: false, ` +
    `and declares all ${runtime.size} runtime exports (+${declared.size - runtime.size} type-only).`,
)
