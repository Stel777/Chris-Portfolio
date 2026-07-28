// Client-side handler for the standalone contact page. Validates the fields,
// posts them as JSON to /api/contact, and reveals a confirmation or an error
// based on the server response. Written in plain browser JavaScript, no build
// step, to match the rest of this site.

document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("contact-form");
  if (!form) return;

  var confirmation = document.getElementById("contact-confirmation");
  var errorBox = document.getElementById("contact-error");
  var button = form.querySelector('button[type="submit"]');
  var defaultButtonText = button ? button.textContent : "Send";

  // A basic pattern: something, an @, something, a dot, something. Mirrors the
  // server's check so obviously-bad addresses are caught before the request.
  var emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  function showError(text) {
    if (errorBox) {
      errorBox.textContent = text;
      errorBox.hidden = false;
    }
    if (confirmation) confirmation.hidden = true;
  }

  function showConfirmation() {
    if (confirmation) confirmation.hidden = false;
    if (errorBox) errorBox.hidden = true;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var name = (form.elements["name"].value || "").trim();
    var email = (form.elements["email"].value || "").trim();
    var subject = form.elements["subject"] ? (form.elements["subject"].value || "").trim() : "";
    var message = (form.elements["message"].value || "").trim();

    // Client-side validation before we bother the server.
    if (!name) {
      showError("Please enter your name.");
      return;
    }
    if (!emailPattern.test(email)) {
      showError("Please enter a valid email address.");
      return;
    }
    if (!message) {
      showError("Please enter a message.");
      return;
    }

    var payload = { name: name, email: email, subject: subject, message: message };

    if (button) {
      button.disabled = true;
      button.textContent = "Sending...";
    }

    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        if (res.ok) {
          showConfirmation();
          form.reset();
          return;
        }
        // Try to surface the server's error text, fall back to a generic one.
        return res
          .json()
          .then(function (data) {
            showError((data && data.error) || "Something went wrong. Please try again.");
          })
          .catch(function () {
            showError("Something went wrong. Please try again.");
          });
      })
      .catch(function () {
        showError("Could not reach the server. Please try again in a moment.");
      })
      .finally(function () {
        if (button) {
          button.disabled = false;
          button.textContent = defaultButtonText;
        }
      });
  });
});
