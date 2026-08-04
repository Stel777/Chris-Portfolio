// Skills & Tech panel — same overlay family as Resume, About and Contact.
// Grouped proficiency bars by category.

const SKILL_CATEGORIES = [
  {
    category: "Capture",
    skills: [
      { name: "35mm Film", level: 95 },
      { name: "Medium Format", level: 90 },
      { name: "Digital", level: 85 },
      { name: "Large Format", level: 70 },
    ],
  },
  {
    category: "Process",
    skills: [
      { name: "Hand Printing", level: 92 },
      { name: "Film Development", level: 88 },
      { name: "Scanning", level: 80 },
      { name: "Colour Grading", level: 78 },
    ],
  },
  {
    category: "Software",
    skills: [
      { name: "Lightroom", level: 90 },
      { name: "Capture One", level: 85 },
      { name: "Photoshop", level: 82 },
      { name: "Silverfast", level: 75 },
    ],
  },
  {
    category: "Practice",
    skills: [
      { name: "Editorial", level: 90 },
      { name: "Fine Art", level: 95 },
      { name: "Portraiture", level: 85 },
      { name: "Documentary", level: 88 },
    ],
  },
];

function CloseIconSk() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

const skLabel = {
  fontSize: 10,
  letterSpacing: "0.32em",
  textTransform: "uppercase",
  opacity: 0.5,
  marginBottom: 10,
};

const skGroup = {
  paddingTop: 28,
  paddingBottom: 28,
  borderTop: "1px solid color-mix(in srgb, var(--fg) 14%, transparent)",
};

const skRow = {
  display: "flex",
  alignItems: "center",
  gap: 16,
  margin: "0 0 14px",
};

const skName = {
  flex: "0 0 160px",
  fontSize: 14,
  letterSpacing: "0.02em",
  opacity: 0.88,
};

const skLevel = {
  flex: "0 0 34px",
  textAlign: "right",
  fontSize: 12,
  fontVariantNumeric: "tabular-nums",
  opacity: 0.5,
};

const skTrack = {
  flex: 1,
  height: 3,
  background: "color-mix(in srgb, var(--fg) 14%, transparent)",
};

function SkillRow({ name, level }) {
  return (
    <div data-skill={name} data-skill-level={level} style={skRow}>
      <div style={skName}>{name}</div>
      <div style={skTrack}>
        <div style={{ width: `${level}%`, height: "100%", background: "var(--fg)" }} />
      </div>
      <div style={skLevel}>{level}</div>
    </div>
  );
}

function Skills({ open, onClose }) {
  return (
    <div
      aria-hidden={!open}
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
        overflowY: "auto",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
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
        <CloseIconSk />
      </button>

      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 8 }}>
          <div style={skLabel}>Skills &amp; Tech</div>
          <h1 style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 400,
            fontStyle: "italic",
            fontSize: "clamp(40px, 5vw, 72px)",
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
            margin: 0,
          }}>
            Skills
          </h1>
          <div style={{ fontSize: 14, letterSpacing: "0.04em", opacity: 0.65, marginTop: 10 }}>
            Tools and craft, grouped by discipline
          </div>
        </div>

        {SKILL_CATEGORIES.map(({ category, skills }, i) => (
          <div key={category} data-skill-category={category} style={i === 0 ? { ...skGroup, borderTop: "none", paddingTop: 22 } : skGroup}>
            <div style={skLabel}>{category}</div>
            {skills.map(({ name, level }) => (
              <SkillRow key={name} name={name} level={level} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

window.Skills = Skills;
