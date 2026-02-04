# ADR 001: معماری Components

**تاریخ:** 2026-02-02
**وضعیت:** تایید شده
**نویسنده:** Persian Tools Team

## مسئله

چگونه components را به شکلی سازماندهی کنیم که:

- قابل استفاده مجدد باشد
- نگهداری آسان داشته باشد
- Scalable باشد

## تصمیم

استفاده از معماری **Feature-based** با لایه‌های:

1. **Shared UI Layer** - Generic components
2. **Features Layer** - Feature-specific components
3. **App Layer** - Pages و layouts

## مثال

```
shared/ui/
├── Button.tsx          # Generic button
├── Card.tsx            # Generic card
└── Container.tsx       # Layout container

features/pdf-tools/
├── components/
│   ├── PdfUploader.tsx
│   └── PdfPreview.tsx
├── hooks/
│   └── usePdfProcessor.ts
└── types/
    └── pdf.ts

app/(tools)/pdf-tools/
└── page.tsx            # Route page
```

## فواید

✅ Easier to locate files
✅ Clear separation of concerns
✅ Better code reusability
✅ Improved team collaboration
