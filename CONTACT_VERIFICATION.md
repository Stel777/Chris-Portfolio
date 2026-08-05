# Contact form verification

## What was built (all at the project root)

- `contact_server.py`: standard-library-only backend (`http.server`, `json`, `smtplib`, `email`, `os`, `re`, `sys`, no third-party installs). Defines the pure `handle_contact(payload, mailer)` function, a `SmtpMailer` (real SMTP send from env vars), a `DryRunMailer` (records messages in memory), and a small HTTP handler for `POST /api/contact`. All live server startup is under `if __name__ == "__main__":`, so importing the module has no side effects.
- `test_contact.py`: forces a `DryRunMailer` and asserts the valid and invalid behaviors described below. Exits 0 on success, non-zero on any failed assertion.
- `contact.html`: standalone page, styled to match the existing site (same theme tokens, fonts, and field styling as `index.html` and `contact.jsx`). Contains `<form id="contact-form">` with `name` (required), `email` (required), `subject` (optional), and `message` (required) fields, a submit button, and the two initially hidden elements `#contact-confirmation` and `#contact-error`. Loads `contact-form.js` with `defer`.
- `contact-form.js`: intercepts the submit, validates client side, disables the button and sets its text to `Sending...`, posts JSON to `/api/contact` with `fetch`, reveals `#contact-confirmation` on an `res.ok` response, reveals `#contact-error` with the server error text on failure, resets the form on success, and always re-enables the button in a `finally` block.

## Behavior mapping (200 valid vs 400 invalid)

`handle_contact(payload, mailer)` strips `name`, `email`, `subject`, `message` and checks, in order:

1. `name` is empty after strip, return `(400, {"ok": False, "error": "name is required or invalid"})`, no mail sent.
2. `email` does not match `^[^@\s]+@[^@\s]+\.[^@\s]+$`, return `(400, {"ok": False, "error": "email is required or invalid"})`, no mail sent.
3. `message` is empty after strip, return `(400, {"ok": False, "error": "message is required or invalid"})`, no mail sent.
4. Otherwise return `(200, {"ok": True, "message": "..."})` after calling `mailer.send` exactly twice: first the owner notification (to `CONTACT_TO`, default `owner@example.com`, body carries name, email, subject, message), then the confirmation receipt addressed to `payload["email"]`.

| Input | Result | Mails recorded |
|---|---|---|
| name, valid email, subject, message all present | 200, ok True | 2 (owner, then submitter) |
| valid, subject omitted (subject is optional) | 200, ok True | 2 |
| name missing or blank whitespace | 400, "name is required or invalid" | 0 |
| email malformed (`ada@example`, no dot) | 400, "email is required or invalid" | 0 |
| email has no `@` (`adaexample.com`) | 400, "email is required or invalid" | 0 |
| message missing or blank whitespace | 400, "message is required or invalid" | 0 |

The owner notification is `sent[0]` (to the owner address) and the submitter confirmation is `sent[1]` (to the submitter's own email), so a valid submission emails the site owner and sends a receipt back to the submitter, exactly two messages.

## Reply-To

Both mail sends carry a Reply-To header so a reply lands with the right person without anyone re-typing an address. The owner notification (the first send, addressed to the studio owner) sets Reply-To to the submitter's own email, so hitting reply from the owner's inbox goes straight back to the person who wrote in. The confirmation receipt (the second send, addressed to the submitter) sets Reply-To to the studio owner address, so if the submitter replies to their own receipt it still reaches the studio. `SmtpMailer.send` and `DryRunMailer.send` both take a `reply_to` keyword argument; `SmtpMailer` sets the `Reply-To` header on the outgoing message when a value is given, and `DryRunMailer` records it under the `reply_to` key of each recorded send. This is enforced by `test_contact.py` and by the daily proof command.

## done_when status

1. `contact.html` exists at the project root with `<form id="contact-form">` containing name, email, message, and optional subject fields plus a submit button, and the initially hidden `#contact-confirmation` and `#contact-error` elements. Met, verified by reading the file.
2. `contact-form.js` exists at the project root, sends a JSON POST to `/api/contact` via `fetch`, disables the submit button while sending, reveals `#contact-confirmation` on a 200/ok response, and reveals `#contact-error` on failure. Met, verified by reading the file (contains the literal `/api/contact` and `fetch`).
3. `contact_server.py` defines a pure `handle_contact(payload, mailer)` that returns 400 and sends no mail when name, email, or message is missing, blank, or the email is malformed, and returns 200 with two mails on valid input. Met, verified by the static trace and behavior table above.
4. `contact_server.py` provides `SmtpMailer` (env-var SMTP send) and `DryRunMailer` (in-memory record), and all `HTTPServer` startup is under `if __name__ == "__main__":`. Met, verified by reading the file.
5. `python test_contact.py` exits 0 with valid input giving 200 and exactly two recorded emails, invalid input giving 400 with zero emails. Met, verified by a live run.
6. This file records the mapping of the 200 valid and 400 invalid behavior, and the Reply-To behavior above. Met, verified by reading the code and by the live test run.
