---
title: PR Review
description: Review this PR end-to-end using the repo standards and produce a structured review.
author: persian-tools-team
modified: 2026-02-01
---

## PR Review Workflow

### Step 1: Summarize the Change
- **Intent**: What problem does this solve?
- **Files**: Which files are modified/added/deleted?
- **Impact**: Breaking changes or new features?

### Step 2: Identify Risk Areas
- **Security**: Authentication, authorization, data exposure
- **Performance**: Database queries, rendering, memory usage
- **Breaking Changes**: API contracts, data schemas

### Step 3: Code Quality Check
- **Types**: No `any`, proper interfaces, error handling
- **Lint**: ESLint/Prettier compliance
- **Architecture**: Separation of concerns, dependency direction

### Step 4: Testing & Coverage
- **New tests**: Added for new functionality
- **Existing tests**: Still passing
- **Coverage**: Maintained or improved

### Step 5: Review Comments
Group by severity:
- **Blocker**: Must fix before merge
- **Major**: Should fix, impacts quality
- **Minor**: Nice to have, improvements
- **Nits**: Style, formatting, suggestions

### Step 6: Propose Patches
- Provide exact file paths and line numbers
- Show before/after code snippets
- Explain reasoning for each change
