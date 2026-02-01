---
name: run-tests
description: "Run unit/integration tests, inspect failures, propose minimal fixes, and update coverage thresholds if required."
author: persian-tools-team
modified: 2026-02-01
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

## Test Strategy

- **Unit tests**: Fast, isolated, cover business logic
- **Integration tests**: Component interactions, API boundaries
- **E2E tests**: Critical user journeys (minimal set)
- **Coverage targets**: 80% for new code, maintain existing levels

## Common Failure Patterns

- Missing imports/exports
- Async/await timing issues
- Mock configuration problems
- Environment variable dependencies
