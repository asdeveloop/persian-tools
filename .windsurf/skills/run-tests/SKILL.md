---
name: run-tests
description: "Run unit/integration tests, inspect failures, propose minimal fixes, and update coverage thresholds if required."
---

# Run Tests Skill

Steps:

1) Identify test runner (package.json scripts) and run the smallest relevant test subset first.
2) If failing:
   - explain root cause
   - propose minimal fix
   - add regression test if missing
3) Re-run full suite and report final status.
4) If coverage drops, explain why and propose targeted tests.
