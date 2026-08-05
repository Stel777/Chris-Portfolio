"""Test suite for the contact form backend.

Run from the project root:

    python test_contact.py

It forces a DryRunMailer so no real mail is sent, then asserts:

  - valid input returns status 200 and records exactly two emails, one owner
    notification and one confirmation addressed back to the submitter,
  - a missing, blank, or malformed name / email / message each returns 400 and
    records zero emails.

Exit code is 0 when every case passes, non-zero (via a failed assertion) if any
case fails. Each case prints a PASS line so the output doubles as evidence.
"""

import json
import os
import sys
import threading
import urllib.error
import urllib.request
from http.server import HTTPServer

import contact_server

# Make the owner address deterministic for the assertions below.
os.environ["CONTACT_TO"] = "owner@example.com"

passed = 0


def check(label, condition):
    global passed
    assert condition, f"FAIL: {label}"
    passed += 1
    print(f"PASS: {label}")


def run():
    print("Running contact form backend tests (DryRunMailer, no real mail).")
    print("-" * 68)

    # --- Valid submission, with a subject ---------------------------------
    mailer = contact_server.DryRunMailer()
    payload = {
        "name": "Ada Lovelace",
        "email": "ada@example.com",
        "subject": "Commission enquiry",
        "message": "I would love to discuss a portrait series.",
    }
    status, resp = contact_server.handle_contact(payload, mailer)
    check("valid input returns status 200", status == 200)
    check("valid input returns ok True", resp["ok"] is True)
    check("valid input records exactly two emails", len(mailer.sent) == 2)
    check(
        "first email is the owner notification",
        mailer.sent[0]["to"] == "owner@example.com",
    )
    check(
        "owner notification contains the submitter details",
        "Ada Lovelace" in mailer.sent[0]["body"]
        and "ada@example.com" in mailer.sent[0]["body"]
        and "Commission enquiry" in mailer.sent[0]["body"]
        and "portrait series" in mailer.sent[0]["body"],
    )
    check(
        "second email is the confirmation to the submitter",
        mailer.sent[1]["to"] == "ada@example.com",
    )
    check(
        "confirmation reads as a receipt to the submitter",
        "received" in mailer.sent[1]["subject"].lower()
        and "Ada Lovelace" in mailer.sent[1]["body"],
    )
    check(
        "owner notification replies to the submitter",
        mailer.sent[0]["reply_to"] == "ada@example.com",
    )
    check(
        "confirmation replies to the owner",
        mailer.sent[1]["reply_to"] == "owner@example.com",
    )

    # --- Valid submission, no subject (subject is optional) ---------------
    mailer = contact_server.DryRunMailer()
    status, resp = contact_server.handle_contact(
        {
            "name": "Grace Hopper",
            "email": "grace@example.com",
            "message": "No subject on this one.",
        },
        mailer,
    )
    check("valid input without a subject still returns 200", status == 200)
    check("valid input without a subject records two emails", len(mailer.sent) == 2)

    # --- Invalid: missing name -------------------------------------------
    mailer = contact_server.DryRunMailer()
    status, resp = contact_server.handle_contact(
        {"email": "ada@example.com", "message": "Hello there."}, mailer
    )
    check("missing name returns status 400", status == 400)
    check("missing name reports the name field", resp["error"] == "name is required or invalid")
    check("missing name sends no mail", len(mailer.sent) == 0)

    # --- Invalid: blank (whitespace only) name ----------------------------
    mailer = contact_server.DryRunMailer()
    status, resp = contact_server.handle_contact(
        {"name": "   ", "email": "ada@example.com", "message": "Hello there."}, mailer
    )
    check("blank name returns status 400", status == 400)
    check("blank name sends no mail", len(mailer.sent) == 0)

    # --- Invalid: malformed email (no dot in domain) ----------------------
    mailer = contact_server.DryRunMailer()
    status, resp = contact_server.handle_contact(
        {"name": "Ada", "email": "ada@example", "message": "Hello there."}, mailer
    )
    check("malformed email returns status 400", status == 400)
    check("malformed email reports the email field", resp["error"] == "email is required or invalid")
    check("malformed email sends no mail", len(mailer.sent) == 0)

    # --- Invalid: email with no @ ----------------------------------------
    mailer = contact_server.DryRunMailer()
    status, resp = contact_server.handle_contact(
        {"name": "Ada", "email": "adaexample.com", "message": "Hi."}, mailer
    )
    check("email without @ returns status 400", status == 400)
    check("email without @ sends no mail", len(mailer.sent) == 0)

    # --- Invalid: missing message ----------------------------------------
    mailer = contact_server.DryRunMailer()
    status, resp = contact_server.handle_contact(
        {"name": "Ada", "email": "ada@example.com"}, mailer
    )
    check("missing message returns status 400", status == 400)
    check(
        "missing message reports the message field",
        resp["error"] == "message is required or invalid",
    )
    check("missing message sends no mail", len(mailer.sent) == 0)

    # --- Invalid: blank message ------------------------------------------
    mailer = contact_server.DryRunMailer()
    status, resp = contact_server.handle_contact(
        {"name": "Ada", "email": "ada@example.com", "message": "   "}, mailer
    )
    check("blank message returns status 400", status == 400)
    check("blank message sends no mail", len(mailer.sent) == 0)

    # --- Honeypot: a filled "company" field is silently dropped -----------
    mailer = contact_server.DryRunMailer()
    status, resp = contact_server.handle_contact(
        {
            "name": "Spam Bot",
            "email": "bot@example.com",
            "message": "Buy cheap widgets now.",
            "company": "Acme Spam Co",
        },
        mailer,
    )
    check("filled honeypot returns status 200", status == 200)
    check("filled honeypot looks like success", resp["ok"] is True)
    check("filled honeypot sends no mail", len(mailer.sent) == 0)

    # --- Honeypot: a whitespace-only "company" is treated as empty ---------
    mailer = contact_server.DryRunMailer()
    status, resp = contact_server.handle_contact(
        {
            "name": "Real Person",
            "email": "real@example.com",
            "message": "Genuine enquiry.",
            "company": "   ",
        },
        mailer,
    )
    check("blank honeypot still processes normally", status == 200)
    check("blank honeypot sends two emails", len(mailer.sent) == 2)

    # --- Honeypot: an absent "company" leaves behavior unchanged ----------
    mailer = contact_server.DryRunMailer()
    status, resp = contact_server.handle_contact(
        {"name": "Real Person", "email": "real@example.com", "message": "Genuine enquiry."},
        mailer,
    )
    check("absent honeypot still processes normally", status == 200)
    check("absent honeypot sends two emails", len(mailer.sent) == 2)

    # --- RateLimiter: allows up to the cap, then blocks -------------------
    limiter = contact_server.RateLimiter(max_requests=2, window_seconds=60, clock=lambda: 1000.0)
    check("rate limiter allows the first request", limiter.allow("1.2.3.4") is True)
    check("rate limiter allows the second request", limiter.allow("1.2.3.4") is True)
    check("rate limiter blocks once the cap is exceeded", limiter.allow("1.2.3.4") is False)
    check("rate limiter keys are independent", limiter.allow("5.6.7.8") is True)

    # --- RateLimiter: the window slides so old hits stop counting ---------
    clock = {"now": 0.0}
    sliding = contact_server.RateLimiter(
        max_requests=1, window_seconds=10, clock=lambda: clock["now"]
    )
    check("sliding limiter allows the first hit", sliding.allow("k") is True)
    check("sliding limiter blocks the immediate repeat", sliding.allow("k") is False)
    clock["now"] = 11.0
    check("sliding limiter allows again after the window passes", sliding.allow("k") is True)

    # --- Both mailer classes exist with the expected interface ------------
    check("SmtpMailer is defined", hasattr(contact_server, "SmtpMailer"))
    check("DryRunMailer records in memory", isinstance(contact_server.DryRunMailer().sent, list))

    # --- End-to-end: do_POST rate-limit (429) and honeypot over real HTTP -
    run_http_cases()

    print("-" * 68)
    print(f"ALL {passed} CHECKS PASSED")


def _start_server(limiter):
    server = HTTPServer(("127.0.0.1", 0), contact_server.ContactHandler)
    server.mailer = contact_server.DryRunMailer()
    server.limiter = limiter
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server


def _post(port, body):
    req = urllib.request.Request(
        f"http://127.0.0.1:{port}/api/contact",
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        return exc.code, json.loads(exc.read().decode("utf-8"))


def run_http_cases():
    valid = {"name": "Ada", "email": "ada@example.com", "message": "Hello there."}

    # Rate limiter capped at 1: first POST 200, second POST 429 with no extra mail.
    server = _start_server(contact_server.RateLimiter(max_requests=1, window_seconds=60))
    port = server.server_address[1]
    try:
        s1, _ = _post(port, valid)
        check("do_POST: first request returns 200", s1 == 200)
        check("do_POST: first request sends two emails", len(server.mailer.sent) == 2)

        s2, b2 = _post(port, valid)
        check("do_POST: request over the cap returns 429", s2 == 429)
        check("do_POST: 429 body is ok False", b2["ok"] is False)
        check(
            "do_POST: 429 body carries the too-many-requests error",
            b2["error"] == "Too many requests, please try again in a minute.",
        )
        check("do_POST: rate-limited request sends no extra mail", len(server.mailer.sent) == 2)
    finally:
        server.shutdown()

    # Honeypot over real HTTP: looks like 200 success but sends no mail.
    server = _start_server(contact_server.RateLimiter(max_requests=10, window_seconds=60))
    port = server.server_address[1]
    try:
        spam = {"name": "Bot", "email": "bot@example.com", "message": "spam", "company": "Acme"}
        s3, b3 = _post(port, spam)
        check("do_POST: honeypot submission returns 200", s3 == 200)
        check("do_POST: honeypot submission looks like success", b3["ok"] is True)
        check("do_POST: honeypot submission sends no mail", len(server.mailer.sent) == 0)
    finally:
        server.shutdown()


if __name__ == "__main__":
    try:
        run()
    except AssertionError as exc:
        print(exc)
        sys.exit(1)
    sys.exit(0)
