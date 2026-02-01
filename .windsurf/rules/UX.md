---
trigger: model_decision
description: "Apply when implementing error handling, API boundaries, or user feedback"
labels: errors,ux,logging
author: your-name
modified: 2026-02-01
---

# Error Handling Rules

- Never show raw stack traces to end users.
- Always provide:
  1) a user-friendly message (localized if UI-facing),
  2) a technical detail for logs (error code / cause),
  3) a safe fallback UI state.
- In UI:
  - Validate client-side for format, server-side for truth.
  - Display errors near the field or at top summary (forms).
- In domain layer:
  - Use typed error objects, not string comparisons.
