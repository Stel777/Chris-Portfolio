// Gallery panel — full archive wall, filterable by series.
// Sparse, gallery-style grid. Clicking a photo opens that series' case study.

const { useState: useStateG, useMemo: useMemoG } = React;

function Gallery({ open, onClose, onOpenCaseStudy }) {
  const [filter, setFilter] = useStateG("all");
  const [selectedTags, setSelectedTags] = useStateG([]);

  const series = useMemoG(() => {
    const seen = [];
    (window.PHOTOS || []).forEach((p) => {
      if (!seen.includes(p.series)) seen.push(p.series);
    });
    return seen;
  }, []);

  const allTags = window.PHOTO_TAGS || [];

  const toggleTag = (tag) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const photos = window.PHOTOS || [];
  const bySeries = filter === "all" ? photos : photos.filter((p) => p.series === filter);
  const visible = bySeries.filter((p) => selectedTags.every((t) => p.tags.includes(t)));

  // Most Viewed, ranked by locally stored view counts (see analytics.js).
  // Recomputed each render; empty when nothing has been viewed or DNT is on.
  const popularIds = ((window.analytics && window.analytics.popular()) || []).slice(0, 5);
  const titleForSeries = (id) => {
    const cs = (window.CASE_STUDIES || []).find((c) => c.id === id);
    return cs ? cs.title : id;
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
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Close affordance */}
      <button
        type="button"
        onClick={onClose}
        style={{
          position: "fixed",
          top: 38,
          right: 130,
          zIndex: 61,
          fontSize: 11,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          opacity: 0.6,
          background: "none",
          border: "none",
          color: "var(--fg)",
          cursor: "pointer",
        }}
      >
        Close
      </button>

      {/* Scrollable content */}
      <div
        style={{
          height: "100%",
          overflowY: "auto",
          padding: "calc(96px + 4vw) 6vw 6vw",
        }}
      >
        <div style={{
          fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", opacity: 0.6, marginBottom: 20,
        }}>
          Full Archive
        </div>
        <h1 style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 400,
          fontStyle: "italic",
          fontSize: "clamp(40px, 5vw, 72px)",
          lineHeight: 1.04,
          letterSpacing: "-0.01em",
          margin: "0 0 40px",
        }}>
          Gallery
        </h1>

        {/* Most Viewed: surfaces the locally most-opened case studies */}
        {popularIds.length > 0 && (
          <div data-popular-projects="" style={{ marginBottom: 48 }}>
            <div style={{
              fontSize: 11,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              opacity: 0.6,
              marginBottom: 18,
            }}>
              Most Viewed
            </div>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
            }}>
              {popularIds.map((id, i) => (
                <button
                  key={id}
                  type="button"
                  data-popular-series={id}
                  onClick={() => onOpenCaseStudy(id)}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 10,
                    background: "none",
                    border: "1px solid color-mix(in srgb, var(--fg) 40%, transparent)",
                    color: "var(--fg)",
                    cursor: "pointer",
                    padding: "9px 18px",
                    borderRadius: 999,
                    fontFamily: "var(--font-body)",
                    opacity: 0.85,
                    transition: "opacity 0.3s ease",
                  }}
                >
                  <span style={{
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    opacity: 0.5,
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-heading)",
                    fontStyle: "italic",
                    fontSize: 16,
                  }}>
                    {titleForSeries(id)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filter row */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 28,
          fontSize: 11,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          marginBottom: 48,
        }}>
          <button
            type="button"
            data-filter="all"
            onClick={() => setFilter("all")}
            style={{
              background: "none",
              border: "none",
              color: "var(--fg)",
              cursor: "pointer",
              padding: "0 0 6px",
              position: "relative",
              opacity: filter === "all" ? 1 : 0.55,
              transition: "opacity 0.3s ease",
            }}
          >
            All
            <span style={{
              position: "absolute", left: 0, right: 0, bottom: 0, height: 1,
              background: "var(--fg)",
              transform: filter === "all" ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: "left",
              transition: "transform 0.4s ease",
            }} />
          </button>
          {series.map((s) => (
            <button
              key={s}
              type="button"
              data-filter={s.toLowerCase()}
              onClick={() => setFilter(s)}
              style={{
                background: "none",
                border: "none",
                color: "var(--fg)",
                cursor: "pointer",
                padding: "0 0 6px",
                position: "relative",
                opacity: filter === s ? 1 : 0.55,
                transition: "opacity 0.3s ease",
              }}
            >
              {s}
              <span style={{
                position: "absolute", left: 0, right: 0, bottom: 0, height: 1,
                background: "var(--fg)",
                transform: filter === s ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left",
                transition: "transform 0.4s ease",
              }} />
            </button>
          ))}
        </div>

        {/* Tag chip row — cross-cutting, multi-select */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 14,
          fontSize: 11,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          marginBottom: 48,
        }}>
          {allTags.map((tag) => {
            const on = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                data-tag={tag}
                onClick={() => toggleTag(tag)}
                style={{
                  background: on ? "var(--fg)" : "none",
                  border: "1px solid color-mix(in srgb, var(--fg) 40%, transparent)",
                  color: on ? "var(--bg)" : "var(--fg)",
                  cursor: "pointer",
                  padding: "6px 14px",
                  borderRadius: 999,
                  opacity: on ? 1 : 0.5,
                  transition: "opacity 0.3s ease, background 0.3s ease, color 0.3s ease",
                }}
              >
                {tag}
              </button>
            );
          })}
          {selectedTags.length > 0 && (
            <button
              type="button"
              data-clear-tags=""
              onClick={() => setSelectedTags([])}
              style={{
                background: "none",
                border: "none",
                color: "var(--fg)",
                cursor: "pointer",
                padding: "6px 0",
                opacity: 0.7,
                textDecoration: "underline",
                textUnderlineOffset: 4,
              }}
            >
              Clear tags
            </button>
          )}
        </div>

        <div data-result-count={visible.length} style={{
          fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.55, marginBottom: 24,
        }}>
          {visible.length} {visible.length === 1 ? "Work" : "Works"}
        </div>

        {/* Grid of cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "3vw 2vw",
          paddingBottom: "6vw",
        }}>
          {visible.map((photo) => (
            <a
              key={photo.id}
              data-tags={photo.tags.join(" ")}
              href={`/case-studies/${photo.series.toLowerCase()}.html`}
              onClick={(e) => {
                e.preventDefault();
                onOpenCaseStudy(photo.series.toLowerCase());
              }}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                margin: 0,
                cursor: "pointer",
                textAlign: "left",
                color: "inherit",
                textDecoration: "none",
                fontFamily: "inherit",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{
                width: "100%",
                aspectRatio: photo.aspect === "portrait" ? "2 / 3" : "3 / 2",
                overflow: "hidden",
                background: "color-mix(in srgb, var(--fg) 6%, transparent)",
              }}>
                <img
                  src={photo.src}
                  srcSet={window.srcSetFor(photo)}
                  sizes="(max-width: 700px) 45vw, 22vw"
                  loading="lazy"
                  decoding="async"
                  alt={photo.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
              <div>
                <div style={{
                  fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.55, marginBottom: 4,
                }}>
                  {photo.series}
                </div>
                <div style={{
                  fontFamily: "var(--font-heading)",
                  fontStyle: "italic",
                  fontSize: 17,
                  opacity: 0.92,
                }}>
                  {photo.title}
                </div>
              </div>
            </a>
          ))}
        </div>

        {visible.length === 0 && (
          <div style={{
            padding: "10vh 0",
            textAlign: "center",
          }}>
            <div style={{
              fontFamily: "var(--font-heading)",
              fontStyle: "italic",
              fontSize: "clamp(22px, 3vw, 34px)",
              opacity: 0.85,
              marginBottom: 24,
            }}>
              Nothing in the archive matches these filters.
            </div>
            <button
              type="button"
              data-reset-filters=""
              onClick={() => { setFilter("all"); setSelectedTags([]); }}
              style={{
                background: "none",
                border: "1px solid color-mix(in srgb, var(--fg) 40%, transparent)",
                color: "var(--fg)",
                cursor: "pointer",
                padding: "8px 20px",
                borderRadius: 999,
                fontSize: 11,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
              }}
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

window.Gallery = Gallery;
