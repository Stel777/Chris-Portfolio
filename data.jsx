// Shared data: photos, fonts, backgrounds, layouts
// Loaded as a plain global script (no JSX in this file)

const PHOTO_TITLES = [
  "Solitude in Concrete", "Morning, Kyoto", "After Rain", "Studio 7",
  "Northern Light", "The Last Train", "Veil", "Quiet Room",
  "Coast, November", "Silent Hour", "Untitled No. 4", "Atelier",
  "Crossing", "Long Shadow", "Field Notes", "Embers",
  "Window, 6AM", "Threshold", "Drift", "Marsh",
  "Cinder", "Daughter", "Backstage", "Letter to Sigrid",
  "Quarry", "Holy Week", "Iron and Salt", "Cathedral, Empty",
  "Pale Blue", "Mother Tongue", "Recess", "Stillborn Hours",
  "Glassworks", "Hour of the Wolf", "Vespers", "Cypress",
  "Brackish", "Folkstone", "Verge", "Bruise"
];

const SERIES_LOCATION = {
  "Field":     ["Alentejo, PT", "Hokkaidō, JP", "Skåne, SE", "Cumbria, UK", "Aosta, IT"],
  "Interior":  ["Lisbon, PT", "Berlin, DE", "Kyoto, JP", "Reykjavík, IS", "Antwerp, BE"],
  "Portrait":  ["Studio Cais, Lisbon", "Studio 7, Berlin", "On location, Porto", "Sitter's home, Paris", "Studio 7, Berlin"],
  "Landscape": ["North Atlantic", "Inland sea, Honshū", "Cape Saint Vincent", "Outer Hebrides", "Apennines"],
  "Studio":    ["Studio Cais, Lisbon", "Studio 7, Berlin", "Atelier, Antwerp", "Studio Cais, Lisbon", "Studio 7, Berlin"],
};

const SERIES_DESC = {
  "Field":     "Long-form landscape work. Colour negative, medium format. Printed at scale, never cropped.",
  "Interior":  "Quiet domestic spaces, photographed at first light, with no people in the room.",
  "Portrait":  "The sitter is present but not informed. Exposure lasts the length of one shared cigarette.",
  "Landscape": "Sequenced as a single horizon line. Eight exposures, one frame, made on consecutive mornings.",
  "Studio":    "Negatives drawn from the working archive — disassembled tableaux, light tests, mistakes kept.",
};

// 40 fictional photos via picsum with stable seeds.
// Mix portrait & landscape for visual rhythm.
const PHOTOS = PHOTO_TITLES.map((title, i) => {
  const portrait = [0,3,5,7,9,10,13,16,18,22,25,28,31,34,37].includes(i);
  const w = portrait ? 800 : 1200;
  const h = portrait ? 1200 : 800;
  const series = ["Field", "Interior", "Portrait", "Landscape", "Studio"][i % 5];
  const locArr = SERIES_LOCATION[series];
  const location = locArr[Math.floor(i / 5) % locArr.length];
  const aspect = portrait ? "portrait" : "landscape";
  const medium = i % 2 === 0 ? "analog" : "digital";
  const palette = i % 3 === 0 ? "monochrome" : "colour";
  const status = i % 5 === 0 ? "exhibited" : "archive";
  return {
    id: i,
    title,
    year: 2018 + (i % 8),
    series,
    location,
    desc: SERIES_DESC[series],
    src: `https://picsum.photos/seed/chrisp${i}/${w}/${h}`,
    aspect,
    tags: [series.toLowerCase(), aspect, medium, palette, status],
  };
});

const PHOTO_TAGS = Array.from(new Set(PHOTOS.flatMap((p) => p.tags))).sort();

// 20 font pairings — heading + body. Avoid the overused ones.
const FONTS = [
  { id: "helvetica",   name: "Helvetica Neue",    heading: '"Helvetica Neue", Helvetica, Arial, sans-serif', body: '"Helvetica Neue", Helvetica, Arial, sans-serif', weight: 300, tracking: "0.2em" },
  { id: "instrument",  name: "Instrument Serif",  heading: '"Instrument Serif", serif',                      body: '"Instrument Sans", sans-serif', google: ["Instrument Serif", "Instrument Sans"], weight: 400, tracking: "0.05em", italic: true },
  { id: "fraunces",    name: "Fraunces",          heading: '"Fraunces", serif',                              body: '"Fraunces", serif', google: ["Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600"], weight: 400, tracking: "0em" },
  { id: "cormorant",   name: "Cormorant Garamond", heading: '"Cormorant Garamond", serif',                   body: '"Cormorant Garamond", serif', google: ["Cormorant Garamond:wght@300;400;500;600"], weight: 300, tracking: "0.05em", italic: true },
  { id: "playfair",    name: "Playfair Display",  heading: '"Playfair Display", serif',                      body: '"DM Sans", sans-serif', google: ["Playfair Display:wght@400;500;700","DM Sans:wght@300;400;500"], weight: 400, tracking: "0em" },
  { id: "ebgaramond",  name: "EB Garamond",       heading: '"EB Garamond", serif',                           body: '"EB Garamond", serif', google: ["EB Garamond:wght@400;500;600"], weight: 400, tracking: "0.04em" },
  { id: "crimson",     name: "Crimson Pro",       heading: '"Crimson Pro", serif',                           body: '"Crimson Pro", serif', google: ["Crimson Pro:wght@300;400;600"], weight: 300, tracking: "0.04em" },
  { id: "spacegrotesk",name: "Space Grotesk",     heading: '"Space Grotesk", sans-serif',                    body: '"Space Grotesk", sans-serif', google: ["Space Grotesk:wght@300;400;500;700"], weight: 400, tracking: "0.04em" },
  { id: "dmsans",      name: "DM Sans",           heading: '"DM Sans", sans-serif',                          body: '"DM Sans", sans-serif', google: ["DM Sans:wght@300;400;500;700"], weight: 400, tracking: "0.08em" },
  { id: "manrope",     name: "Manrope",           heading: '"Manrope", sans-serif',                          body: '"Manrope", sans-serif', google: ["Manrope:wght@300;400;500;700"], weight: 400, tracking: "0.1em" },
  { id: "jbmono",      name: "JetBrains Mono",    heading: '"JetBrains Mono", monospace',                    body: '"JetBrains Mono", monospace', google: ["JetBrains Mono:wght@300;400;500"], weight: 400, tracking: "0em" },
  { id: "ibmplex",     name: "IBM Plex Mono",     heading: '"IBM Plex Mono", monospace',                     body: '"IBM Plex Mono", monospace', google: ["IBM Plex Mono:wght@300;400;500"], weight: 400, tracking: "0em" },
  { id: "syne",        name: "Syne",              heading: '"Syne", sans-serif',                             body: '"Syne", sans-serif', google: ["Syne:wght@400;500;700;800"], weight: 500, tracking: "0em" },
  { id: "bodoni",      name: "Bodoni Moda",       heading: '"Bodoni Moda", serif',                           body: '"Bodoni Moda", serif', google: ["Bodoni Moda:opsz,wght@6..96,400;6..96,500;6..96,700"], weight: 400, tracking: "0.04em" },
  { id: "archivo",     name: "Archivo",           heading: '"Archivo", sans-serif',                          body: '"Archivo", sans-serif', google: ["Archivo:wght@300;400;500;700"], weight: 400, tracking: "0.06em" },
  { id: "worksans",    name: "Work Sans",         heading: '"Work Sans", sans-serif',                        body: '"Work Sans", sans-serif', google: ["Work Sans:wght@300;400;500;600"], weight: 400, tracking: "0.06em" },
  { id: "unbounded",   name: "Unbounded",         heading: '"Unbounded", sans-serif',                        body: '"Unbounded", sans-serif', google: ["Unbounded:wght@300;400;500;700"], weight: 400, tracking: "0.04em" },
  { id: "spectral",    name: "Spectral",          heading: '"Spectral", serif',                              body: '"Spectral", serif', google: ["Spectral:wght@300;400;500"], weight: 400, tracking: "0.04em" },
  { id: "sora",        name: "Sora",              heading: '"Sora", sans-serif',                             body: '"Sora", sans-serif', google: ["Sora:wght@200;300;400;500;700"], weight: 300, tracking: "0.08em" },
  { id: "tenor",       name: "Tenor Sans",        heading: '"Tenor Sans", serif',                            body: '"Tenor Sans", serif', google: ["Tenor Sans"], weight: 400, tracking: "0.18em" }
];

// 20 backgrounds — solids, subtle gradients, textures
const BACKGROUNDS = [
  { id: "black",       name: "Pure Black",        kind: "solid",    css: "#000000",                fg: "#f5f3ee" },
  { id: "void",        name: "Void",              kind: "solid",    css: "#06070a",                fg: "#e8e6e0" },
  { id: "charcoal",    name: "Charcoal",          kind: "solid",    css: "#15161a",                fg: "#e8e6e0" },
  { id: "ink",         name: "Indigo Ink",        kind: "solid",    css: "#0a1024",                fg: "#dfe2ef" },
  { id: "burgundy",    name: "Burgundy",          kind: "solid",    css: "#1d0d10",                fg: "#efd9d5" },
  { id: "forest",      name: "Forest",            kind: "solid",    css: "#0e1612",                fg: "#d9e4dd" },
  { id: "bone",        name: "Bone",              kind: "solid",    css: "#f3efe6",                fg: "#161616" },
  { id: "cream",       name: "Cream",             kind: "solid",    css: "#ece5d3",                fg: "#1a1916" },
  { id: "paper",       name: "Paper",             kind: "solid",    css: "#e8e3d6",                fg: "#1a1916" },
  { id: "concrete",    name: "Concrete",          kind: "solid",    css: "#c9c5be",                fg: "#1a1a1a" },
  { id: "dawn",        name: "Dawn",              kind: "gradient", css: "linear-gradient(180deg,#1a1320 0%,#2a1d2b 40%,#3d2530 100%)", fg: "#efe6e0" },
  { id: "dusk",        name: "Dusk",              kind: "gradient", css: "linear-gradient(180deg,#0b1330 0%,#1a1830 60%,#2a1525 100%)", fg: "#e6dee8" },
  { id: "ocean",       name: "Deep Ocean",        kind: "gradient", css: "radial-gradient(120% 80% at 50% 30%, #0c2236 0%, #050a14 70%)", fg: "#dbe5ef" },
  { id: "warm",        name: "Warm Fade",         kind: "gradient", css: "radial-gradient(120% 80% at 50% 100%, #2a1a14 0%, #0a0808 70%)", fg: "#f0e3d8" },
  { id: "vignette",    name: "Vignette",          kind: "gradient", css: "radial-gradient(140% 100% at 50% 50%, #1a1a1a 0%, #000 90%)", fg: "#efece3" },
  { id: "noise",       name: "Noise (dark)",      kind: "noise",    css: "#0c0c0e", fg: "#efece3" },
  { id: "noise-light", name: "Noise (light)",     kind: "noise",    css: "#ebe6d8", fg: "#1a1a1a" },
  { id: "grid",        name: "Grid",              kind: "grid",     css: "#0a0a0c", fg: "#efece3" },
  { id: "dots",        name: "Dot Field",         kind: "dots",     css: "#08080a", fg: "#efece3" },
  { id: "diagonal",    name: "Diagonal Lines",    kind: "lines",    css: "#0a0a0c", fg: "#efece3" }
];

// 5 photography listing layouts
const LAYOUTS = [
  { id: "horizontal", name: "Horizontal Line",  desc: "Continuous strip, centerpiece focus" },
  { id: "3dspace",    name: "3D Space",         desc: "Photos floating in depth, scroll flies through" },
  { id: "isometric",  name: "Isometric Stacks", desc: "3D card stacks, gallery-archive feel" },
  { id: "grid",       name: "Editorial Grid",   desc: "Two-column rhythmic grid" },
  { id: "scatter",    name: "Scatter",          desc: "Free-form composition with depth" },
  { id: "filmstrip",  name: "Vertical Reel",    desc: "Cinema strip, scroll vertically" }
];

// ── Intro / load-in animations ──────────────────────────────────────────────
// Each animation returns the *starting* state for photo i; the carousel then
// transitions every card to its layout position. `delay` is 0..1 (fraction of
// the total intro duration).
function _r(i, salt) {
  const x = Math.sin(i * 9301 + salt * 49297) * 233280;
  return x - Math.floor(x);
}
const ANIMATIONS = [
  {
    id: "og",
    name: "Origin scatter",
    desc: "Photos drift in from random positions, the original feel.",
    ease: "cubic-bezier(0.2, 0.85, 0.2, 1)",
    init: (i, N) => ({
      x: (_r(i, 1) - 0.5) * 1600,
      y: (_r(i, 2) - 0.5) * 900,
      rotate: (_r(i, 3) - 0.5) * 80,
      rotateY: 0,
      scale: 0.5 + _r(i, 4) * 0.6,
      opacity: 0,
      delay: _r(i, 5) * 0.35,
    }),
  },
  {
    id: "cascade",
    name: "Cascade",
    desc: "Photos sweep in left-to-right, one after another.",
    ease: "cubic-bezier(0.16, 1, 0.3, 1)",
    init: (i, N) => ({
      x: -1400,
      y: 60,
      rotate: -8,
      rotateY: 0,
      scale: 0.88,
      opacity: 0,
      delay: (i / N) * 0.75,
    }),
  },
  {
    id: "explode",
    name: "Explode from centre",
    desc: "All stacked at the centre, then bursts outward to their seats.",
    ease: "cubic-bezier(0.34, 1.32, 0.64, 1)",
    init: (i, N) => ({
      x: 0, y: 0,
      rotate: (_r(i, 14) - 0.5) * 30,
      rotateY: 0,
      scale: 0.08,
      opacity: 0,
      delay: _r(i, 15) * 0.18,
    }),
  },
  {
    id: "vertigo",
    name: "Vertigo",
    desc: "Each frame spins into place from far away with a 3D twist.",
    ease: "cubic-bezier(0.16, 1, 0.3, 1)",
    init: (i, N) => ({
      x: (_r(i, 17) - 0.5) * 600,
      y: (_r(i, 18) - 0.5) * 400,
      rotate: 0,
      rotateY: 180 + i * 21,
      scale: 0.04,
      opacity: 0,
      delay: _r(i, 19) * 0.4,
    }),
  },
  {
    id: "stack",
    name: "Tilted stack",
    desc: "A leaning archival stack splays open into the carousel.",
    ease: "cubic-bezier(0.22, 1, 0.36, 1)",
    init: (i, N) => ({
      x: 420 + (i - N/2) * 1.2,
      y: 60 - i * 1.3,
      rotate: 0,
      rotateY: -42,
      scale: 0.78,
      opacity: 0,
      delay: (1 - Math.abs(i - N/2) / (N/2)) * 0.55,
    }),
  },
  {
    id: "curtain",
    name: "Curtain fall",
    desc: "Photos drop in from above in soft waves.",
    ease: "cubic-bezier(0.34, 1.16, 0.64, 1)",
    init: (i, N) => ({
      x: 0,
      y: -1100 - _r(i, 22) * 400,
      rotate: (_r(i, 23) - 0.5) * 18,
      rotateY: 0,
      scale: 1,
      opacity: 0,
      delay: _r(i, 24) * 0.4,
    }),
  },
  {
    id: "ripple",
    name: "Ripple",
    desc: "A pulse outward from the centre photo, rings of arrivals.",
    ease: "cubic-bezier(0.2, 0.9, 0.25, 1)",
    init: (i, N) => ({
      x: (_r(i, 26) - 0.5) * 200,
      y: (_r(i, 27) - 0.5) * 200,
      rotate: 0,
      rotateY: 0,
      scale: 0.6,
      opacity: 0,
      delay: Math.min(0.7, Math.abs(i - N/2) / N * 1.6),
    }),
  },
  {
    id: "shuffle",
    name: "Shuffle deck",
    desc: "Photos shuffle out of a single deck, each with its own spin.",
    ease: "cubic-bezier(0.22, 1, 0.36, 1)",
    init: (i, N) => ({
      x: (_r(i, 30) - 0.5) * 30,
      y: (_r(i, 31) - 0.5) * 12,
      rotate: (_r(i, 32) - 0.5) * 8,
      rotateY: 0,
      scale: 0.9,
      opacity: 0,
      delay: (i / N) * 0.6,
    }),
  },
];

// Responsive srcset for a photo, built from the same picsum seed used for
// its default src, so the browser can pick the right resolution.
function srcSetFor(photo) {
  const widths = [400, 800, 1200, 1600];
  const ratio = photo.aspect === "portrait" ? 1.5 : 0.667;
  return widths
    .map((w) => {
      const h = Math.round(w * ratio);
      return `https://picsum.photos/seed/chrisp${photo.id}/${w}/${h} ${w}w`;
    })
    .join(", ");
}

window.PHOTOS = PHOTOS;
window.PHOTO_TAGS = PHOTO_TAGS;
window.FONTS = FONTS;
window.BACKGROUNDS = BACKGROUNDS;
window.LAYOUTS = LAYOUTS;
window.ANIMATIONS = ANIMATIONS;
window.srcSetFor = srcSetFor;
