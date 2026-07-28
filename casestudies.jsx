// Case studies — one write-up per series, plus the full-screen reader panel.
// Layered above the Gallery panel (zIndex 40), so this sits at 42.

const CASE_STUDIES = [
  {
    id: "field",
    series: "Field",
    title: "Five Horizons",
    year: "2019-2023",
    cover: "https://picsum.photos/seed/chrisp0/800/1200",
    problem: [
      "Landscape work this slow resists the usual deadlines. I wanted five places that shared nothing geographically, Alentejo, Hokkaido, Skane, Cumbria, Aosta, but might answer the same question about light and distance if I gave each enough time.",
      "The risk was obvious. Five unrelated places could just as easily read as five unrelated postcards. What I was actually testing was whether distance itself, the plain act of standing well back from a subject, could carry across a continent and still feel like one voice.",
    ],
    process: [
      "Colour negative, medium format, one roll a day at most. No cropping was allowed once a frame was chosen, so the walk to the vantage point became part of the exposure itself. Prints were made large from the start, so mistakes in the field had nowhere to hide.",
      "In practice that meant most days produced nothing. A frame was only committed once the vantage point, the walk to it, and the hour of light all agreed, and if they never agreed I went home with the roll unfinished. Over four years the five locations took roughly thirty visits between them.",
    ],
    outcome: [
      "The five bodies of work were eventually shown as a single continuous line around a room, no captions until the far wall. Viewers kept trying to guess which country was which and getting it wrong, which felt like the right result.",
      "The prints now travel as a set and are never split for sale, which the studio initially resisted and later understood. Alentejo and Aosta, the two driest sites, turned out to anchor the sequence, and I have come to think the work is really about air rather than land.",
    ],
  },
  {
    id: "interior",
    series: "Interior",
    title: "Rooms Before Waking",
    year: "2017-2021",
    cover: "https://picsum.photos/seed/chrisp1/1200/800",
    problem: [
      "I kept noticing that the domestic spaces I loved most, in Lisbon, Berlin, Kyoto, Reykjavik, Antwerp, only looked like themselves for a narrow window after dawn, before anyone had moved through them and reset the light.",
      "By mid-morning these rooms became ordinary again, useful and lived-in and photographically dead. The window I cared about, maybe twenty minutes, closed the instant someone opened a curtain or filled a kettle, so the whole project depended on being set up and silent before the household stirred.",
    ],
    process: [
      "Access was arranged the night before and the shoot itself never ran past forty minutes. No people were allowed in frame, not even the person who lived there, so the rooms had to hold their own attention without a figure to anchor them.",
      "Everything was decided in advance so the morning held no choices. Tripod placed, exposure metered off a grey card left on the table, one focal length for the entire series so the rooms could be compared rather than dramatised. When the light arrived I made between three and six frames and then left before anyone reached the kitchen.",
    ],
    outcome: [
      "The series became a study of absence read as evidence of habit, an unmade bed, a coffee cup rinsed but not dried. Several sitters said the photographs of their own homes felt unfamiliar, which I have come to take as the highest compliment this project can earn.",
      "Reykjavik and Kyoto produced the quietest results, both cities where dawn is slow enough to photograph without hurrying. The work has since been hung as a grid rather than a sequence, so the empty rooms answer each other across the wall, and more than one owner has asked for the print of a home they no longer live in.",
    ],
  },
  {
    id: "portrait",
    series: "Portrait",
    title: "One Cigarette",
    year: "2020-2024",
    cover: "https://picsum.photos/seed/chrisp2/1200/800",
    problem: [
      "Formal portraiture tends to collapse the moment someone realizes they are being watched carefully. I wanted a method where the sitter stayed present in the room but was never told when the exposure actually began.",
      "Directing a sitter usually produces a performance of being photographed rather than a person, and stealing images felt dishonest in the other direction. The method had to keep the sitter fully aware they were being photographed while removing the single fact that stiffens everyone, the knowledge of exactly when.",
    ],
    process: [
      "Each sitting, across Studio Cais in Lisbon, Studio 7 in Berlin, on location in Porto, a sitter's home in Paris, was timed to the length of one shared cigarette, smoked together, unhurried. The shutter opened somewhere inside that span, never announced.",
      "The cigarette set the clock. We talked, or did not, for the length of it, and somewhere inside that span a long exposure opened without any signal from me. Because the sitting had a natural end, no one held a pose, and the slight movement across a slow frame did the softening that studio lighting usually fakes.",
    ],
    outcome: [
      "What came back was softer and stranger than posed work, faces mid-thought rather than mid-performance. A few sitters asked, afterward, which exact moment had been kept, and I never told any of them.",
      "Roughly one sitting in three yielded a frame worth keeping, which is a poor hit rate and, I think, the point. The Porto sittings, made outdoors in flat coastal light, remain the strongest, and the series has been the work most often mistaken for film stills, which suits it.",
    ],
  },
  {
    id: "landscape",
    series: "Landscape",
    title: "Eight Mornings, One Line",
    year: "2018-2022",
    cover: "https://picsum.photos/seed/chrisp3/800/1200",
    problem: [
      "A single horizon rarely holds enough information on its own. I wanted to see what happened if the same coastline, from the North Atlantic to the inland sea off Honshu, was read as a sequence rather than a picture.",
      "A photograph of the sea tends to freeze one accident of weather and call it the place, which felt like a lie about somewhere that never holds still. I wanted a single image that admitted time into it, so the horizon on the left and the horizon on the right could belong to different mornings and still be honestly the same coast.",
    ],
    process: [
      "Eight exposures were made on eight consecutive mornings from a fixed position, then sequenced edge to edge into one continuous frame, tide, weather and light all shifting slightly between segments while the camera never moved.",
      "The camera stayed clamped in one position for eight days, covered overnight, and I returned each morning to make a single exposure regardless of conditions. The eight strips were then joined edge to edge in the order they were shot, with no blending across the joins, so the seams stay visible to anyone who looks closely.",
    ],
    outcome: [
      "The finished pieces read at a distance as a single unbroken sky before the seams declare themselves up close. Cape Saint Vincent and the Outer Hebrides ended up as the two strongest results, both places where the weather refused to repeat itself twice.",
      "From across a room the pieces read as one calm sky, and up close they break into eight distinct weathers, which is the double reading I was after. The Cape Saint Vincent and Outer Hebrides runs gave the most restless eight-day stretches and became the two prints I still show first.",
    ],
  },
  {
    id: "studio",
    series: "Studio",
    title: "Working Negatives",
    year: "2015-2024",
    cover: "https://picsum.photos/seed/chrisp4/1200/800",
    problem: [
      "Nine years of studio sessions, at Studio Cais, Studio 7, and an atelier in Antwerp, left an archive of tests, rejects and half-built tableaux that never left the contact sheet. I wanted to know if the mistakes were worth showing on their own terms.",
      "A portfolio is usually the decisions a photographer wants remembered. I was more curious about the evidence around those decisions, the light tests and half-built sets and frames abandoned halfway, and whether that residue held together as a body of work rather than as apology.",
    ],
    process: [
      "Negatives were pulled without regard for which shoot they belonged to, light tests sitting beside abandoned set-ups and outtakes from paid commissions. Nothing was restaged. Dust, double exposures and blown highlights stayed in the final prints.",
      "Selection ignored provenance entirely. A calibration frame from a paid commission might sit beside a personal outtake made years apart, chosen only because the two negatives argued with each other. Nothing was reshot or cleaned, so fogging and blown highlights were printed exactly as the negative carried them.",
    ],
    outcome: [
      "The resulting archive reads less like a portfolio and more like a studio floor swept into frames, evidence of decisions rather than the decisions themselves. It has since become the body of work other photographers ask about most.",
      "Shown together, the frames describe a way of working rather than any finished picture, which is why other photographers tend to respond to it most. The Antwerp atelier material, the roughest of the three sources, ended up carrying the series, and it is now the work I am asked to talk about more than any polished set.",
    ],
  },
];

function coverSrcSet(cover) {
  const m = cover.match(/\/(\d+)\/(\d+)$/);
  if (!m) return undefined;
  const w = parseInt(m[1], 10);
  const h = parseInt(m[2], 10);
  const ratio = h / w;
  return [1, 2]
    .map((scale) => {
      const sw = w * scale;
      const sh = Math.round(sw * ratio);
      return `${cover.replace(/\/\d+\/\d+$/, `/${sw}/${sh}`)} ${sw}w`;
    })
    .join(", ");
}

function CaseStudy({ study, onClose, open }) {
  if (!study) return null;

  const paraStyle = { margin: 0, fontSize: 16, lineHeight: 1.6, opacity: 0.88, textWrap: "pretty" };
  const renderParas = (value) =>
    (Array.isArray(value) ? value : [value]).map((text, i) => (
      <p key={i} style={i === 0 ? paraStyle : { ...paraStyle, marginTop: 14 }}>
        {text}
      </p>
    ));

  return (
    <div
      aria-hidden={!open}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 42,
        pointerEvents: open ? "auto" : "none",
        opacity: open ? 1 : 0,
        transition: "opacity 0.5s ease",
        background: "color-mix(in srgb, var(--bg) 96%, #000 4%)",
        color: "var(--fg)",
        overflowY: "auto",
        padding: "calc(96px + 4vw) 6vw 6vw",
        fontFamily: "var(--font-body)",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "fixed",
          top: 38,
          right: 130,
          zIndex: 61,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--fg)",
          fontFamily: "var(--font-body)",
          fontSize: 11,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          opacity: 0.6,
          padding: 0,
        }}
      >
        Close
      </button>

      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            opacity: 0.6,
            marginBottom: 20,
          }}
        >
          Case Study / {study.series}
        </div>

        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 400,
            fontStyle: "italic",
            fontSize: "clamp(40px, 5.5vw, 84px)",
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
            margin: "0 0 18px",
            textWrap: "pretty",
          }}
        >
          {study.title}
        </h1>

        <div
          style={{
            display: "flex",
            gap: 28,
            fontSize: 11,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            opacity: 0.7,
            marginBottom: 48,
          }}
        >
          <div>
            <div style={{ opacity: 0.5, marginBottom: 6 }}>Series</div>
            <div>{study.series}</div>
          </div>
          <div>
            <div style={{ opacity: 0.5, marginBottom: 6 }}>Years</div>
            <div>{study.year}</div>
          </div>
        </div>

        <img
          src={study.cover}
          srcSet={coverSrcSet(study.cover)}
          sizes="(max-width: 900px) 100vw, 920px"
          alt={study.title}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          style={{
            width: "100%",
            aspectRatio: study.cover.includes("/800/1200") ? "2 / 3" : "3 / 2",
            maxHeight: "60vh",
            objectFit: "cover",
            display: "block",
            marginBottom: 56,
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4vw 6vw",
            maxWidth: 820,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                opacity: 0.5,
                marginBottom: 10,
              }}
            >
              Problem
            </div>
            {renderParas(study.problem)}
          </div>

          <div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                opacity: 0.5,
                marginBottom: 10,
              }}
            >
              Process
            </div>
            {renderParas(study.process)}
          </div>

          <div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                opacity: 0.5,
                marginBottom: 10,
              }}
            >
              Outcome
            </div>
            {renderParas(study.outcome)}
          </div>
        </div>
      </div>
    </div>
  );
}

window.CASE_STUDIES = CASE_STUDIES;
window.CaseStudy = CaseStudy;
