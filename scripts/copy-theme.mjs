#!/usr/bin/env node
/*
 * Ship src/styles/theme.css as dist/theme.css — the RAW design tokens, importable
 * on their own.
 *
 * Why this exists
 * ---------------
 * `vite build` compiles src/styles/index.css (which @imports theme.css) into
 * dist/styles/index.css — a complete ~32KB Tailwind build, banner and preflight
 * included. That artifact is correct for a consumer with no Tailwind of its own,
 * but it is unusable for one that compiles its own: importing it stacks a second
 * Tailwind and a duplicate preflight on top of theirs.
 *
 * Until now there was no third option, because `files: ["dist"]` means the raw
 * theme.css was never published at all. So the only way to get these tokens into
 * an app that already runs Tailwind was to COPY them — which is exactly what
 * luminality-web did, and that fork then drifted: it still carries the pre-WCAG
 * palette this package fixed in v0.7.0 (#143), which therefore never reached
 * production.
 *
 * dist/theme.css closes that hole. A consumer with its own Tailwind can now do:
 *
 *     @import "tailwindcss";
 *     @import "@luminalityai/ui/theme.css";
 *
 * and get the @theme block only — one Tailwind, one preflight, tokens shared by
 * reference instead of by copy-paste.
 *
 * Kept as a plain copy (no bundler plugin) so the published file is byte-identical
 * to the source of truth, and a diff between them is always empty or a real bug.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const SRC = resolve(ROOT, "src/styles/theme.css")
const DIST = resolve(ROOT, "dist")
const OUT = resolve(DIST, "theme.css")

if (!existsSync(SRC)) {
  console.error(`copy-theme: source missing: ${SRC}`)
  process.exit(1)
}
if (!existsSync(DIST)) mkdirSync(DIST, { recursive: true })

copyFileSync(SRC, OUT)

// Guard the contract rather than trust it: the published file must actually carry
// the tokens. An empty or @theme-less copy would fail silently in every consumer.
const css = readFileSync(OUT, "utf8")
if (!css.includes("@theme")) {
  console.error(
    "copy-theme: dist/theme.css has no @theme block — refusing to publish a themeless theme",
  )
  process.exit(1)
}
const tokens = (css.match(/^\s*--[a-z0-9-]+:/gim) || []).length
if (tokens === 0) {
  console.error("copy-theme: dist/theme.css defines no custom properties")
  process.exit(1)
}
console.log(`copy-theme: dist/theme.css (${tokens} tokens)`)
