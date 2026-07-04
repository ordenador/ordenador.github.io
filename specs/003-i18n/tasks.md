# 003 — Tasks

- [x] T1: Create `LocaleContext` + `useLocale()`; wire provider in `main.jsx` with init/persist logic.
- [x] T2: Extract UI literals to `labels.{en,es}`; replace in all 9 components.
- [x] T3: Split data into `resume.en.js` / `resume.es.js` (translate to es-CL); shared shape documented in a comment.
- [x] T4: Header language switcher + `<html lang>` / title / meta side effects + `hreflang` tags.
- [x] T5: `generate_pdf.py` loop over locales (`?lang=xx` → `mario_faundez_cv.{xx}.pdf`, EN copied to legacy name); update CI artifact + download button.
- [x] T6: Verify both PDFs' layout; `make precommit`; commit.
