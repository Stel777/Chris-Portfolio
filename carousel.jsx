// Carousel — five layouts, scatter→position entrance animation,
// infinite horizontal scroll for the carousel layouts.

const { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } = React;

// ───────────────────────── deterministic scatter ────────────────────────────
// Per-photo random offsets used (a) for entrance scatter and (b) for the
// "scatter" layout itself. Seeded so they're stable across renders.
function seedRand(i, salt) {
  const s = Math.sin(i * 9301 + salt * 49297) * 233280;
  return s - Math.floor(s);
}
const SCATTER = window.PHOTOS.map((_, i) => ({
  // entrance scatter
  ex: (seedRand(i, 1) - 0.5) * 1600,
  ey: (seedRand(i, 2) - 0.5) * 900,
  er: (seedRand(i, 3) - 0.5) * 80,
  es: 0.5 + seedRand(i, 4) * 0.6,
  // free-scatter layout
  sx: (seedRand(i, 5) - 0.5) * 1400,
  sy: (seedRand(i, 6) - 0.5) * 480,
  sr: (seedRand(i, 7) - 0.5) * 18,
  sz: seedRand(i, 8) * 0.6 + 0.7,
}));

// ────────────────────────── layout maths ────────────────────────────────────
// `selected` = true when a photo has been clicked and locked-in to center.
// Selected mode: bigger centerpiece + neighbors are pushed outward to clear
// room for the metadata block on the right.
function layoutHorizontal(i, offset, N, _v, selected) {
  const spacing = 240;
  const total = N * spacing;
  let x = i * spacing - offset;
  x = ((x + total / 2) % total + total) % total - total / 2;
  const d = Math.abs(x);
  const sigma = selected ? 240 : 300;
  const peak = selected ? 2.15 : 1.85;
  const edge = 0.42;
  const k = Math.exp(-(d * d) / (2 * sigma * sigma));
  const scale = edge + (peak - edge) * k;
  const y = -14 * k;
  // Push neighbors outward when selected, to open visual breathing room
  let xOut = x;
  if (selected) {
    const pushSigma = 220;
    const push = 70 * Math.sign(x) * Math.exp(-(d * d) / (2 * pushSigma * pushSigma));
    xOut += push;
  }
  const z = Math.round(1000 - d);
  return { x: xOut, y, scale, rotate: 0, rotateY: 0, z, opacity: 1, scrollDelta: x };
}

function layoutIsometric(i, offset, N, _v, selected) {
  const spacing = 78;
  const total = N * spacing;
  let x = i * spacing - offset;
  x = ((x + total / 2) % total + total) % total - total / 2;
  const d = Math.abs(x);

  const sigma = 80;
  const k = Math.exp(-(d * d) / (2 * sigma * sigma));
  const baseRY = x > 0 ? -42 : 42;
  const rotateY = baseRY * (1 - k);
  const scale = (selected ? 0.55 : 0.55) + (selected ? 1.05 : 0.85) * k;
  const y = -20 * k;
  let xOut = x;
  if (selected) {
    const push = 90 * Math.sign(x) * Math.exp(-(d * d) / (2 * 120 * 120));
    xOut += push;
  }
  const z = Math.round(2000 - d);
  return { x: xOut, y, scale, rotate: 0, rotateY, z, opacity: 1, scrollDelta: x };
}

function layoutScatter(i, offset, N, _v, selected) {
  const spacing = 200;
  const total = N * spacing;
  let baseX = i * spacing - offset;
  baseX = ((baseX + total / 2) % total + total) % total - total / 2;
  const s = SCATTER[i];
  let x = baseX + s.sx * 0.35;
  let y = s.sy * 0.6;
  let scale = s.sz * 0.9;
  let rotate = s.sr;
  return { x, y, scale, rotate, rotateY: 0, z: Math.round(1000 + s.sz * 100), opacity: 1, scrollDelta: baseX };
}

// 3D Space — photos floating in depth. As you scroll, you fly forward through
// them; the closer they are the bigger they appear (via CSS perspective +
// translateZ on the parent). At the front-edge of the cycle they fade out and
// re-enter at the back, infinite loop.
function layout3DSpace(i, offset, N, _v, selected) {
  const spacing = 220;
  const total = N * spacing;
  let zRaw = i * spacing - offset;
  zRaw = ((zRaw + total / 2) % total + total) % total - total / 2;
  const absZ = Math.abs(zRaw);

  const s = SCATTER[i];
  // (x, y) jitter — photos drift in the camera plane so it feels like space
  const x = s.sx * 0.7;
  const y = s.sy * 0.85;

  // Triangular tZ mapping: peak (closest) at zRaw=0, far at extremes.
  // Selected mode pushes the centered photo even closer.
  const peakTZ = selected ? 700 : 420;
  const farTZ  = -1500;
  const t = 1 - absZ / (total / 2);
  const tZ = farTZ + (peakTZ - farTZ) * t;

  // Fade at the wrap edges (smooth, sharp falloff)
  const opacity = Math.pow(t, 1.4);

  // Slight rotation for life
  const rotateY = s.sr * 0.6;

  // z-index for proper stacking (closer = on top)
  const z = Math.round(3000 + tZ);

  return { x, y, scale: 1, rotate: 0, rotateY, translateZ: tZ, z, opacity, scrollDelta: zRaw };
}

function layoutGrid(i, _offset, _N, vScroll, _selected) {
  const cols = 4;
  const gap = 36;
  const cellW = 280;
  const cellH = 360;
  const col = i % cols;
  const row = Math.floor(i / cols);
  const gridW = cols * cellW + (cols - 1) * gap;
  const x = -gridW / 2 + col * (cellW + gap) + cellW / 2;
  const y = row * (cellH + gap) - 200 - vScroll;
  return { x, y, scale: 1, rotate: 0, rotateY: 0, z: 1, opacity: 1, fixedSize: { w: cellW, h: cellH }, scrollDelta: 0 };
}

function layoutFilmstrip(i, _offset, N, vScroll, _selected) {
  const spacing = 460;
  const total = N * spacing;
  let y = i * spacing - vScroll;
  y = ((y + total / 2) % total + total) % total - total / 2;
  const d = Math.abs(y);
  const sigma = 260;
  const k = Math.exp(-(d * d) / (2 * sigma * sigma));
  const scale = 0.55 + 0.7 * k;
  const x = 18 * k;
  return { x, y, scale, rotate: 0, rotateY: 0, z: Math.round(1000 - d), opacity: 1, scrollDelta: y };
}

function getLayoutFn(id) {
  switch (id) {
    case "3dspace":   return layout3DSpace;
    case "isometric": return layoutIsometric;
    case "grid":      return layoutGrid;
    case "scatter":   return layoutScatter;
    case "filmstrip": return layoutFilmstrip;
    default:          return layoutHorizontal;
  }
}

// ─────────────────────── single photo card ──────────────────────────────────
// Always renders at the LAYOUT pose. The entrance animation is run via
// element.animate() (Web Animations API) imperatively from the parent, which
// composites on top of the inline transform — bypassing React's batched
// render cycle that was previously preventing the init pose from painting.
function PhotoCard({ photo, t, active, dim, registerRef }) {
  const tZ = t.translateZ || 0;
  const transform =
    `translate3d(${t.x}px, ${t.y}px, ${tZ}px) ` +
    `rotateY(${t.rotateY || 0}deg) ` +
    `rotate(${t.rotate || 0}deg) ` +
    `scale(${t.scale})`;

  // Photo aspect → base box
  const base = photo.aspect === "portrait"
    ? { w: 210, h: 280 }
    : { w: 280, h: 210 };
  const w = t.fixedSize ? t.fixedSize.w : base.w;
  const h = t.fixedSize ? t.fixedSize.h : base.h;

  return (
    <div
      className="photo-card"
      ref={(el) => registerRef(photo.id, el)}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: w,
        height: h,
        marginLeft: -w / 2,
        marginTop: -h / 2,
        transform,
        opacity: dim ? 0.22 : t.opacity,
        zIndex: t.z,
        transition: "opacity 0.4s ease",
        willChange: "transform, opacity",
        transformStyle: "preserve-3d",
        boxShadow: active
          ? "0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)"
          : "0 18px 40px rgba(0,0,0,0.45)",
      }}
      data-photo-id={photo.id}
    >
      <img
        src={photo.src}
        srcSet={window.srcSetFor(photo)}
        sizes="(max-width: 700px) 90vw, 40vw"
        alt={photo.title}
        loading="lazy"
        decoding="async"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </div>
  );
}

// ─────────────────────── main Carousel ──────────────────────────────────────
function Carousel({ layout, photos, animation, speed, replayToken }) {
  const N = photos.length;
  // "phase" still gates input — block scroll/click during the entrance.
  // The actual entrance is driven by element.animate() imperatively, NOT by
  // React renders.
  const [phase, setPhase] = useState("entering");
  const [selectedId, setSelectedId] = useState(null);

  // All scroll state lives in refs so input is coalesced into a single RAF
  // render per frame — wheel/drag/keyboard don't each trigger their own
  // setState, which is what caused the "frames together" jitter.
  const offsetRef    = useRef(0);
  const vScrollRef   = useRef(0);
  const velocityRef  = useRef(0);
  const pendingRef   = useRef(0);
  const targetXRef   = useRef(null);
  const targetYRef   = useRef(null);

  // Render-trigger counter (one tick per frame).
  const [, setTick] = useState(0);

  const containerRef = useRef(null);
  const dragging     = useRef(null);

  // Map<photoId, HTMLDivElement> — registered by PhotoCard via callback ref.
  const cardRefs = useRef(new Map());
  const registerRef = useCallback((id, el) => {
    if (el) cardRefs.current.set(id, el);
    else cardRefs.current.delete(id);
  }, []);

  const isVertLayout = layout === "filmstrip" || layout === "grid";
  const selectableLayout = layout !== "grid";

  // Drop any selection when layout changes
  useEffect(() => {
    setSelectedId(null);
    targetXRef.current = null;
    targetYRef.current = null;
  }, [layout]);

  // ─── ENTRANCE (Web Animations API, imperative) ────────────────────────────
  // We need the browser to paint the init pose before the layout pose so the
  // transition has something to tween from. React's batched state updates
  // make that nearly impossible to do via setState + transitions. The Web
  // Animations API solves it: el.animate([init, final], {fill:"both"}) applies
  // the first keyframe synchronously and composites the animation on top of
  // inline styles. No paint-timing dance required.
  useLayoutEffect(() => {
    // Reset scroll state so the layout pose target is offset 0
    offsetRef.current = 0;
    vScrollRef.current = 0;
    velocityRef.current = 0;
    pendingRef.current = 0;
    targetXRef.current = null;
    targetYRef.current = null;
    setSelectedId(null);
    setPhase("entering");
    // Force a synchronous re-render so cards are positioned at offset=0
    setTick(t => (t + 1) & 0xffff);

    const fn = getLayoutFn(layout);

    // Cancel any previously running entrance animations on these cards
    for (const [, el] of cardRefs.current) {
      if (!el || !el.getAnimations) continue;
      el.getAnimations().forEach(a => a.cancel());
    }

    // Kick off fresh per-card animations
    for (const [id, el] of cardRefs.current) {
      if (!el || !el.animate) continue;
      const init = animation.init(id, N);
      const pos  = fn(id, 0, N, 0, false);
      const cardDelay = Math.round(init.delay * speed * 0.6);
      const cardDur   = Math.round(speed * 0.85);

      const initT  =
        `translate3d(${init.x}px, ${init.y}px, 0) ` +
        `rotateY(${init.rotateY || 0}deg) ` +
        `rotate(${init.rotate || 0}deg) ` +
        `scale(${init.scale})`;
      const finalT =
        `translate3d(${pos.x}px, ${pos.y}px, ${pos.translateZ || 0}px) ` +
        `rotateY(${pos.rotateY || 0}deg) ` +
        `rotate(${pos.rotate || 0}deg) ` +
        `scale(${pos.scale})`;

      el.animate(
        [
          { transform: initT,  opacity: init.opacity },
          { transform: finalT, opacity: pos.opacity },
        ],
        {
          duration: cardDur,
          delay: cardDelay,
          easing: animation.ease,
          fill: "both",
        }
      );
    }

    // After the entrance, cancel WAAPI animations to release control back to
    // inline styles (which are already at the final layout pose) and flip to
    // "live" so input is accepted again.
    const handoff = setTimeout(() => {
      for (const [, el] of cardRefs.current) {
        if (!el || !el.getAnimations) continue;
        el.getAnimations().forEach(a => a.cancel());
      }
      setPhase("live");
      setTick(t => (t + 1) & 0xffff);
    }, speed + 200);

    return () => clearTimeout(handoff);
  }, [animation, speed, replayToken, layout, N]);

  // ─────── single RAF loop: applies pending input, lerps to target, decays inertia ───────
  useEffect(() => {
    let raf;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(now - last, 64);  // clamp huge frames
      last = now;
      const frameScale = dt / 16.67;        // 1.0 at 60fps

      let changed = false;

      if (!dragging.current) {
        // 1) flush wheel/keyboard pending delta
        if (pendingRef.current !== 0) {
          const p = pendingRef.current;
          pendingRef.current = 0;
          if (isVertLayout) vScrollRef.current += p;
          else              offsetRef.current  += p;
          changed = true;
        }
        // 2) lerp to target if any
        if (targetXRef.current != null && !isVertLayout) {
          const diff = targetXRef.current - offsetRef.current;
          if (Math.abs(diff) < 0.4) {
            offsetRef.current = targetXRef.current;
            targetXRef.current = null;
          } else {
            offsetRef.current += diff * (1 - Math.pow(0.78, frameScale));
          }
          changed = true;
        } else if (targetYRef.current != null && isVertLayout) {
          const diff = targetYRef.current - vScrollRef.current;
          if (Math.abs(diff) < 0.4) {
            vScrollRef.current = targetYRef.current;
            targetYRef.current = null;
          } else {
            vScrollRef.current += diff * (1 - Math.pow(0.78, frameScale));
          }
          changed = true;
        } else if (Math.abs(velocityRef.current) > 0.05) {
          // 3) decay inertia
          if (isVertLayout) vScrollRef.current += velocityRef.current * frameScale;
          else              offsetRef.current  += velocityRef.current * frameScale;
          velocityRef.current *= Math.pow(0.88, frameScale);
          changed = true;
        } else if (velocityRef.current !== 0) {
          velocityRef.current = 0;
        }
      }

      if (changed || dragging.current) setTick(t => (t + 1) & 0xffff);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isVertLayout]);

  const releaseSelection = () => {
    if (selectedId != null) setSelectedId(null);
    targetXRef.current = null;
    targetYRef.current = null;
  };

  // Wheel — accumulate into pendingRef; RAF applies it.
  // Multiplier tuned to feel quick but readable.
  const onWheel = useCallback((e) => {
    if (phase !== "live") return;
    e.preventDefault();
    releaseSelection();
    const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    const delta = raw * 0.55;
    pendingRef.current += delta;
    // light glide on top so it keeps coasting after the wheel stops
    velocityRef.current = velocityRef.current * 0.6 + delta * 0.08;
    velocityRef.current = Math.max(-32, Math.min(32, velocityRef.current));
  }, [layout, phase, selectedId]);

  // ───── Pointer drag ─────
  const DRAG_THRESHOLD = 5;

  const onPointerDown = (e) => {
    if (phase !== "live") return;
    if (e.button !== undefined && e.button !== 0) return;
    const now = performance.now();
    dragging.current = {
      x: e.clientX, y: e.clientY,
      startOffset: offsetRef.current, startV: vScrollRef.current,
      moved: 0, panning: false,
      prevX: e.clientX, prevY: e.clientY, prevT: now,
      vx: 0, vy: 0,
      target: e.target,
    };
    velocityRef.current = 0;  // stop inertia
    containerRef.current?.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    const d = dragging.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    const dist = Math.hypot(dx, dy);
    if (dist > d.moved) d.moved = dist;
    if (!d.panning && dist < DRAG_THRESHOLD) return;
    if (!d.panning) releaseSelection();
    d.panning = true;

    const now = performance.now();
    const tDt = Math.max(now - d.prevT, 1);
    d.vx = (e.clientX - d.prevX) / tDt;
    d.vy = (e.clientY - d.prevY) / tDt;
    d.prevX = e.clientX; d.prevY = e.clientY; d.prevT = now;

    const adjX = dx - Math.sign(dx) * DRAG_THRESHOLD;
    const adjY = dy - Math.sign(dy) * DRAG_THRESHOLD;
    if (isVertLayout) vScrollRef.current = d.startV - adjY;
    else              offsetRef.current  = d.startOffset - adjX;
    setTick(t => (t + 1) & 0xffff);
  };

  const onPointerUp = (e) => {
    const d = dragging.current;
    if (!d) return;
    dragging.current = null;

    if (!d.panning) {
      // Tap on a photo → bring it to center and show its metadata
      if (!selectableLayout) return;
      const target = (e.target.closest?.("[data-photo-id]")) ||
                     (d.target.closest?.("[data-photo-id]"));
      if (!target) return;
      const id = parseInt(target.getAttribute("data-photo-id"), 10);
      if (!Number.isFinite(id)) return;

      // Where is that card right now? Each layout fn returns `scrollDelta` =
      // the amount we need to add to the current scroll offset to bring this
      // photo to the centerpiece position. Wrap-aware automatically.
      const fn = getLayoutFn(layout);
      const pos = fn(id, offsetRef.current, N, vScrollRef.current, selectedId === id);
      const delta = pos.scrollDelta ?? 0;
      if (isVertLayout) targetYRef.current = vScrollRef.current + delta;
      else              targetXRef.current = offsetRef.current  + delta;
      velocityRef.current = 0;
      setSelectedId(id);
      return;
    }

    // Drag release → momentum
    const v = -(isVertLayout ? d.vy : d.vx) * 16;
    velocityRef.current = Math.max(-40, Math.min(40, v));
  };

  // Keyboard arrows
  useEffect(() => {
    const onKey = (e) => {
      if (phase !== "live") return;
      const step = 60;
      if (e.key === "ArrowRight") { releaseSelection(); pendingRef.current += step; }
      if (e.key === "ArrowLeft")  { releaseSelection(); pendingRef.current -= step; }
      if (e.key === "ArrowDown" && isVertLayout) { releaseSelection(); pendingRef.current += step; }
      if (e.key === "ArrowUp" && isVertLayout)   { releaseSelection(); pendingRef.current -= step; }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [layout, phase, selectedId, isVertLayout]);

  // ─────── compute positions ───────
  const layoutFn = getLayoutFn(layout);
  const offset   = offsetRef.current;
  const vScroll  = vScrollRef.current;
  const positions = photos.map((_, i) =>
    layoutFn(i, offset, N, vScroll, selectedId === i)
  );

  // Centerpiece (closest to origin)
  let centerIdx = -1;
  if (layout !== "grid") {
    let bestD = Infinity;
    positions.forEach((p, i) => {
      const d = isVertLayout ? Math.abs(p.y) : Math.abs(p.x) + Math.abs(p.y) * 0.4;
      if (d < bestD) { bestD = d; centerIdx = i; }
    });
  }
  const focusIdx = selectedId != null ? selectedId : centerIdx;

  // When a card is selected, shift the whole strip leftward to make room
  // for the metadata panel on the right.
  const groupShiftX = (selectedId != null && !isVertLayout && layout !== "scatter") ? -220 : 0;
  const groupShiftScatter = (selectedId != null && layout === "scatter") ? -240 : 0;

  return (
    <div
      ref={containerRef}
      className={"carousel carousel-" + layout}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        position: "absolute",
        inset: 0,
        perspective: "1600px",
        cursor: dragging.current ? "grabbing" : "grab",
        touchAction: "none",
      }}
    >
      <div
        style={{
          position: "absolute", inset: 0,
          transform: `translateX(${groupShiftX + groupShiftScatter}px)`,
          transition: "transform 0.7s cubic-bezier(0.2,0.8,0.2,1)",
          transformStyle: "preserve-3d",
        }}
      >
        {photos.map((p, i) => (
          <PhotoCard
            key={p.id}
            photo={p}
            t={positions[i]}
            active={i === focusIdx}
            dim={selectedId != null && selectedId !== p.id}
            registerRef={registerRef}
          />
        ))}
      </div>

      {phase === "live" && focusIdx >= 0 && (
        <CenterReadout
          photo={photos[focusIdx]}
          layout={layout}
          selected={selectedId != null}
          onDismiss={() => releaseSelection()}
        />
      )}
    </div>
  );
}

function CenterReadout({ photo, layout, selected, onDismiss }) {
  // Two modes:
  //   "live"  — small caption tucked under the centerpiece (default)
  //   "selected" — full metadata block to the right of the centerpiece
  if (selected) {
    return (
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translateY(-50%)",
          marginLeft: 200,    // sit just to the right of the enlarged centerpiece
          maxWidth: 320,
          color: "var(--fg)",
          pointerEvents: "auto",
          animation: "readout-in 0.5s 0.15s ease both",
        }}
      >
        <div style={{
          fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", opacity: 0.55, marginBottom: 14,
        }}>
          No. {String(photo.id + 1).padStart(2, "0")} / {String(40).padStart(2, "0")}
        </div>
        <div style={{
          fontFamily: "var(--font-heading)",
          fontStyle: "italic",
          fontSize: 38,
          lineHeight: 1.05,
          letterSpacing: "-0.01em",
          marginBottom: 22,
          textWrap: "pretty",
        }}>
          {photo.title}
        </div>
        <div style={{
          fontSize: 13,
          lineHeight: 1.55,
          opacity: 0.85,
          marginBottom: 24,
          textWrap: "pretty",
        }}>
          {photo.desc}
        </div>
        <div style={{
          display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 18px",
          fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", opacity: 0.65,
        }}>
          <div style={{ opacity: 0.55 }}>Series</div><div>{photo.series}</div>
          <div style={{ opacity: 0.55 }}>Made</div><div>{photo.location} · {photo.year}</div>
          <div style={{ opacity: 0.55 }}>Format</div><div>{photo.aspect === "portrait" ? "Portrait" : "Landscape"} · Silver gelatin</div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          style={{
            marginTop: 26,
            fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase",
            opacity: 0.6, color: "var(--fg)",
            borderBottom: "1px solid color-mix(in srgb, var(--fg) 30%, transparent)",
            paddingBottom: 4,
          }}
        >
          ← Back to carousel
        </button>
      </div>
    );
  }

  // default: small caption below the centerpiece
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: layout === "filmstrip" ? "calc(50% + 200px)" : "calc(50% + 240px)",
        transform: "translateX(-50%)",
        textAlign: "center",
        pointerEvents: "none",
        opacity: 0.78,
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.35em",
        color: "var(--fg)",
        transition: "opacity 0.4s ease",
      }}
    >
      <div style={{
        fontStyle: "italic", letterSpacing: "0.05em", textTransform: "none",
        fontSize: 18, marginBottom: 8, fontFamily: "var(--font-heading)",
      }}>
        {photo.title}
      </div>
      <div>{photo.series} · {photo.year} · No. {String(photo.id + 1).padStart(2, "0")}</div>
    </div>
  );
}

window.Carousel = Carousel;
