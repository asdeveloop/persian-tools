# 🏗️ معماری Persian Tools

> آخرین به‌روزرسانی: 2026-02-03

## نمای کلی

```
┌─────────────────────────────────────────┐
│         Next.js 14 (Framework)          │
├─────────────────────────────────────────┤
│  App Router  │  API Routes  │ Middleware │
├─────────────────────────────────────────┤
│           React 18 Components           │
├─────────────────────────────────────────┤
│  Shared UI  │  Features  │  Utilities   │
├─────────────────────────────────────────┤
│   Tailwind CSS  │  CSS Variables        │
├─────────────────────────────────────────┤
│  Domain Logic (PDF, Loan, Salary, etc.) │
└─────────────────────────────────────────┘
```

## لایه‌ها

### 1. Presentation Layer (app/, components/)

- Pages و Routes
- Layout components
- UI composition

### 2. Feature Layer (features/)

- Feature-specific components
- Business logic
- State management

### 3. Shared Layer (shared/)

- UI primitives
- Utilities (numbers, localization, analytics)
- Constants
- Types

### 4. Domain Layer

- Business rules
- Validation
- Calculations

## Data Flow

```
User Input → Component → Hook → Service → Logic → Result
   ↓           ↓          ↓       ↓       ↓      ↓
 Action    Render      State   Process  Validate Display
```

## Performance Strategy

- Code splitting per route
- Lazy loading heavy modules
- Image optimization
- CSS-in-JS minimization

## Security

- Client-side processing only
- No external API calls for core functionality
- Input validation
- XSS prevention (React built-in)
- CSP headers (Next.js)
