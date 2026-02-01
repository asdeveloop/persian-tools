---
trigger: always_on
description: "TypeScript/React coding standards for this repo"
labels: typescript,react,quality
author: your-name
modified: 2026-02-01
---

# Coding Standards (TS/React)

- TypeScript `strict` is mandatory. Never use `any` (exception: documented + linked ticket).
- Prefer:
  - `type` for unions/intersections, `interface` for public object contracts.
  - `unknown` for untrusted inputs + explicit narrowing.
- No implicit side effects in utilities.
- Naming:
  - Components: PascalCase
  - functions/vars: camelCase
  - constants: UPPER_SNAKE_CASE
- UI components:
  - Keep components small; split when >200 LOC or mixed concerns.
  - Never hardcode colors/sizes; use design tokens / theme variables.
