# Findings: image lazy-loading / responsive srcset inventory

Scope: portfolio/gallery raster images only, per work order scope guard.

## Site type

Static site, no build step. React + ReactDOM + Babel-standalone loaded via CDN
script tags in index.html; all `.jsx` files are plain browser-parsed scripts
(no bundler). Alongside that SPA there are 5 standalone, dependency-free
static HTML pages under `case-studies/`.

## HTML files (site root)

- `index.html` - shell that loads the SPA (`app.jsx` + friends). No `<img>`
  tags of its own; background textures are inline SVG `data:` URIs / CSS
  gradients (decorative, not portfolio content, out of scope).
- `404.html`, `contact.html` - standalone pages, no portfolio `<img>` tags.
  `background-image` decorative gradients only.
- `case-studies/field.html`, `interior.html`, `portrait.html`,
  `landscape.html`, `studio.html` - each has exactly one portfolio `<img
  class="cover">` (the case study's hero cover photo).

## Gallery-rendering JS/JSX files

- `data.jsx` - defines `window.PHOTOS` (40 entries) and `window.srcSetFor(photo)`,
  a helper that builds a `srcset` string with 400/800/1200/1600 width
  descriptors.
- `gallery.jsx` - renders all 40 `PHOTOS` as `<img>` cards in the full
  archive grid.
- `carousel.jsx` - renders `PHOTOS` as `<img>` cards in the main 3D work
  carousel (the homepage's primary above-the-fold view).
- `casestudies.jsx` - defines `window.CASE_STUDIES` (5 entries) with a
  `coverSrcSet(cover)` helper (1x/2x width descriptors) and renders each
  study's cover `<img>` in the in-app case-study reader panel.
- `app.jsx` - renders the photo lightbox/zoom overlay `<img>`, reusing
  `srcSetFor`.

## Critical finding: no local portfolio raster files exist

Every portfolio/case-study photo is a **remote placeholder** served from
`https://picsum.photos/seed/<id>/<w>/<h>` - picsum.photos generates a real,
distinct JPEG at whatever width/height is requested in the URL, so the
existing `srcSetFor()` / `coverSrcSet()` helpers already produce genuine,
working multi-width responsive candidates, just fetched remotely instead of
pre-generated locally.

There are **zero local `.jpg/.jpeg/.png/.webp` files anywhere in the repo
that are used as portfolio/gallery images.** The only local raster files are:

- `pinterest_inspo/` - designer mood-board reference images (gif/png/jpg + a
  handful of mp4s).
- `uploads/` - 3 files (`Every Second.gif`, a screenshot, `download.webp`),
  duplicates of files in `pinterest_inspo/`.

Grep confirms neither folder is referenced anywhere in any `.html`/`.jsx`/`.js`
rendering code (`pinterest_inspo|uploads/` -> no matches). They are orphaned
local assets, not portfolio content, and out of scope.

The only other local-file `<img>`-adjacent usage is `background.jsx`'s
`custom.url`, which is a user-uploaded page-background image from the
Settings panel (not portfolio/gallery content) - out of scope per the
scope guard.

## Existing state vs. spec, per file

| File | loading=lazy | decoding=async | srcset | sizes | CLS prevention |
|---|---|---|---|---|---|
| gallery.jsx (40 cards) | yes | yes | yes (`srcSetFor`) | yes | CSS `aspectRatio` on wrapper |
| carousel.jsx (40 cards) | yes | yes | yes (`srcSetFor`) | yes | explicit inline px width/height |
| casestudies.jsx (5 covers) | yes | yes | yes (`coverSrcSet`) | yes | CSS `aspectRatio` |
| app.jsx (lightbox) | yes | yes | yes (`srcSetFor`) | yes | CSS `maxWidth`/`maxHeight` |
| case-studies/*.html (5 covers) | yes | yes | **missing** | **missing** | CSS `aspect-ratio` |

So 4 of 5 rendering surfaces already fully match the spec (done in a prior
session's rebuild). The one real, concrete gap is the 5 standalone
`case-studies/*.html` cover images, which have `loading="lazy"
decoding="async"` and an `aspect-ratio` CSS rule already, but are missing
`srcset`/`sizes`.

No CSS `background-image` thumbnails were found standing in for portfolio
`<img>` tags (background-image usages found are decorative page textures
and the out-of-scope custom-background feature).

## Blocker: assets/img/responsive/ local width-variant generation

See VERIFICATION.md for the full, evidenced write-up. Summary: this session's
Bash/PowerShell permission mode hard-blocks all code execution (python, node,
ImageMagick, PowerShell `Add-Type`, even `git init`), confirmed via direct
testing. Additionally, since no local source portfolio photos exist, there is
nothing to run Pillow against even if execution were available - the
resize-on-request behavior already lives in picsum.photos' URL scheme via
`srcSetFor`/`coverSrcSet`.
