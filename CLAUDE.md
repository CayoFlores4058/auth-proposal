# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

This is a Vue 3 + TypeScript + Vite single-page app: a static technical-documentation/proposal site for a centralized authentication architecture (Cognito + a shared `BD_AUTH` database) replacing N business systems that each duplicate their own user schema today. There is no backend — every page is static content plus Mermaid diagrams rendered client-side from inline diagram-definition strings. There is no linter, formatter, or test runner configured (no ESLint/Oxlint/Prettier, no Vitest/Cypress/Playwright), even though `tsconfig.node.json` reserves config slots for some of these — don't assume they exist until you check.

## Commands

- `npm run dev` — start the Vite dev server.
- `npm run build` — type-check (`vue-tsc --build`) and production-build in parallel via `run-p`.
- `npm run build-only` — production build without type-checking.
- `npm run type-check` — run `vue-tsc --build` alone.
- `npm run preview` — serve the production build locally.

There are no lint or test scripts yet. If you add tests or linting, wire them into `package.json` scripts and update this file.

## Architecture

- Entry point: [src/main.ts](src/main.ts) creates the app from [src/App.vue](src/App.vue), installs the router, imports [src/assets/main.css](src/assets/main.css) (Tailwind v4), and mounts at `#app` in [index.html](index.html).
- Path alias `@` maps to `src/` (configured in both [vite.config.ts](vite.config.ts) and [tsconfig.app.json](tsconfig.app.json)) — use `@/...` imports for anything under `src/`.
- **Routing**: [src/router/index.ts](src/router/index.ts) defines the 6 documentation sections (Problema, Arquitectura, Modelo de datos, Flujo de autenticación, Migración, Trade-offs) as Vue Router routes. Views are imported **eagerly** (not via lazy `() => import(...)`) — this is deliberate, not an oversight: Tailwind v4's `@tailwindcss/vite` plugin can emit utility CSS in the wrong cascade order in dev mode when routes are code-split into separate lazily-loaded chunks (a `dark:` override can lose to its base utility because the two live in differently-timed chunk injections). Eager imports keep all view CSS in one pass and avoid it. If you reintroduce lazy route loading, retest dark mode across all routes in `npm run dev` (not just the production build, which sorts correctly either way).
- **Layout**: [src/App.vue](src/App.vue) is the shell — desktop fixed sidebar, mobile hamburger + off-canvas drawer, sticky header with the active route title and a theme toggle, and `<router-view>` for page content. [src/components/AppSidebar.vue](src/components/AppSidebar.vue) hardcodes the nav items (icon + label + route name) and highlights the active one via `useRoute().name`.
- **Dark mode**: [src/composables/useDarkMode.ts](src/composables/useDarkMode.ts) is a module-level singleton ref (persisted to `localStorage`, seeded from `prefers-color-scheme`) that toggles the `dark` class on `<html>`. Tailwind v4 is configured for class-based dark mode via `@custom-variant dark (&:where(.dark, .dark *));` in [src/assets/main.css](src/assets/main.css) (Tailwind v4 has no `darkMode` config option — this custom variant *is* the dark-mode switch).
- **Diagrams**: [src/components/MermaidDiagram.vue](src/components/MermaidDiagram.vue) takes a raw Mermaid definition string as a prop, calls `mermaid.render()` in `onMounted`, and re-renders on theme change (light/dark theme variables are hand-tuned in that component, not Mermaid's built-in themes) and on prop change. Diagram source lives inline as template strings inside each view (e.g. the flowchart in `ArquitecturaView.vue`, the `erDiagram` in `ModeloDatosView.vue`, the `sequenceDiagram` in `FlujoAutenticacionView.vue`) — edit those strings directly to change a diagram, no build step needed beyond a save.
- **Reusable doc components** (all in `src/components/`, custom-built with Tailwind, no UI library): `DocPageHeader` (eyebrow/title/subtitle), `DocCard` (toned callout box: default/warning/danger/success), `DocTabs` (slot-based, `#tab-0`/`#tab-1`/...), `DocAccordion` (single-open-at-a-time, takes `items: {title, body}[]`), `DocSteps` (numbered vertical timeline, takes `steps: {title, body, tag?}[]`), `ProsCons` (two-column pros/cons list), `ThemeToggle`.
- Node engine requirement: `^22.18.0 || >=24.12.0` (see [package.json](package.json)).
