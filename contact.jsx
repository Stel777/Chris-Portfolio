// Contact panel — slides in as a full-screen overlay, same family as About.
// Sparse, gallery-style form: underline-only inputs, no boxes, no rounded corners.

const { useState: useStateCT } = React;

// FormSubmit endpoint, no account or API key needed. Emails every submission straight to the studio inbox.
const CONTACT_ENDPOINT = "https://formsubmit.co/ajax/studio@chris.photo";

function CloseIconCT() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

const fieldStyleCT = {
  width: "100%",
  background: "transparent",
  border: "none",
  borderRadius: 0,
  borderBottom: "1px solid color-mix(in srgb, var(--fg) 30%, transparent)",
  color: "var(--fg)",
  font: "inherit",
  fontFamily: "var(--font-body)",
  fontSize: 16,
  padding: "10px 2px",
  outline: "none",
};

function Contact({ open, onClose }) {
  const [name, setName] = useStateCT("");
  const [email, setEmail] = useStateCT("");
  const [message, setMessage] = useStateCT("");
  const [submitting, setSubmitting] = useStateCT(false);
  const [sent, setSent] = useStateCT(false);
  const [failed, setFailed] = useStateCT(false);

  const resetForm = () => {
    setName("");
    setEmail("");
    setMessage("");
    setSent(false);
    setFailed(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setFailed(false);
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: "New enquiry from chris.photo",
          _autoresponse: "Thanks for reaching out to the studio, your message was received and a reply will follow within a day or two.",
          _captcha: "false",
        }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        setFailed(true);
      }
    } catch (err) {
      setFailed(true);
    } finally {
      setSubmitting(false);
    }
  };

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
        overflowY: "auto",
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
        <CloseIconCT />
      </button>

      {/* Left: heading */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", paddingRight: "4vw" }}>
        <div>
          <div style={{
            fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", opacity: 0.6, marginBottom: 28,
          }}>
            Contact
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
            Let's talk<br />
            about the<br />
            next project.
          </h1>
        </div>

        <div style={{
          fontSize: 17,
          lineHeight: 1.55,
          maxWidth: 480,
          opacity: 0.88,
          textWrap: "pretty",
        }}>
          <p style={{ margin: "0 0 18px" }}>
            Commissions, prints, editorial and collaboration enquiries are all
            welcome. A few lines is plenty to start.
          </p>
          <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", opacity: 0.5 }}>
            Prefer email? Write to{" "}
            <a href="mailto:studio@chris.photo" style={{ color: "inherit", textDecoration: "underline" }}>
              studio@chris.photo
            </a>{" "}
            directly.
          </p>
        </div>
      </div>

      {/* Right: form / confirmation */}
      <div style={{
        display: "flex", flexDirection: "column", justifyContent: "center",
        borderLeft: "1px solid color-mix(in srgb, var(--fg) 14%, transparent)",
        paddingLeft: "4vw",
      }}>
        {!sent ? (
          <form id="contact-form" onSubmit={handleSubmit} style={{ display: "grid", gap: 26, maxWidth: 480 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", opacity: 0.5, marginBottom: 8 }}>
                Name
              </div>
              <input
                type="text"
                name="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                style={fieldStyleCT}
              />
            </div>

            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", opacity: 0.5, marginBottom: 8 }}>
                Email
              </div>
              <input
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={fieldStyleCT}
              />
            </div>

            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", opacity: 0.5, marginBottom: 8 }}>
                Message
              </div>
              <textarea
                name="message"
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me a little about what you have in mind"
                style={{ ...fieldStyleCT, resize: "vertical", lineHeight: 1.5 }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                justifySelf: "start",
                marginTop: 6,
                padding: "14px 30px",
                border: "1px solid color-mix(in srgb, var(--fg) 40%, transparent)",
                background: "transparent",
                color: "var(--fg)",
                fontSize: 11,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                opacity: submitting ? 0.5 : 1,
                cursor: submitting ? "default" : "pointer",
              }}
            >
              {submitting ? "Sending" : "Send message"}
            </button>

            {failed && (
              <p role="alert" style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.85, margin: 0, color: "#c96b5a" }}>
                Something went wrong sending your message. Please try again, or
                email{" "}
                <a href="mailto:studio@chris.photo" style={{ color: "inherit" }}>
                  studio@chris.photo
                </a>{" "}
                directly.
              </p>
            )}
          </form>
        ) : (
          <div id="contact-confirmation" style={{ maxWidth: 480 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", opacity: 0.5, marginBottom: 16 }}>
              Sent
            </div>
            <h2 style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: "clamp(28px, 3vw, 40px)",
              lineHeight: 1.2,
              margin: "0 0 18px",
              textWrap: "pretty",
            }}>
              Thanks, your message was received.
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.6, opacity: 0.8, margin: "0 0 26px", maxWidth: 440 }}>
              A reply will follow shortly, usually within a day or two.
            </p>
            <button
              type="button"
              onClick={resetForm}
              style={{
                fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", opacity: 0.7,
                borderBottom: "1px solid color-mix(in srgb, var(--fg) 30%, transparent)",
                paddingBottom: 4,
              }}
            >
              Send another message
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

window.Contact = Contact;
