---
name: code-review
description: "Run a strict PR review: architecture, security, performance, tests, and UX. Use provided checklists/templates."
author: persian-tools-team
modified: 2026-02-01
---

# Code Review Skill

Follow this workflow:

1) Summarize what changed (files + intent).
2) Flag high-risk changes (auth, payments, data, security).
3) Check: types, lint, tests, edge cases, error states.
4) Provide actionable comments grouped by severity: Blocker / Major / Minor / Nits.
5) Suggest minimal diffs and propose exact patches when possible.

Use these resources:

- review-checklist.md
- pr-template.md
- security-checklist.md

## Quality Gates

- **Blocker**: Security issues, breaking changes, missing tests for critical paths
- **Major**: Performance issues, accessibility violations, type safety problems  
- **Minor**: Code style, documentation gaps, non-critical edge cases
- **Nits**: Formatting, naming conventions, minor optimizations
