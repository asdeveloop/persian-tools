---
trigger: glob
globs: "**/*.{test,spec}.{ts,tsx,js,jsx}"
description: "Testing rules for unit/integration tests"
labels: testing,vitest,coverage
author: persian-tools-team
modified: 2026-02-01
---

# Testing & Coverage

- Use AAA pattern (Arrange/Act/Assert).
- Prefer deterministic tests (no real network, no time-based flakiness).
- Mock at boundaries, not internals.
- For bug fixes: add a regression test first, then fix.
- Minimum coverage target: 80% for changed modules (raise gradually).
