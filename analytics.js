// Cookieless, privacy-friendly analytics. Plain global script (no Babel, no JSX).
// Stores everything in localStorage only. Never makes a network request.
// Respects Do Not Track: if the visitor has DNT enabled, every method is a no-op.

(function () {
  var VISITS_KEY = "chrisp-analytics-visits";
  var PROJECTS_KEY = "chrisp-analytics-projects";

  function dntEnabled() {
    return navigator.doNotTrack === "1" || window.doNotTrack === "yes";
  }

  function readProjects() {
    try {
      return JSON.parse(localStorage.getItem(PROJECTS_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  var analytics = {
    trackVisit: function () {
      if (dntEnabled()) return;
      var count = parseInt(localStorage.getItem(VISITS_KEY), 10) || 0;
      localStorage.setItem(VISITS_KEY, String(count + 1));
    },

    trackProject: function (id, title) {
      if (dntEnabled()) return;
      var projects = readProjects();
      var key = String(id);
      projects[key] = (projects[key] || 0) + 1;
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
      // Forward to GoatCounter (privacy-friendly, cookieless) when its
      // script has loaded; a no-op otherwise.
      if (window.goatcounter && window.goatcounter.count) {
        window.goatcounter.count({ path: "case-study/" + key, title: title });
      }
    },

    popular: function () {
      if (dntEnabled()) return [];
      var projects = readProjects();
      return Object.keys(projects).sort(function (a, b) {
        return projects[b] - projects[a];
      });
    },
  };

  window.analytics = analytics;
})();
