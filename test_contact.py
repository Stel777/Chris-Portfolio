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

import os
import sys

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

    # --- Both mailer classes exist with the expected interface ------------
    check("SmtpMailer is defined", hasattr(contact_server, "SmtpMailer"))
    check("DryRunMailer records in memory", isinstance(contact_server.DryRunMailer().sent, list))

    print("-" * 68)
    print(f"ALL {passed} CHECKS PASSED")


if __name__ == "__main__":
    try:
        run()
    except AssertionError as exc:
        print(exc)
        sys.exit(1)
    sys.exit(0)
