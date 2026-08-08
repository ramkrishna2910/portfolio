# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio site for Ramakrishnan Sivakumar — an Astro 5 static site deployed to GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`, `withastro/action`). Optimized for both human visitors and AI agents (LLMO): the site serves `/resume.md`, `/llms.txt`, `/robots.txt`, a sitemap, and JSON-LD Person structured data, all generated from the same content source.

Commands: `npm run dev` (dev server), `npm run build` (build to `dist/`), `npm run preview` (serve the build at localhost:4321).

## Core invariant: one content source, many renderers

ALL content lives in `src/content/` collections (schemas in `src/content.config.ts`). Four renderers consume it:

1. HTML pages (`src/pages/*.astro`)
2. `/resume.md` — endpoint `src/pages/resume.md.ts` → `src/lib/resume.ts`
3. `/llms.txt` — endpoint `src/pages/llms.txt.ts` → `src/lib/llms.ts`
4. JSON-LD — `src/components/JsonLd.astro` (Person graph on every page; pages pass extra schema via the `jsonLdExtra` prop)

Never hand-edit generated outputs or duplicate content into pages — add/edit the entry in `src/content/` and every surface updates on build.

## How to add content

- **Blog post**: new `.md` in `src/content/writing/` (frontmatter: title, url, venue, date, tags, optional image in `src/assets/writing/`; body = one-paragraph summary used by llms.txt).
- **Talk**: new `.md` in `src/content/talks/` (youtubeId optional — talks without a public recording render as text entries; `role` defaults to "Speaker").
- **Publication / patent**: new `.json` in `src/content/publications/` or `src/content/patents/`.
- **Highlight**: new `.json` in `src/content/highlights/` — `type` is one of `youtube | x | linkedin | github`. X/LinkedIn use static excerpt cards (`excerpt` required — no official embeds; they're heavy and rot). GitHub cards are static data (no build-time API calls, update `stars` manually when worth it).
- **Role change / new job**: edit `src/content/experience/` and `src/content/profile/profile.json` (headline, bios, `knowsAbout` — the JSON-LD/LLMO keyword list).

Note: `src/content/profile/profile.json` and `src/content/interests/interests.json` use Astro's `file()` loader — each is a JSON **array** of entries with an `id` field.

## Site URL / domain

`src/site.config.ts` is the single source for `SITE_URL` (canonical URLs, og:url, sitemap, robots, llms.txt all derive from it) plus `BASE`, title, description, and the GA measurement ID. Domain cutover: change `SITE_URL`, add `public/CNAME` containing the bare domain (must be in the build output or Actions deploys wipe the Pages domain setting), configure DNS (apex A records 185.199.108.153–111.153, `www` CNAME → ramkrishna2910.github.io), redeploy.

## Design system

Handwritten CSS only — no framework. Tokens in `src/styles/tokens.css` (warm paper `--bg`, blue-black `--ink`, lemonade `--accent` #eab308 for graphic marks with dark-rind `--accent-ink` #854d0e for text accents); base styles + shared patterns (`.shell`, `.ledger-row`, `.meta`, `.eyebrow`) in `src/styles/global.css`. The homepage hero uses `KineticGrid.astro` — an interactive canvas grid (pointer warp + click ripples in lemon) that fades in/out via a CSS mask. Type: Archivo Variable (display, expanded caps), Source Serif 4 (body), IBM Plex Mono (metadata) — self-hosted via @fontsource, imported in `src/layouts/BaseLayout.astro`. Zero client JS except the GA snippet (PROD only) and the YouTube facade click handler in `YouTubeLite.astro` (no eager iframes — keep it that way).

Dates in frontmatter are UTC; always pass `timeZone: "UTC"` to `toLocaleDateString` when formatting or days shift.

## Regenerating brand assets

`public/favicon.svg` is the source; favicon-32.png / apple-touch-icon.png / og.png were rasterized with sharp (script pattern: see git history or re-derive — sharp is a dependency).
