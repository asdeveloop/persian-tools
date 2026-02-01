---
trigger: always_on
description: "Global engineering standards for all projects"
labels: standards,quality,baseline
author: persian-tools-team
modified: 2026-02-01
---

# Global Rules — Engineering Baseline (All Projects)

- Always start with a brief plan (3–7 bullets) before changing code. Then implement step-by-step.
- Prefer minimal, surgical diffs. Do not refactor unrelated code.
- Never introduce external runtime dependencies (remote fonts/CDNs/3rd-party scripts) unless explicitly requested.
- In this repo, follow `PROJECT_STANDARDS.md` for UI/UX, RTL, localization, and engineering requirements.
- When editing code:
  - Keep types strict; avoid `any`. Prefer `unknown` + narrowing.
  - Prefer pure functions, early returns, and clear naming.
  - Add/adjust tests for any behavioral change.
- Error handling:
  - Do not swallow errors. Provide user-facing messages where relevant and log for debugging.
  - Use typed errors / error codes, not raw strings.
- Output format:
  - When you propose code, include file paths and explain the change briefly.
  - When unsure, ask for the smallest missing info OR propose a safe default + explain.
