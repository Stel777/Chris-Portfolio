// Background — renders the active background option.
// Solid / gradient / textured / custom upload (image or video).

function Background({ bg, custom }) {
  // custom takes priority if set
  if (custom && custom.url) {
    if (custom.kind === "video") {
      return (
        <video
          className="bg-layer"
          src={custom.url}
          autoPlay muted loop playsInline
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      );
    }
    return (
      <div
        className="bg-layer"
        style={{
          backgroundImage: `url(${custom.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
    );
  }

  const klass =
    bg.kind === "noise" ? "bg-layer bg-noise" :
    bg.kind === "grid"  ? "bg-layer bg-grid"  :
    bg.kind === "dots"  ? "bg-layer bg-dots"  :
    bg.kind === "lines" ? "bg-layer bg-lines" :
    "bg-layer";

  return (
    <div
      className={klass}
      style={{
        background: bg.css,
      }}
    />
  );
}

window.Background = Background;
