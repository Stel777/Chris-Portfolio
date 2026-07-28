# Verification artifacts

This folder is the target for browser screenshots of rendered case-study pages
(spec step 6).

No screenshot could be captured during this run: launching a browser requires
Playwright, which runs on Node, and command execution (python, node, the
webapp-testing Playwright harness) was gated behind an interactive approval
prompt that was unavailable during the autonomous overnight session. Per the
spec's stated fallback, verification was performed by loading and inspecting
each case-study file directly and asserting the required ids and the gallery
hrefs. See `../VERIFICATION.md` for the full evidence, and re-run the browser
pass with:

    python -m http.server 8137
    node .supermax/pwtest/test.js   # or the webapp-testing Playwright flow

against http://localhost:8137/ to drop PNGs here.
