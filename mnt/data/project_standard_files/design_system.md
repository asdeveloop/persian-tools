# Design System

## Table of Contents
- [Tokens](#tokens)
- [Colors](#colors)
- [Typography](#typography)
- [Spacing and Grid](#spacing-and-grid)
- [Borders, Shadows, and Glassmorphism](#borders-shadows-and-glassmorphism)
- [Icons and Images](#icons-and-images)
- [Implementation Examples](#implementation-examples)

## Tokens

All UI must be built on "tokens" to enable theme/appearance changes without modifying all components.

### 🎯 **Token Format**
- **CSS Variables** for runtime theming
- **TypeScript file** for type-safe token usage
- **JSON export** for design tool synchronization

### 📋 **Minimum Required Tokens**
- **Colors** (semantic palette)
- **Spacing** (consistent scale)
- **Typography** (font sizes, weights, line heights)
- **Radius/Shadow** (border radius, elevation)
- **Motion/Easing** (animations, transitions)

> **⚠️ Rule**: The "primary" color should be used only in the correct contexts (CTAs, emphasized points). If everything is primary, nothing is primary.

## Colors

### 🎨 **Principles**
- Colors should have **semantic meaning**, not just "blue/green/red"
- Text contrast on backgrounds must pass at least **AA** (4.5:1)
- In RTL design, use `start/end` instead of left/right
- Support both light and dark themes

### 🌈 **Base Palette**

#### Background Colors
```css
--color-bg: hsl(220 14% 10%);           /* Main background */
--color-bg-subtle: hsl(220 14% 15%);    /* Subtle background */
--color-bg-muted: hsl(220 14% 20%);     /* Muted background */
```

#### Surface Colors
```css
--color-surface-1: hsl(220 14% 12%);    /* Primary surface */
--color-surface-2: hsl(220 14% 16%);    /* Secondary surface */
--color-surface-3: hsl(220 14% 20%);    /* Tertiary surface */
```

#### Text Colors
```css
--color-text: hsl(220 14% 90%);         /* Primary text */
--color-text-muted: hsl(220 14% 60%);   /* Secondary text */
--color-text-inverted: hsl(220 14% 5%); /* Text on colored backgrounds */
```

#### Border Colors
```css
--color-border: hsl(220 14% 25%);      /* Standard border */
--color-border-strong: hsl(220 14% 35%); /* Emphasized border */
```

#### Semantic Colors
```css
--color-primary: hsl(220 70% 50%);      /* Primary actions */
--color-primary-hover: hsl(220 70% 60%); /* Primary hover */
--color-primary-pressed: hsl(220 70% 40%); /* Primary active */

--color-success: hsl(142 76% 36%);      /* Success states */
--color-warning: hsl(38 92% 50%);       /* Warning states */
--color-danger: hsl(0 84% 60%);         /* Danger states */
--color-info: hsl(199 89% 48%);         /* Information states */
```

### 🌓 **Theme Strategy**

#### Dark-first (Recommended)
- **Default**: Dark background with semi-transparent surfaces
- **Accent colors**: Provide emphasis and visual hierarchy
- **Glassmorphism**: Subtle blur effects for depth

#### Light Mode (Optional)
- **Complete implementation**: Not partial
- **Consistent contrast ratios**: Maintain accessibility
- **Smooth transitions**: Theme switching animations

> **💡 Note**: If Glassmorphism is enabled, text contrast must be controlled with "overlay" and "blur", especially on images.

## Typography

### 🔤 **Font and Rules**
- **Primary font**: **IRANSansX** (embedded locally)
- **Fallback**: System fonts only when IRANSansX unavailable
- **Half-space**: Proper use according to Persian language rules
- **RTL support**: All text must support RTL layout

### 📏 **Suggested Scale**

| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `text-xs` | 12px | 400 | Small descriptions, metadata |
| `text-sm` | 14px | 400 | Secondary text, captions |
| `text-md` | 16px | 400 | Main text, body content |
| `text-lg` | 18px | 500 | Subheadings, important text |
| `text-xl` | 20px | 600 | Section headings |
| `text-2xl` | 24px | 600 | Page headings |
| `text-3xl` | 30px | 700 | Main titles |

### 📐 **Line Height**
- **Long texts**: 1.8 for better Persian readability
- **Headings**: 1.2 to 1.4 for tight spacing
- **UI elements**: 1.4 to 1.6 for button text

### 🎯 **Font Weights**
- **Regular (400)**: Body text, descriptions
- **Medium (500)**: Emphasized text, subheadings
- **Semi-bold (600)**: Headings, important labels
- **Bold (700)**: Main titles, CTAs

## Spacing and Grid

### 📏 **Spacing Scale**
Use a 4px scale (compatible with Tailwind and many Design Systems):

```css
--space-1: 4px;    /* Micro spacing */
--space-2: 8px;    /* Small spacing */
--space-3: 12px;   /* Medium spacing */
--space-4: 16px;   /* Standard spacing */
--space-6: 24px;   /* Large spacing */
--space-8: 32px;   /* Extra large spacing */
--space-10: 40px;  /* Section spacing */
--space-12: 48px;  /* Component spacing */
--space-16: 64px;  /* Page spacing */
--space-20: 80px;  /* Section breaks */
```

### 🏗️ **Grid and Container**

#### Responsive Padding
- **Mobile**: 16px horizontal padding
- **Tablet**: 24px horizontal padding
- **Desktop**: 32px horizontal padding

#### Container Sizes
```css
--container-sm: 640px;   /* Small containers */
--container-md: 768px;  /* Medium containers */
--container-lg: 1024px;  /* Large containers */
--container-xl: 1280px;  /* Extra large containers */
```

#### Grid System
- **12-column grid** for complex layouts
- **Flexbox** for component-level layouts
- **CSS Grid** for page-level layouts

## Borders, Shadows, and Glassmorphism

### 🔘 **Border Radius**
```css
--radius-sm: 8px;   /* Small elements, buttons */
--radius-md: 12px;  /* Cards, inputs */
--radius-lg: 16px;  /* Large cards, modals */
--radius-xl: 24px;  /* Special containers */
```

> **⚡ Rule**: A project with 2-3 standard radius values looks cleaner than a project where every component has a different radius.

### 🌑 **Shadows**
```css
--shadow-sm: 0 1px 2px hsl(0 0% 0% / 0.1);
--shadow-md: 0 4px 6px hsl(0 0% 0% / 0.1);
--shadow-lg: 0 10px 15px hsl(0 0% 0% / 0.1);
--shadow-xl: 0 20px 25px hsl(0 0% 0% / 0.1);
```

#### Shadow Principles
- **Subtle and shallow**: Avoid heavy shadows
- **Dark mode**: Use level contrast instead of dark shadows
- **Consistent elevation**: Clear visual hierarchy

### 🔮 **Glassmorphism**
If Glassmorphism is used:

```css
--glass-bg: hsl(220 14% 10% / 0.8);
--glass-border: hsl(220 14% 25% / 0.2);
--glass-blur: blur(10px);
```

#### Glassmorphism Rules
- **Controlled blur**: Consistent blur amounts
- **Text readability**: Ensure contrast on glass surfaces
- **Performance**: Provide fallback for weak devices
- **Accessibility**: Respect motion preferences

## Icons and Images

### 🎯 **Icon Standards**
- **Consistent style**: Stroke/Fill, thickness, corners
- **RTL awareness**: Directional icons must flip in RTL
- **Semantic meaning**: Icons should enhance, not replace text
- **Accessibility**: Include proper ARIA labels

#### Icon Sizes
```css
--icon-xs: 12px;
--icon-sm: 16px;
--icon-md: 20px;
--icon-lg: 24px;
--icon-xl: 32px;
```

### 🖼️ **Image Standards**
- **Lazy loading**: All non-critical images
- **Proper sizing**: Use appropriate dimensions
- **Optimized formats**: WebP/AVIF with fallbacks
- **Responsive images**: Different sizes for different screens

#### Image Optimization
- **Compression**: Balance quality and file size
- **Formats**: Modern formats with fallbacks
- **Loading**: Progressive loading for large images
- **Accessibility**: Alt text for all meaningful images

## Implementation Examples

### 🎨 **CSS Variables Implementation**
```css
:root {
  /* Colors */
  --color-bg: hsl(220 14% 10%);
  --color-text: hsl(220 14% 90%);
  
  /* Spacing */
  --space-4: 16px;
  --space-6: 24px;
  
  /* Typography */
  --text-md: 16px;
  --text-lg: 18px;
  
  /* Border Radius */
  --radius-md: 12px;
}

[data-theme="light"] {
  --color-bg: hsl(220 14% 95%);
  --color-text: hsl(220 14% 10%);
}
```

### 📱 **Component Example**
```css
.card {
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
}

.card-title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--space-4);
}
```

### 🔧 **TypeScript Tokens**
```typescript
export const tokens = {
  colors: {
    bg: 'hsl(220 14% 10%)',
    text: 'hsl(220 14% 90%)',
    primary: 'hsl(220 70% 50%)',
  },
  spacing: {
    sm: '8px',
    md: '16px',
    lg: '24px',
  },
  typography: {
    md: '16px',
    lg: '18px',
    xl: '20px',
  },
} as const;
```
