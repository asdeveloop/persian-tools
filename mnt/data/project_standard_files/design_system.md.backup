# Design System
## Tokens
All UI must be built on "tokens" to enable theme/appearance changes without modifying all components.

**Suggested Format:** CSS Variables + TypeScript file (for JS/TS use).

**Minimum Required Tokens:**
- Colors (semantic)
- Spacing
- Typography
- Radius/Shadow
- Motion/Easing

> **Rule:** The "primary" color should be used only in the correct contexts (CTAs, emphasized points). If everything is primary, nothing is primary.

## Colors
### Principles
- Colors should have **semantic meaning**, not just "blue/green/red".
- Text contrast on backgrounds must pass at least **AA**.
- In RTL design, use `start/end` instead of left/right.

### Base Palette
- **Background:** `bg`, `bg-subtle`
- **Surface:** `surface-1`, `surface-2`, `surface-3`
- **Text:** `text`, `text-muted`, `text-inverted`
- **Border:** `border`, `border-strong`
- **Primary / Accent:** `primary`, `primary-hover`, `primary-pressed`
- **Status:**
  - `success`, `warning`, `danger`, `info`

### Suggested Theme (Vercel-style + extensible)
- **Dark-first** (recommended): Dark background, semi-transparent surfaces, accent color emphasis.
- **Light mode** optional, but if enabled, it should be complete (not partial).

> Note: If Glassmorphism is enabled, text contrast must be controlled with "overlay" and "blur", especially on images.

## Typography
### Font and Rules
- Primary font: **IRANSansX**
- Use fallback system fonts only if the font file is unavailable.
- Use **half-space** in texts according to Persian language rules.

### Suggested Scale

| Token     | Size   | Usage                    |
|-----------|--------|--------------------------|
| `text-xs` | 12px   | Small descriptions/meta  |
| `text-sm` | 14px   | Secondary text           |
| `text-md` | 16px   | Main text                |
| `text-lg` | 18px   | Headings within the page |
| `text-xl` | 20–24px| Page headings            |

### Line Height
- Long texts: line-height around 1.8 for better Persian readability.
- Headings: 1.2 to 1.4.

## Spacing and Grid
### Spacing Scale
Use a 4px scale (compatible with Tailwind and many Design Systems):
- `space‑1 = 4px`
- `space‑2 = 8px`
- `space‑3 = 12px`
- `space‑4 = 16px`
- `space‑6 = 24px`
- `space‑8 = 32px`
- `space‑10 = 40px`
- `space‑12 = 48px`

### Grid and Container
- Mobile: horizontal padding 16px
- Tablet: 24px
- Desktop: 32px
- Max content width (recommended): 1200–1280px

## Borders, Shadows, and Glassmorphism
### Radius
- `radius-sm`: 8px
- `radius-md`: 12px
- `radius-lg`: 16px

> Rule: A project with 2-3 standard radius values looks cleaner than a project where every component has a different radius.

### Shadows
- Shadows should be subtle and shallow.
- In Dark mode, avoid very dark shadows; "level contrast" is more important than shadows.

### Glassmorphism
If Glassmorphism is used:
- Surfaces should have **controlled Blur**.
- The glass surface should not reduce text readability.
- On weak devices, there should be a fallback (reduce or remove blur).

## Icons and Images
- Icons must have a consistent style (Stroke/Fill, thickness, corners).
- Directional icons should be RTL-aware.
- Images:
  - Lazy-load
  - Proper sizing
  - Use optimized formats (WebP/AVIF if possible)
