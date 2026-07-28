(function () {
  "use strict";

  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  document.documentElement.classList.add("reveal-ready");

  function start() {
    var targets = document.querySelectorAll("main .cover, main h1, main .meta-row, .sections section");

    if (!("IntersectionObserver" in window)) {
      for (var i = 0; i < targets.length; i++) {
        targets[i].classList.add("is-visible");
      }
      return;
    }

    var io = new IntersectionObserver(function (entries, obs) {
      for (var j = 0; j < entries.length; j++) {
        var entry = entries[j];
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      }
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

    for (var k = 0; k < targets.length; k++) {
      targets[k].style.transitionDelay = (Math.min(k, 6) * 60) + "ms";
      io.observe(targets[k]);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
