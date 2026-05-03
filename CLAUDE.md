# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio website for Ramakrishnan Sivakumar — a single-page static site deployed via GitHub Pages (the `.nojekyll` marker disables Jekyll processing). There is no build system, package manager, framework, or test suite. To preview locally, open `index.html` directly or serve the directory (e.g. `python3 -m http.server`).

## Architecture

The entire site is one HTML file (`index.html`, ~50KB) composed of stacked `<section>` elements with anchor IDs that the navbar scrolls to. Sections in order: `#home`, `#about`, `#education`, `#blogs`, `#presentations`, `#publication`, `#patents`, `#interests`. Adding/removing/renaming a section means updating both the section markup and the corresponding navbar link.

The site is built on top of the **Elvish Bootstrap 4 personal template** (ThemesBoss, 2018). Most CSS and JS files under `css/` and `js/` are vendored template assets — Bootstrap 4, Owl Carousel, Magnific Popup, Isotope, Material Design Icons, Mobirise icons, jQuery, etc. Project-specific code lives in:

- `css/style.css` — template stylesheet; section-numbered table of contents at the top mirrors the section order in `index.html`.
- `js/custom.js` — single minified-style line wiring up: preloader fadeout, sticky navbar on scroll, smooth-scroll nav, scrollspy, animated counters (`#counter` / `.lan_fun_value[data-count]`), Isotope filtering for `.work-filter` driven by `#menu-filter a[data-filter]`, Magnific Popup galleries (`.img-zoom`, `.blog_play`), Owl carousel (`#owl-demo`), back-to-top button (`.back_top`), and a typed-text effect (`.element[data-elements]`). Also defines a `downloadPDF()` helper that points at `docs/Ramakrishnan_Resume_March_2023.pdf` — update this filename when the resume is refreshed.
- `images/` — section/portfolio assets. `docs/` — downloadable resume PDF.

Note: `js/custom.js` also installs anti-copy / context-menu / DevTools-shortcut blockers (`cut/copy/paste` prevented, right-click suppressed, Ctrl+Shift+I/J, Ctrl+S, Ctrl+U, F12 blocked). Keep this in mind when debugging in the browser — disable it temporarily rather than fighting it.

Google Analytics (gtag, `G-3R4GCX66NY`) is wired into the `<head>` of `index.html`.

## Editing conventions

- Content edits (new blog post, talk, paper, patent, project) are pure HTML changes inside the relevant `<section>` in `index.html` — follow the existing card/row markup in that section rather than inventing new structure, since styling is keyed off the template's class names.
- The portfolio/work grid uses Isotope; new items must carry the filter class names referenced by `#menu-filter a[data-filter]` to be reachable.
- Don't reformat the vendored `css/*.min.css`, `js/*.min.js`, or the single-line `js/custom.js` — they're third-party or intentionally compact.
