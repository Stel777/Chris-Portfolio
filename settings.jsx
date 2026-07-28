// Settings — cogwheel button + slide-in panel.
// Backgrounds (incl. custom upload), fonts, listing layouts.

const { useState: useStateS, useEffect: useEffectS, useRef: useRefS } = React;

function CogIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9 1.65 1.65 0 0 0 4.27 7.18l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

// Dynamically load Google Fonts on demand
const loadedGoogle = new Set();
function ensureGoogleFont(families) {
  if (!families || !families.length) return;
  const key = families.join("|");
  if (loadedGoogle.has(key)) return;
  loadedGoogle.add(key);
  const href = "https://fonts.googleapis.com/css2?" +
    families.map(f => "family=" + f.replace(/ /g, "+")).join("&") +
    "&display=swap";
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

// Visual swatch for a background
function BgSwatch({ bg, active, onClick }) {
  const klass =
    bg.kind === "noise" ? "bg-noise" :
    bg.kind === "grid"  ? "bg-grid"  :
    bg.kind === "dots"  ? "bg-dots"  :
    bg.kind === "lines" ? "bg-lines" :
    "";
  return (
    <button
      type="button"
      onClick={onClick}
      title={bg.name}
      className={"bg-swatch " + klass}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1 / 1",
        background: bg.css,
        borderRadius: 2,
        outline: active ? "1px solid var(--fg)" : "1px solid color-mix(in srgb, var(--fg) 12%, transparent)",
        outlineOffset: active ? 2 : 0,
        overflow: "hidden",
        color: bg.fg,
        cursor: "pointer",
      }}
    />
  );
}

function FontRow({ f, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 12,
        width: "100%",
        padding: "10px 12px",
        borderBottom: "1px solid color-mix(in srgb, var(--fg) 10%, transparent)",
        textAlign: "left",
        opacity: active ? 1 : 0.7,
        background: active ? "color-mix(in srgb, var(--fg) 6%, transparent)" : "transparent",
      }}
    >
      <span
        style={{
          fontFamily: f.heading,
          fontWeight: f.weight,
          fontStyle: f.italic ? "italic" : "normal",
          fontSize: 22,
          letterSpacing: "0",
        }}
      >
        {f.name}
      </span>
      <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.5 }}>
        {f.id}
      </span>
    </button>
  );
}

function LayoutRow({ l, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 4,
        width: "100%",
        padding: "12px 12px",
        borderBottom: "1px solid color-mix(in srgb, var(--fg) 10%, transparent)",
        textAlign: "left",
        background: active ? "color-mix(in srgb, var(--fg) 6%, transparent)" : "transparent",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <LayoutGlyph id={l.id} />
        <span style={{ fontSize: 13, letterSpacing: "0.06em" }}>{l.name}</span>
      </div>
      <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.45, paddingLeft: 32 }}>
        {l.desc}
      </span>
    </button>
  );
}

function AnimationRow({ a, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 4,
        width: "100%",
        padding: "12px 12px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        textAlign: "left",
        background: active ? "rgba(255,255,255,0.05)" : "transparent",
        color: "inherit",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{
          width: 8, height: 8, borderRadius: "50%",
          background: active ? "currentColor" : "transparent",
          border: "1px solid currentColor", opacity: 0.7,
        }} />
        <span style={{ fontSize: 13, letterSpacing: "0.04em" }}>{a.name}</span>
      </div>
      <span style={{
        fontSize: 10, letterSpacing: "0.14em", textTransform: "none",
        opacity: 0.6, paddingLeft: 22, lineHeight: 1.4,
      }}>
        {a.desc}
      </span>
    </button>
  );
}

function LayoutGlyph({ id }) {
  const props = { width: 22, height: 22, viewBox: "0 0 22 22", fill: "none", stroke: "currentColor", strokeWidth: 1.1 };
  if (id === "horizontal") return (
    <svg {...props}>
      <rect x="1" y="9" width="3" height="4" />
      <rect x="5" y="8" width="4" height="6" />
      <rect x="10" y="6" width="6" height="10" />
      <rect x="17" y="8" width="4" height="6" />
    </svg>
  );
  if (id === "3dspace") return (
    <svg {...props}>
      <rect x="2"  y="2"  width="3" height="4" opacity="0.4" />
      <rect x="17" y="3"  width="3" height="4" opacity="0.4" />
      <rect x="3"  y="14" width="4" height="5" opacity="0.6" />
      <rect x="14" y="15" width="4" height="4" opacity="0.6" />
      <rect x="8"  y="7"  width="7" height="8" />
    </svg>
  );
  if (id === "isometric") return (
    <svg {...props}>
      <g transform="translate(1,1) skewY(-12)">
        <rect x="2" y="6" width="2" height="9" />
        <rect x="5" y="6" width="2" height="9" />
        <rect x="8" y="6" width="2" height="9" />
        <rect x="11" y="4" width="6" height="11" />
      </g>
    </svg>
  );
  if (id === "grid") return (
    <svg {...props}>
      <rect x="2" y="2" width="8" height="8" />
      <rect x="12" y="2" width="8" height="8" />
      <rect x="2" y="12" width="8" height="8" />
      <rect x="12" y="12" width="8" height="8" />
    </svg>
  );
  if (id === "scatter") return (
    <svg {...props}>
      <rect x="2" y="6" width="5" height="4" transform="rotate(-12 4.5 8)" />
      <rect x="9" y="3" width="5" height="6" transform="rotate(6 11.5 6)" />
      <rect x="6" y="12" width="6" height="5" transform="rotate(-4 9 14.5)" />
      <rect x="14" y="11" width="6" height="6" transform="rotate(10 17 14)" />
    </svg>
  );
  if (id === "filmstrip") return (
    <svg {...props}>
      <rect x="6" y="1" width="10" height="20" />
      <line x1="6" y1="6" x2="16" y2="6" />
      <line x1="6" y1="11" x2="16" y2="11" />
      <line x1="6" y1="16" x2="16" y2="16" />
    </svg>
  );
  return null;
}

// Luminance check for choosing readable fg against a chosen background.
function hexToFg(hex) {
  const h = hex.replace("#", "");
  if (h.length !== 6 && h.length !== 3) return "#f0ede4";
  const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 0.55 ? "#161616" : "#f0ede4";
}
function normalizeHex(input) {
  if (!input) return null;
  let s = input.trim().toLowerCase();
  if (s[0] !== "#") s = "#" + s;
  if (/^#[0-9a-f]{3}$/.test(s)) {
    s = "#" + s.slice(1).split("").map(c => c + c).join("");
  }
  if (/^#[0-9a-f]{6}$/.test(s)) return s;
  return null;
}

function CustomColorPicker({ state, set }) {
  // Initialize from current bg if it's already a custom-color, else a neutral dark.
  const startingHex = (state.bg?.id === "custom-color" && state.bg.css) || "#1a1d24";
  const [hex, setHex] = useStateS(startingHex);
  const [draft, setDraft] = useStateS(startingHex);

  // When the user opens the panel later with a different custom color active,
  // resync the local controls.
  useEffectS(() => {
    if (state.bg?.id === "custom-color") {
      setHex(state.bg.css);
      setDraft(state.bg.css);
    }
  }, [state.bg?.id, state.bg?.css]);

  const applyColor = (h) => {
    const n = normalizeHex(h);
    if (!n) return;
    setHex(n);
    setDraft(n);
    set({
      bg: { id: "custom-color", name: "Custom color", kind: "solid", css: n, fg: hexToFg(n) },
      custom: null,
    });
  };

  const isActive = state.bg?.id === "custom-color";

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px",
      border: "1px solid " + (isActive ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.12)"),
      borderRadius: 2,
    }}>
      {/* Color-wheel swatch (native color input clipped to circle) */}
      <label style={{
        position: "relative",
        width: 44, height: 44,
        borderRadius: "50%",
        background: `conic-gradient(from 0deg,
          #ff4136, #ff851b, #ffdc00, #2ecc40, #39cccc, #0074d9,
          #b10dc9, #f012be, #ff4136)`,
        cursor: "pointer",
        flexShrink: 0,
        boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.08)",
      }}>
        <span style={{
          position: "absolute", inset: 6,
          borderRadius: "50%",
          background: hex,
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)",
        }} />
        <input
          type="color"
          value={hex}
          onChange={(e) => applyColor(e.target.value)}
          aria-label="Pick a custom background color"
          style={{
            position: "absolute", inset: 0,
            opacity: 0, cursor: "pointer", border: "none", padding: 0, margin: 0, width: "100%", height: "100%",
          }}
        />
      </label>

      {/* Hex text input */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{
          fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", opacity: 0.55,
        }}>
          Custom color
        </div>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => applyColor(draft)}
          onKeyDown={(e) => { if (e.key === "Enter") applyColor(draft); }}
          spellCheck={false}
          style={{
            background: "transparent",
            border: "none",
            borderBottom: "1px solid rgba(255,255,255,0.18)",
            color: "#f0ede4",
            font: "inherit",
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 14,
            letterSpacing: "0.06em",
            padding: "4px 0",
            outline: "none",
            width: "100%",
            textTransform: "uppercase",
          }}
        />
      </div>

      <button
        type="button"
        onClick={() => applyColor(draft)}
        style={{
          fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase",
          padding: "10px 12px",
          border: "1px solid rgba(255,255,255,0.18)",
          color: "#f0ede4",
          flexShrink: 0,
        }}
      >
        Apply
      </button>
    </div>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1,
        padding: "12px 0",
        fontSize: 10,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        opacity: active ? 1 : 0.45,
        borderBottom: active ? "1px solid var(--fg)" : "1px solid transparent",
        color: "inherit",
      }}
    >
      {label}
    </button>
  );
}

function Settings({ open, onClose, onOpen, state, set }) {
  const [tab, setTab] = useStateS("background");
  const fileRef = useRefS(null);

  // Load Google fonts for the currently-active font so it actually renders
  useEffectS(() => {
    if (state.font?.google) ensureGoogleFont(state.font.google);
  }, [state.font]);

  // Pre-load fonts when switching to the Type tab so the previews render
  useEffectS(() => {
    if (tab === "type") {
      window.FONTS.forEach(f => { if (f.google) ensureGoogleFont(f.google); });
    }
  }, [tab]);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const kind = file.type.startsWith("video") ? "video" : "image";
    set({ custom: { url, kind, name: file.name } });
  };

  return (
    <>
      {/* Floating cog */}
      <button
        type="button"
        aria-label="Settings"
        onClick={onOpen}
        style={{
          position: "fixed",
          top: 28,
          right: 28,
          zIndex: 60,
          width: 38,
          height: 38,
          display: "grid",
          placeItems: "center",
          color: "var(--fg)",
          opacity: open ? 0 : 0.85,
          transition: "opacity 0.3s ease, transform 0.6s ease",
          transform: open ? "rotate(90deg)" : "rotate(0deg)",
          pointerEvents: open ? "none" : "auto",
        }}
      >
        <CogIcon size={20} />
      </button>

      {/* Click-catcher (no blur/dim so live changes are visible) */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed", inset: 0, zIndex: 50,
            background: "transparent",
          }}
        />
      )}

      {/* Panel */}
      <aside
        aria-hidden={!open}
        style={{
          position: "fixed",
          top: 0, right: 0, bottom: 0,
          width: 440,
          maxWidth: "100vw",
          zIndex: 55,
          // Solid, opaque chrome — sits cleanly on top of any background.
          // We override --fg inside the panel so text is light regardless of
          // the page's theme.
          background: "linear-gradient(180deg, #18181c 0%, #0c0c10 100%)",
          color: "#f0ede4",
          ["--fg"]: "#f0ede4",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "-40px 0 80px rgba(0,0,0,0.45)",
          transform: open ? "translateX(0)" : "translateX(110%)",
          transition: "transform 0.55s cubic-bezier(0.2, 0.85, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          fontFamily: "var(--font-body)",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "22px 22px 14px",
          borderBottom: "1px solid color-mix(in srgb, var(--fg) 12%, transparent)",
        }}>
          <div style={{ fontSize: 10, letterSpacing: "0.36em", textTransform: "uppercase", opacity: 0.65 }}>
            Settings
          </div>
          <button type="button" onClick={onClose} aria-label="Close" style={{ opacity: 0.7 }}>
            <CloseIcon />
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex",
          padding: "0 22px",
          borderBottom: "1px solid color-mix(in srgb, var(--fg) 10%, transparent)",
        }}>
          <Tab label="Background" active={tab === "background"} onClick={() => setTab("background")} />
          <Tab label="Type"       active={tab === "type"}       onClick={() => setTab("type")} />
          <Tab label="Layout"     active={tab === "layout"}     onClick={() => setTab("layout")} />
          <Tab label="Intro"      active={tab === "intro"}      onClick={() => setTab("intro")} />
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 22px 40px" }}>
          {tab === "background" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
                {window.BACKGROUNDS.map(bg => (
                  <BgSwatch
                    key={bg.id}
                    bg={bg}
                    active={!state.custom && state.bg.id === bg.id}
                    onClick={() => set({ bg, custom: null })}
                  />
                ))}
              </div>

              {/* Custom color (wheel + hex) */}
              <div style={{ marginTop: 22, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.10)" }}>
                <div style={{ fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", opacity: 0.55, marginBottom: 10 }}>
                  Pick a color
                </div>
                <CustomColorPicker state={state} set={set} />
              </div>

              {/* Custom image / video upload */}
              <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.10)" }}>
                <div style={{ fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", opacity: 0.55, marginBottom: 10 }}>
                  Image / Video
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  style={{
                    width: "100%",
                    padding: "16px 14px",
                    border: "1px dashed rgba(255,255,255,0.28)",
                    textAlign: "left",
                    fontSize: 12,
                    letterSpacing: "0.06em",
                    color: "#f0ede4",
                    opacity: 0.9,
                  }}
                >
                  {state.custom
                    ? <>Current: <em style={{ fontStyle: "italic" }}>{state.custom.name}</em> — tap to replace</>
                    : <>Upload your own background — <span style={{ opacity: 0.55 }}>mp4 · png · jpg</span></>}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,video/mp4,video/webm"
                  onChange={handleUpload}
                  style={{ display: "none" }}
                />
                {state.custom && (
                  <button
                    type="button"
                    onClick={() => set({ custom: null })}
                    style={{
                      marginTop: 10, fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", opacity: 0.6,
                    }}
                  >
                    Remove custom
                  </button>
                )}
              </div>
            </div>
          )}

          {tab === "type" && (
            <div>
              {window.FONTS.map(f => (
                <FontRow
                  key={f.id}
                  f={f}
                  active={state.font.id === f.id}
                  onClick={() => set({ font: f })}
                />
              ))}
            </div>
          )}

          {tab === "layout" && (
            <div>
              {window.LAYOUTS.map(l => (
                <LayoutRow
                  key={l.id}
                  l={l}
                  active={state.layout === l.id}
                  onClick={() => set({ layout: l.id })}
                />
              ))}
            </div>
          )}

          {tab === "intro" && (
            <div>
              <div style={{
                fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", opacity: 0.55, marginBottom: 8,
              }}>
                Entrance animation
              </div>
              {window.ANIMATIONS.map(a => (
                <AnimationRow
                  key={a.id}
                  a={a}
                  active={state.animation.id === a.id}
                  onClick={() => set({ animation: a, replay: true })}
                />
              ))}

              {/* Duration */}
              <div style={{ marginTop: 22, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.10)" }}>
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "baseline",
                  marginBottom: 10,
                }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", opacity: 0.55 }}>
                    Duration
                  </div>
                  <div style={{
                    fontSize: 11, letterSpacing: "0.06em",
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    opacity: 0.85,
                  }}>
                    {(state.speed / 1000).toFixed(2)}s
                  </div>
                </div>
                <input
                  type="range"
                  min={500}
                  max={4500}
                  step={50}
                  value={state.speed}
                  onChange={(e) => set({ speed: parseInt(e.target.value, 10) })}
                  className="speed-slider"
                  style={{ width: "100%", accentColor: "#f0ede4" }}
                />
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  marginTop: 4,
                  fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", opacity: 0.45,
                }}>
                  <span>Quick</span>
                  <span>Lingering</span>
                </div>
              </div>

              {/* Test button */}
              <div style={{ marginTop: 20 }}>
                <button
                  type="button"
                  onClick={() => set({ replay: true })}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: "1px solid rgba(255,255,255,0.22)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#f0ede4",
                    fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Test animation
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: "14px 22px 22px",
          borderTop: "1px solid color-mix(in srgb, var(--fg) 10%, transparent)",
          fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", opacity: 0.5,
        }}>
          Press <span style={{ opacity: 0.9 }}>Esc</span> or click outside to close
        </div>
      </aside>
    </>
  );
}

window.Settings = Settings;
