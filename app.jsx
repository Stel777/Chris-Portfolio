// App — top-level wiring. Theme vars, header, settings, about, carousel.

const { useState: useStateA, useEffect: useEffectA, useMemo: useMemoA } = React;

function NavButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        opacity: active ? 1 : 0.55,
        transition: "opacity 0.3s ease",
        position: "relative",
        paddingBottom: 6,
      }}
    >
      {label}
      <span style={{
        position: "absolute", left: 0, right: 0, bottom: 0, height: 1,
        background: "var(--fg)",
        transform: active ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left",
        transition: "transform 0.4s ease",
      }} />
    </button>
  );
}

function Header({ section, panel, onWork, onPanel }) {
  return (
    <header style={{
      position: "fixed",
      top: 28,
      left: 28,
      right: 28,
      zIndex: 52,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      pointerEvents: "none",
      fontFamily: "var(--font-body)",
    }}>
      {/* Left: signature */}
      <div style={{
        pointerEvents: "auto",
        fontFamily: "var(--font-heading)",
        fontStyle: "italic",
        fontSize: 22,
        letterSpacing: "0",
        opacity: 0.92,
      }}>
        Chris<span style={{ opacity: 0.45 }}>.photo</span>
      </div>

      {/* Center nav — minimal */}
      <nav style={{
        pointerEvents: "auto",
        display: "flex",
        gap: 32,
        fontSize: 11,
        letterSpacing: "0.36em",
        textTransform: "uppercase",
      }}>
        <NavButton label="My Work" active={section === "work" && !panel} onClick={onWork} />
        <NavButton label="Gallery" active={panel === "gallery"} onClick={() => onPanel("gallery")} />
        <NavButton label="CV" active={panel === "cv"} onClick={() => onPanel("cv")} />
        <NavButton label="About Me" active={panel === "about"} onClick={() => onPanel("about")} />
        <NavButton label="Contact" active={panel === "contact"} onClick={() => onPanel("contact")} />
      </nav>

      {/* Right placeholder (theme toggle + cog live outside header, top:28 right:28) */}
      <div style={{ width: 100 }} />
    </header>
  );
}

function ThemeToggleIcon({ theme }) {
  return theme === "dark" ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Toggle light and dark theme"
      style={{
        position: "fixed",
        top: 28,
        right: 76,
        zIndex: 60,
        width: 38,
        height: 38,
        display: "grid",
        placeItems: "center",
        color: "var(--fg)",
        opacity: 0.75,
      }}
    >
      <ThemeToggleIcon theme={theme} />
    </button>
  );
}

function Footer({ layout, total, custom }) {
  return (
    <div style={{
      position: "fixed",
      bottom: 28,
      left: 28,
      right: 28,
      zIndex: 30,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      pointerEvents: "none",
      fontSize: 10,
      letterSpacing: "0.32em",
      textTransform: "uppercase",
      opacity: 0.55,
      fontFamily: "var(--font-body)",
    }}>
      <div>
        <div style={{ opacity: 0.55 }}>Archive</div>
        <div>{String(total).padStart(3, "0")} works · 2018–2026</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ opacity: 0.55 }}>Mode</div>
        <div>{layout}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ opacity: 0.55 }}>Hint</div>
        <div>Drag · Scroll · ← →</div>
      </div>
    </div>
  );
}

// Detail view when a photo is clicked
function Detail({ photo, onClose }) {
  useEffectA(() => {
    if (!photo) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [photo, onClose]);

  if (!photo) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 45,
        background: "color-mix(in srgb, var(--bg) 88%, #000 12%)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        display: "grid",
        placeItems: "center",
        cursor: "zoom-out",
        animation: "fade-in 0.4s ease",
      }}
    >
      <div style={{
        position: "relative",
        maxWidth: "78vw",
        maxHeight: "76vh",
        boxShadow: "0 40px 120px rgba(0,0,0,0.6)",
      }}>
        <img
          src={photo.src.replace(/\/\d+\/\d+$/, "/1600/1200")}
          srcSet={window.srcSetFor(photo)}
          sizes="78vw"
          alt={photo.title}
          loading="lazy"
          decoding="async"
          style={{
            maxWidth: "78vw", maxHeight: "76vh",
            objectFit: "contain", display: "block",
          }}
        />
        <div style={{
          position: "absolute",
          left: 0, right: 0, bottom: -64,
          display: "flex", alignItems: "baseline", justifyContent: "space-between",
          color: "var(--fg)",
          fontSize: 12,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          opacity: 0.8,
        }}>
          <div style={{
            fontFamily: "var(--font-heading)",
            fontStyle: "italic", letterSpacing: "0", textTransform: "none", fontSize: 22,
          }}>
            {photo.title}
          </div>
          <div>No. {String(photo.id + 1).padStart(2, "0")} · {photo.series} · {photo.year}</div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [bg, setBg] = useStateA(window.BACKGROUNDS[0]);
  const [custom, setCustom] = useStateA(null);
  const [font, setFont] = useStateA(window.FONTS[0]);
  const [layout, setLayout] = useStateA("horizontal");
  const [animation, setAnimation] = useStateA(window.ANIMATIONS[0]);
  const [speed, setSpeed] = useStateA(1700);
  const [replayToken, setReplayToken] = useStateA(0);
  const [settingsOpen, setSettingsOpen] = useStateA(false);
  const [section, setSection] = useStateA("work");
  // Single overlay slot: null | "about" | "gallery" | "cv" | "contact"
  const [panel, setPanel] = useStateA(null);
  // Case study reader, opened from a Gallery card, layered above the Gallery panel.
  const [caseStudyId, setCaseStudyId] = useStateA(null);
  const [theme, setTheme] = useStateA(() => {
    const stored = localStorage.getItem("pf-theme");
    if (stored) return stored;
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });

  const openPanel = (name) => { setPanel(name); setCaseStudyId(null); };
  const closePanel = () => setPanel(null);

  const openCaseStudy = (id) => {
    setCaseStudyId(id);
    const study = window.CASE_STUDIES.find((cs) => cs.id === id);
    if (window.analytics) window.analytics.trackProject(id, study ? study.title : id);
  };

  // Apply the saved theme once on page load.
  useEffectA(() => {
    const bgId = theme === "light" ? "bone" : "black";
    const themedBg = window.BACKGROUNDS.find((b) => b.id === bgId);
    if (themedBg) setBg(themedBg);
    if (window.analytics) window.analytics.trackVisit();
    // eslint-disable-next-line
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("pf-theme", next);
    setCustom(null);
    const themedBg = window.BACKGROUNDS.find((b) => b.id === (next === "light" ? "bone" : "black"));
    if (themedBg) setBg(themedBg);
  };

  // Reflect the active theme on <html> so external CSS (e.g. print styles,
  // browser UI) and future stylesheets can hook off it directly.
  useEffectA(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const state = { bg, custom, font, layout, animation, speed };
  const set = (patch) => {
    if ("bg" in patch) setBg(patch.bg);
    if ("custom" in patch) setCustom(patch.custom);
    if ("font" in patch) setFont(patch.font);
    if ("layout" in patch) setLayout(patch.layout);
    if ("animation" in patch) setAnimation(patch.animation);
    if ("speed" in patch) setSpeed(patch.speed);
    if (patch.replay) setReplayToken(t => t + 1);
  };

  // Update theme CSS variables
  useEffectA(() => {
    const root = document.documentElement.style;
    root.setProperty("--bg", custom ? "#000" : bg.css);
    root.setProperty("--fg", custom ? "#f5f3ee" : bg.fg);
    root.setProperty("--font-heading", font.heading);
    root.setProperty("--font-body", font.body);
    root.setProperty("--font-weight", String(font.weight));
    root.setProperty("--font-tracking", font.tracking);
  }, [bg, custom, font]);

  // Esc closes overlays, innermost first
  useEffectA(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (settingsOpen) setSettingsOpen(false);
        else if (caseStudyId != null) setCaseStudyId(null);
        else if (panel) closePanel();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [settingsOpen, panel, caseStudyId]);

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative", overflow: "hidden" }}>
      <Background bg={bg} custom={custom} />

      <Carousel
        layout={layout}
        photos={window.PHOTOS}
        animation={animation}
        speed={speed}
        replayToken={replayToken}
      />

      <Header
        section={section}
        panel={panel}
        onWork={() => { setSection("work"); closePanel(); }}
        onPanel={openPanel}
      />

      <Footer layout={layout} total={window.PHOTOS.length} custom={custom} />

      <ThemeToggle theme={theme} onToggle={toggleTheme} />

      <Settings
        open={settingsOpen}
        onOpen={() => setSettingsOpen(true)}
        onClose={() => setSettingsOpen(false)}
        state={state}
        set={set}
      />

      <About open={panel === "about"} onClose={closePanel} />
      <Gallery open={panel === "gallery"} onClose={closePanel} onOpenCaseStudy={openCaseStudy} />
      <Resume open={panel === "cv"} onClose={closePanel} />
      <Contact open={panel === "contact"} onClose={closePanel} />
      <CaseStudy
        study={window.CASE_STUDIES.find((cs) => cs.id === caseStudyId)}
        open={caseStudyId != null}
        onClose={() => setCaseStudyId(null)}
      />

      <style>{`
        @keyframes fade-in   { from { opacity: 0 } to { opacity: 1 } }
        @keyframes readout-in {
          from { opacity: 0; transform: translateY(-50%) translateX(20px); }
          to   { opacity: 1; transform: translateY(-50%) translateX(0); }
        }
      `}</style>
    </div>
  );
}

// Mount
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
