// Resume / CV panel — same overlay family as About and Contact.
// Sparse, gallery-style curriculum vitae with a working print button.

function CloseIconRS() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

const rsLabel = {
  fontSize: 10,
  letterSpacing: "0.32em",
  textTransform: "uppercase",
  opacity: 0.5,
  marginBottom: 10,
};

const rsSection = {
  paddingTop: 28,
  paddingBottom: 28,
  borderTop: "1px solid color-mix(in srgb, var(--fg) 14%, transparent)",
};

const rsEntryRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: 24,
  fontSize: 15,
  lineHeight: 1.5,
  margin: "0 0 12px",
};

const rsYear = {
  flex: "0 0 auto",
  opacity: 0.5,
  fontVariantNumeric: "tabular-nums",
  fontSize: 13,
  letterSpacing: "0.04em",
};

function ResumeEntry({ year, children }) {
  return (
    <div style={rsEntryRow}>
      <div style={{ flex: 1, opacity: 0.88 }}>{children}</div>
      <div style={rsYear}>{year}</div>
    </div>
  );
}

function Resume({ open, onClose }) {
  return (
    <div
      aria-hidden={!open}
      className="resume-panel"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 40,
        pointerEvents: open ? "auto" : "none",
        opacity: open ? 1 : 0,
        transition: "opacity 0.5s ease",
        background: "color-mix(in srgb, var(--bg) 96%, #000 4%)",
        color: "var(--fg)",
        padding: "calc(96px + 4vw) 6vw 6vw",
        fontFamily: "var(--font-body)",
        overflowY: "auto",
      }}
    >
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .resume-panel {
            position: static !important;
            inset: auto !important;
            opacity: 1 !important;
            pointer-events: auto !important;
            overflow: visible !important;
            padding: 0 !important;
            background: white !important;
            color: black !important;
            height: auto !important;
            transition: none !important;
          }
          .resume-panel * {
            background: white !important;
            color: black !important;
            border-color: #999 !important;
            opacity: 1 !important;
            box-shadow: none !important;
          }
          @page { margin: 1.5cm; }
        }
      `}</style>

      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="no-print"
        style={{
          position: "fixed",
          top: 28,
          right: 130,
          zIndex: 61,
          width: 38,
          height: 38,
          display: "grid",
          placeItems: "center",
          color: "var(--fg)",
          opacity: 0.75,
        }}
      >
        <CloseIconRS />
      </button>

      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: 24,
          marginBottom: 8,
        }}>
          <div>
            <div style={rsLabel}>Curriculum Vitae</div>
            <h1 style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: "clamp(40px, 5vw, 72px)",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              margin: 0,
            }}>
              Chris
            </h1>
            <div style={{ fontSize: 14, letterSpacing: "0.04em", opacity: 0.65, marginTop: 10 }}>
              Photographer, Lisbon &amp; Berlin
            </div>
          </div>

          <div className="no-print" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            <button
              type="button"
              onClick={() => window.print()}
              style={{
                padding: "13px 26px",
                border: "1px solid color-mix(in srgb, var(--fg) 40%, transparent)",
                background: "transparent",
                color: "var(--fg)",
                fontSize: 11,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Print / Download
            </button>
            <a
              href="/resume.html"
              target="_blank"
              rel="noopener"
              style={{
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                opacity: 0.55,
                color: "var(--fg)",
                textDecoration: "none",
              }}
            >
              Open printable page ↗
            </a>
          </div>
        </div>

        {/* Summary */}
        <div style={{ ...rsSection, borderTop: "none", paddingTop: 22 }}>
          <p style={{ fontSize: 17, lineHeight: 1.6, opacity: 0.88, maxWidth: 620, margin: 0, textWrap: "pretty" }}>
            Working across 35mm, medium format and digital since 2014, with a practice
            built around long walks, natural light and a record of ordinary things.
            Editorial and fine-art work has appeared internationally; prints are held
            in private collections across Europe and Japan.
          </p>
        </div>

        {/* Exhibitions */}
        <div style={rsSection}>
          <div style={rsLabel}>Selected Exhibitions</div>
          <ResumeEntry year="2024">
            <em>Low Tide</em>, solo exhibition, Galeria Quadrado, Lisbon
          </ResumeEntry>
          <ResumeEntry year="2023">
            <em>Northern Light</em>, group show, C/O Berlin
          </ResumeEntry>
          <ResumeEntry year="2021">
            <em>Rooms Facing the Sea</em>, solo exhibition, Foam Talent Gallery, Amsterdam
          </ResumeEntry>
          <ResumeEntry year="2019">
            <em>Interiors</em>, group show, Fotomuseum Antwerp
          </ResumeEntry>
          <ResumeEntry year="2017">
            <em>New Faro</em>, solo exhibition, Galeria Municipal, Faro
          </ResumeEntry>
        </div>

        {/* Publications */}
        <div style={rsSection}>
          <div style={rsLabel}>Publications</div>
          <ResumeEntry year="2023">
            <em>Low Tide</em>, monograph, Steidl
          </ResumeEntry>
          <ResumeEntry year="2020">
            <em>Rooms Facing the Sea</em>, monograph, MACK
          </ResumeEntry>
          <ResumeEntry year="2022">
            Portfolio feature, <em>Aperture</em>, Issue 246
          </ResumeEntry>
          <ResumeEntry year="2021">
            Portfolio feature, <em>FOAM Magazine</em>, Issue 58
          </ResumeEntry>
          <ResumeEntry year="2019">
            Editorial feature, <em>The New Yorker</em>, Photo Booth
          </ResumeEntry>
        </div>

        {/* Collections */}
        <div style={rsSection}>
          <div style={rsLabel}>Collections</div>
          <ResumeEntry year="Private">
            Fondation Calouste Gulbenkian, Lisbon
          </ResumeEntry>
          <ResumeEntry year="Private">
            Museum für Fotografie, Berlin, works on paper archive
          </ResumeEntry>
          <ResumeEntry year="Private">
            Private collections across Portugal, Germany, France and Japan
          </ResumeEntry>
        </div>

        {/* Education / Training */}
        <div style={rsSection}>
          <div style={rsLabel}>Education &amp; Training</div>
          <ResumeEntry year="2013">
            BA Photography, Ar.Co, Lisbon
          </ResumeEntry>
          <ResumeEntry year="2015">
            Darkroom &amp; Analogue Process, Fotoform Studio, Berlin
          </ResumeEntry>
          <ResumeEntry year="2018">
            Artist Residency, Cimaise Editions, Arles
          </ResumeEntry>
        </div>

        {/* Skills / Format */}
        <div style={rsSection}>
          <div style={rsLabel}>Skills &amp; Format</div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 20,
            fontSize: 14,
            lineHeight: 1.6,
            opacity: 0.85,
          }}>
            <div>
              <div style={{ opacity: 0.5, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>Format</div>
              35mm, medium format, digital
            </div>
            <div>
              <div style={{ opacity: 0.5, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>Process</div>
              Darkroom printing, scanning, colour grading
            </div>
            <div>
              <div style={{ opacity: 0.5, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>Practice</div>
              Editorial, fine art, long-term documentary
            </div>
            <div>
              <div style={{ opacity: 0.5, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>Languages</div>
              English, Portuguese, German
            </div>
          </div>
        </div>

        {/* Contact */}
        <div style={{ ...rsSection, paddingBottom: 8 }}>
          <div style={rsLabel}>Contact</div>
          <a href="mailto:studio@chris.photo" style={{
            fontFamily: "var(--font-heading)",
            fontSize: 24,
            fontStyle: "italic",
            color: "var(--fg)",
            textDecoration: "none",
          }}>
            studio@chris.photo
          </a>
          <div style={{ fontSize: 13, letterSpacing: "0.04em", opacity: 0.6, marginTop: 10 }}>
            Based in Lisbon and Berlin. Available for commissions, prints and editorial work.
          </div>
        </div>
      </div>
    </div>
  );
}

window.Resume = Resume;
