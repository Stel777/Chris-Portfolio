"""Self-contained, standard-library-only contact form backend for the Chris
Portfolio site.

Two pieces live here:

1. handle_contact(payload, mailer): a pure function that validates a submission
   and, on valid input, sends exactly two mails through the given mailer, a
   notification to the site owner and a confirmation receipt back to the
   submitter. It never talks to the network itself, it only calls mailer.send,
   which makes it trivial to test with a DryRunMailer.

2. A tiny http.server handler that parses POST /api/contact as JSON, runs it
   through handle_contact with a real SmtpMailer, and returns the JSON result.

Everything that starts a live server is under `if __name__ == "__main__":` so
importing this module (as the tests do) has no side effects.

Only the standard library is used: http.server, json, smtplib, email, os, re,
sys.
"""

import json
import os
import re
import smtplib
import sys
from email.message import EmailMessage
from http.server import BaseHTTPRequestHandler, HTTPServer

# A deliberately forgiving address check: one or more non-at, non-space
# characters, an @, more non-at non-space characters, a dot, then a final
# non-at non-space run. Good enough to reject blanks and obvious junk without
# pretending to fully parse RFC 5322.
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

# Where owner notifications go. Override with the CONTACT_TO env var in
# production. The default is an obvious placeholder, not a real inbox.
DEFAULT_OWNER = "owner@example.com"


class SmtpMailer:
    """Sends real mail over SMTP, configured entirely from environment vars.

    CONTACT_SMTP_HOST   SMTP server hostname (required for a real send)
    CONTACT_SMTP_PORT   port, default 587
    CONTACT_SMTP_USER   login user, also the default From address
    CONTACT_SMTP_PASS   login password
    CONTACT_FROM        explicit From address, defaults to the SMTP user
    """

    def __init__(self):
        self.host = os.environ.get("CONTACT_SMTP_HOST", "")
        self.port = int(os.environ.get("CONTACT_SMTP_PORT", "587"))
        self.user = os.environ.get("CONTACT_SMTP_USER", "")
        self.password = os.environ.get("CONTACT_SMTP_PASS", "")
        self.from_addr = os.environ.get("CONTACT_FROM") or self.user or DEFAULT_OWNER

    def send(self, to, subject, body):
        msg = EmailMessage()
        msg["From"] = self.from_addr
        msg["To"] = to
        msg["Subject"] = subject
        msg.set_content(body)

        with smtplib.SMTP(self.host, self.port, timeout=15) as server:
            server.ehlo()
            try:
                server.starttls()
                server.ehlo()
            except smtplib.SMTPException:
                # Server does not offer STARTTLS, carry on unencrypted rather
                # than failing the whole send.
                pass
            if self.user and self.password:
                server.login(self.user, self.password)
            server.send_message(msg)


class DryRunMailer:
    """Records every message in memory instead of sending it.

    Used by the test suite and handy for local development. Each recorded item
    is a dict with 'to', 'subject' and 'body'.
    """

    def __init__(self):
        self.sent = []

    def send(self, to, subject, body):
        self.sent.append({"to": to, "subject": subject, "body": body})


def handle_contact(payload, mailer):
    """Validate a contact submission and send mail on success.

    Returns (status_code, response_dict). On invalid input it returns
    (400, {"ok": False, "error": ...}) and sends no mail at all. On valid input
    it calls mailer.send exactly twice (owner notification first, submitter
    confirmation second) and returns (200, {"ok": True, ...}).
    """
    if not isinstance(payload, dict):
        return 400, {"ok": False, "error": "payload is required or invalid"}

    name = str(payload.get("name", "")).strip()
    email = str(payload.get("email", "")).strip()
    subject = str(payload.get("subject", "")).strip()
    message = str(payload.get("message", "")).strip()

    if not name:
        return 400, {"ok": False, "error": "name is required or invalid"}
    if not EMAIL_RE.match(email):
        return 400, {"ok": False, "error": "email is required or invalid"}
    if not message:
        return 400, {"ok": False, "error": "message is required or invalid"}

    owner = os.environ.get("CONTACT_TO", DEFAULT_OWNER)
    subject_line = subject if subject else "(no subject)"

    # 1. Notify the site owner with the full submission.
    owner_subject = f"New portfolio enquiry from {name}"
    owner_body = (
        "You have a new message from the portfolio contact form.\n\n"
        f"Name: {name}\n"
        f"Email: {email}\n"
        f"Subject: {subject_line}\n\n"
        "Message:\n"
        f"{message}\n"
    )
    mailer.send(owner, owner_subject, owner_body)

    # 2. Send the submitter a confirmation receipt of their own message.
    confirm_subject = "Thanks, your message was received"
    confirm_body = (
        f"Hi {name},\n\n"
        "Thanks for reaching out. This is an automatic confirmation that your "
        "message was received, a reply will follow personally, usually within "
        "a day or two.\n\n"
        "For your records, here is what you sent:\n\n"
        f"Subject: {subject_line}\n\n"
        f"{message}\n\n"
        "Best,\nChris\n"
    )
    mailer.send(email, confirm_subject, confirm_body)

    return 200, {
        "ok": True,
        "message": "Thanks, your message was received. A confirmation email is on its way.",
    }


class ContactHandler(BaseHTTPRequestHandler):
    """Minimal HTTP handler: POST /api/contact -> handle_contact -> JSON."""

    def _send_json(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        if self.path != "/api/contact":
            self._send_json(404, {"ok": False, "error": "not found"})
            return

        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length) if length else b""
        try:
            payload = json.loads(raw.decode("utf-8"))
        except (json.JSONDecodeError, UnicodeDecodeError):
            self._send_json(400, {"ok": False, "error": "body is required or invalid"})
            return

        status, response = handle_contact(payload, self.server.mailer)
        self._send_json(status, response)

    def log_message(self, format, *args):
        # Keep the console quiet in normal operation.
        pass


if __name__ == "__main__":
    port = int(os.environ.get("CONTACT_PORT", "8790"))
    server = HTTPServer(("127.0.0.1", port), ContactHandler)
    # Attach the real mailer to the server so the handler can reach it.
    server.mailer = SmtpMailer()
    print(f"Contact server listening on http://127.0.0.1:{port}", file=sys.stderr)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.shutdown()
