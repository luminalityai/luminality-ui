# Luminality app Figma mock (2026-02)

A static HTML prototype of the Luminality mobile app (home screen, bottom
nav, prompts and explore surfaces), built on 2026-02-19 to match the Figma
design. It is archived here as a **historical design reference**, not a spec.
The shipping app and this package have both moved on since, so where they
differ from the mock, the code is right.

## Source

Moved from `luminality-app` (repo root `index.html` + `assets/`), where it
was added in commit `745e5e8` ("Redesign home screen and bottom nav to match
Figma"). Tracked in luminalityai/delivery-ops#399.

`index.html` is kept verbatim. Only the 14 images it references were carried
over. The other 15 files from the old `assets/` folder were not used by the
mock and stay in `luminality-app`'s git history.

## Viewing

Open `index.html` directly in a browser. Image paths are relative
(`assets/…`), so no server is needed. Fonts (Nunito, Fredoka) load from
Google Fonts, so they need a network connection.

## Not shipped

Nothing in `design/` is part of `@luminalityai/ui`:

- `package.json` `files` only publishes `dist/`.
- ESLint, TypeScript, Knip and Vitest are all scoped to `src/`.
- `src/styles/index.css` excludes `design/` from Tailwind's source detection
  (`@source not`), so the mock's class names never reach the published
  stylesheet.
- `index.html` is in `.prettierignore` so it stays as exported.
