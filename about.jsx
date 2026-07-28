// About panel — slides in from the bottom.
// Sparse, gallery-style bio.

function About({ open, onClose }) {
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
        display: "grid",
        gridTemplateColumns: "1.1fr 1fr",
        padding: "calc(96px + 4vw) 6vw 6vw",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Left: identity */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", paddingRight: "4vw" }}>
        <div>
          <div style={{
            fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", opacity: 0.6, marginBottom: 28,
          }}>
            About / Colophon
          </div>
          <h1 style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 400,
            fontStyle: "italic",
            fontSize: "clamp(48px, 6vw, 96px)",
            lineHeight: 1.04,
            letterSpacing: "-0.01em",
            margin: 0,
            textWrap: "pretty",
          }}>
            Chris is a photographer<br />
            working between<br />
            cities, coastlines<br />
            and small rooms.
          </h1>
        </div>

        <div style={{ display: "flex", gap: 32, fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", opacity: 0.7 }}>
          <div>
            <div style={{ opacity: 0.5, marginBottom: 6 }}>Based</div>
            <div>Lisbon · Berlin</div>
          </div>
          <div>
            <div style={{ opacity: 0.5, marginBottom: 6 }}>Format</div>
            <div>35mm · Medium · Digital</div>
          </div>
          <div>
            <div style={{ opacity: 0.5, marginBottom: 6 }}>Since</div>
            <div>2014</div>
          </div>
        </div>
      </div>

      {/* Right: bio + contact */}
      <div style={{
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        borderLeft: "1px solid color-mix(in srgb, var(--fg) 14%, transparent)",
        paddingLeft: "4vw",
      }}>
        <div style={{
          fontSize: 17,
          lineHeight: 1.55,
          maxWidth: 520,
          opacity: 0.88,
          textWrap: "pretty",
        }}>
          <p style={{ margin: "0 0 18px" }}>
            The work begins in the morning, usually before anything is decided.
            A long walk, a notebook, a film body that has been with me for a decade.
            What follows is a record — sometimes commissioned, more often not — of
            light against ordinary things.
          </p>
          <p style={{ margin: "0 0 18px" }}>
            Selected work has appeared in <em>Aperture</em>, <em>FOAM</em>, <em>The New
            Yorker</em>, and several monographs published with Steidl and MACK. Prints
            are held in private collections across Europe and Japan.
          </p>
          <p style={{ margin: 0 }}>
            Commissions, prints and editorial enquiries are welcome.
          </p>
        </div>

        <div style={{ marginTop: 40, display: "grid", gap: 22 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", opacity: 0.5, marginBottom: 8 }}>
              Contact
            </div>
            <a href="mailto:studio@chris.photo" style={{
              fontFamily: "var(--font-heading)",
              fontSize: 28, fontStyle: "italic", color: "var(--fg)", textDecoration: "none",
            }}>
              studio@chris.photo
            </a>
          </div>
          <div style={{ display: "flex", gap: 26, fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", opacity: 0.75 }}>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Instagram</a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Are.na</a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Newsletter</a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Print Shop</a>
          </div>
        </div>
      </div>
    </div>
  );
}

window.About = About;
