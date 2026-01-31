# MangAi HR/EN Fixes – Summary

## Files changed

| File | Changes |
|------|--------|
| **style.css** | Hero background: `url('assets/hero-bg.png')` → `url('/assets/hero-bg.png')` so it loads from any path. |
| **index.html** (HR) | Favicon, style, reveal.js → root-relative (`/favicon.svg`, `/style.css`, `/reveal.js`). Blog/EN nav → `/blog/`, `/en/`. Footer legal links → `privacy_hr.html`, `terms_hr.html`. Logo links → `/`. |
| **en/index.html** (EN) | Favicon, style, reveal.js → root-relative. Nav: `#get-in-touch` → `#contact`, HR link → `/`, added `lang-sep`. Removed standalone “Get in Touch” and “value-props” sections; single contact block with `.contact.contact-cta`, `.contact-header`, `.trust-row`, `.contact-form-wrapper` (same structure as HR). Footer: `.footer-grid` → `.footer-top`, `.footer-brand` wrapped in `.footer-col.brand.footer-brand`, added `.footer-col.services` / `.footer-col.contact`. Legal links → `/privacy.html`, `/terms.html`. Logo/blog → `/en/`, `/en/blog/`. Form helper: “We respond within 24–48h.” |
| **privacy.html** | `lang="hr"` → `lang="en"`. Nav and footer: English labels, links to `/en/`, `/en/#…`, `/en/blog/`. Footer: `.footer-grid` → `.footer-top` + `.footer-col.brand.footer-brand`, etc. Legal → `/privacy.html`, `/terms.html`. Assets → `/favicon.svg`, `/style.css`. Lang switcher: HR → `/privacy_hr.html`. |
| **terms.html** | Same footer/nav/asset fixes as privacy.html. Lang switcher: HR → `/terms_hr.html`. |
| **privacy_hr.html** | Footer: `.footer-grid` → `.footer-top` + `.footer-col.brand.footer-brand`, etc. Nav and footer links → root-relative (`/`, `/#services`, `/blog/`, `/en/`, `/privacy_hr.html`, `/terms_hr.html`). Assets → `/favicon.svg`, `/style.css`. |
| **terms_hr.html** | Same footer/nav/asset pattern as privacy_hr.html. |
| **blog/index.html** | Favicon, blog.css → `/favicon.svg`, `/blog/blog.css`. Nav and footer → `/`, `/#services`, `/#contact`, `/en/blog/`, `/blog/`. |
| **blog/post.html** | Same asset and nav pattern; `#get-in-touch` → `#contact`. |
| **en/blog/index.html** | Favicon, blog.css → `/favicon.svg`, `/blog/blog.css`. Nav and footer → `/en/`, `/en/#…`, `/blog/`, added `lang-sep`. |
| **en/blog/post.html** | Same asset and nav pattern; CTA → `/en/#contact`. |
| **DIAGNOSIS.md** | New: diagnosis report (file map, HR vs EN, icons, footer, slug). |
| **FIXES_SUMMARY.md** | New: this summary. |

---

## Why EN was broken and how it’s fixed

1. **Footer**  
   Only HR home used `.footer-top` (the class that has the grid layout in `style.css`). EN home and all legal pages used `.footer-grid`, which has no CSS, so the footer had no layout.  
   **Fix:** All pages now use the same footer markup: `.footer-top` and `.footer-col.brand.footer-brand`, so the same footer CSS applies everywhere.

2. **Assets on EN**  
   EN used relative paths (`../style.css`, `../favicon.svg`, `../reveal.js`). When the base URL or server setup differed, those could resolve wrong. The hero image in `style.css` was `url('assets/hero-bg.png')`, which is resolved from the CSS file URL; from `/en/` that could break depending on how the CSS was served.  
   **Fix:** Root-relative paths everywhere: `/style.css`, `/favicon.svg`, `/reveal.js`, `/assets/hero-bg.png` in CSS. EN (and all pages) now load the same assets regardless of folder depth.

3. **EN slug / routing**  
   HR footer linked to `privacy.html` and `terms.html` (EN legal) instead of HR legal.  
   **Fix:** HR footer now links to `privacy_hr.html` and `terms_hr.html`. EN footer links to `/privacy.html` and `/terms.html`. Language switchers on legal pages point to the correct HR/EN legal URLs.

4. **EN layout vs HR**  
   EN had extra sections (`#get-in-touch`, `.value-props`) and a different contact block (no `.contact-cta`, `.trust-row`), so layout and IDs didn’t match HR.  
   **Fix:** EN home now has the same section order and structure as HR: one contact block with `.contact.contact-cta`, `.contact-header`, `.trust-row`, `.contact-form-wrapper`, and `id="contact"`. Nav links to `#contact`. Removed duplicate “Get in Touch” and value-props sections.

---

## Verification

- **Icons:** Inline SVGs unchanged; favicon and hero background use root-relative URLs and load on both languages.
- **Footer:** Same HTML structure and classes on HR and EN (and legal pages), so footer layout is identical.
- **HR/EN parity:** Same layout and IDs; only text differs. Language switch works both ways (HR ↔ EN) with correct links.

---

## Testing instructions

1. **Run a local server** (do not use `file://`):
   ```bash
   cd c:\Users\mskor\OneDrive\Desktop\MangAi
   python -m http.server 8080
   ```
2. In the browser open:
   - **HR:** http://127.0.0.1:8080/
   - **EN:** http://127.0.0.1:8080/en/
   - **Blog:** http://127.0.0.1:8080/blog/ and http://127.0.0.1:8080/en/blog/
   - **Legal:** http://127.0.0.1:8080/privacy.html, http://127.0.0.1:8080/terms.html, http://127.0.0.1:8080/privacy_hr.html, http://127.0.0.1:8080/terms_hr.html
3. **Check:**
   - Network tab: no 404s for CSS, JS, favicon, or hero image.
   - SVG icons and hero background render on both HR and EN.
   - Footer layout is the same on both languages and on legal pages.
   - Language switcher: HR → EN and EN → HR (and legal HR ↔ EN) go to the correct pages.
