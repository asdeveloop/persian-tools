# Project Overview
## Domain and Audience
This document is intended for UI/UX designers, developers, document maintainers, wrapper package developers (such as React/Vue), QA, and project managers. The goal is to ensure:
1. Consistent UI behavior and user experience across all dependencies.
2. A user experience that is accessible, coherent, and adheres to global standards.
3. Scalable, maintainable, and testable project development.

## Non-negotiable Principles
These principles are **laws** and must be followed across all packages, websites, and documentation:
- **UI Language and Content in Persian:** All pages, documents, and components must fully support **Persian/RTL**.
- **Local-first:** No runtime dependency on external services (CDNs, APIs).
- **Accessibility:** Minimum **WCAG AA** for all main paths.
- **Code Quality:** TypeScript with `strict: true` and without `any` (unless explicitly justified).
- **Testing is Required:** Every vital section (even utilities and validations) must have reliable tests.
- **Performance:** Tools and UI should be lightweight, fast, and free from heavy packages.

## Locality, Persian Language Support, and Compliance with Sanctions
### Language and Content
- **UI Language:** Persian.
- **Font:** Only use **IRANSansX**, which is embedded in the project (no external fonts).
- **Direction:** All pages and components are RTL.
- **Number Writing:** Display using Persian numerals (۰–۹) and thousand separators.
- **Date and Time:** If date is shown in the UI, it should specify whether it’s **Shamsi/Gregorian**, and preferably support **Shamsi** date.

### No External Dependencies
External dependencies should be avoided. This includes:
- ❌ **CDN** for JS/CSS/Font/Icons
- ❌ Google Fonts or any remote fonts
- ❌ External analytics (unless self-hosted)
- ❌ External APIs for core functionality (unless self-hosted and project-approved)

### Sanctions Compatibility
- Features should be designed to work even if international service access is restricted.
- If an external service must be used, it must:
  1) Have a local replacement.
  2) Be behind a Feature Flag.
  3) Be documented with "Sanction Risk."

