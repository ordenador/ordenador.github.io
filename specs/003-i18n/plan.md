# 003 — Plan

Prereqs: 001 (clean components), 002 (CI generates artifacts — avoids committing 2 PDFs).

1. **Extract strings**: sweep components for literals → `labels` keys (sectionTitles, downloadPdf, workType terms). Components receive strings via `useLocale()` (React context holding `{ locale, setLocale, data, labels }`).
2. **Data split**: `src/data/resume.en.js` (move current), `src/data/resume.es.js` (translate — Chilean Spanish register, es-CL dates). One `index.js` exporting `{ en, es }`.
3. **Switcher**: small EN/ES control in `Header`; init order: `?lang` param → `localStorage` → `navigator.language` → `en`. Side effects: set `document.documentElement.lang`, persist.
4. **PDF x2**: `generate_pdf.py` loops locales, loading the built site with `?lang=xx` and emitting `mario_faundez_cv.{xx}.pdf`; copy EN to legacy filename. Update CI + download button (`labels.pdfHref`).
5. **SEO**: per-locale `<title>`/meta description set from the app; `hreflang` link tags for `?lang=en|es`.

## Risks

- PDF page-breaks differ between languages (Spanish runs ~20% longer) → check both PDFs' layout, adjust print CSS if a section splits badly.
