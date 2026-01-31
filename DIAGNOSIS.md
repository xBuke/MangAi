# MangAi HR/EN Site – Diagnosis Report

## 1) HTML entry points and language structure

| File | URL (as implemented) | Language |
|------|------------------------|----------|
| `index.html` | `/` | HR (Croatian) home |
| `en/index.html` | `/en/` or `/en/index.html` | EN (English) home |
| `blog/index.html` | `/blog/` | HR blog listing |
| `blog/post.html` | `/blog/post.html?slug=...` | HR blog post |
| `en/blog/index.html` | `/en/blog/` | EN blog listing |
| `en/blog/post.html` | `/en/blog/post.html?slug=...` | EN blog post |
| `privacy.html` | `/privacy.html` | EN Privacy Policy |
| `terms.html` | `/terms.html` | EN Terms of Service |
| `privacy_hr.html` | `/privacy_hr.html` | HR Pravila privatnosti |
| `terms_hr.html` | `/terms_hr.html` | HR Uvjeti korištenja |

**No** `en.html`; EN is served from the **folder** `/en/` via `en/index.html`. Canonical/hreflang point to `https://mangai.hr/` (HR) and `https://mangai.hr/en/` (EN).

---

## 2) HR vs EN HTML comparison

- **Templates:** Effectively **duplicates**. Same sections exist but EN has **different structure**: extra sections (`#get-in-touch`, `.value-props`), different contact block (no `.contact-cta`, no `.trust-row`), and different section order.
- **CSS/JS:** Both use the **same** `style.css` and `reveal.js`. HR uses relative paths from root (`style.css`, `reveal.js`); EN uses `../style.css`, `../reveal.js`, `../favicon.svg`. No `<base href>` on any page.
- **Root cause:** Relative paths from `/en/` work when the server resolves `../` correctly. The **hero background** in `style.css` uses `url('assets/hero-bg.png')`, which is resolved **relative to the CSS file**. When the CSS is loaded as `/style.css` (from `../style.css`), that resolves to `/assets/hero-bg.png`, so the hero image can work. Using **root-relative** paths in CSS (e.g. `/assets/hero-bg.png`) avoids any path confusion. Inline SVGs are identical on both (no external SVG files for those icons).

---

## 3) Why EN “icons” can fail

- **Inline SVGs:** All section icons (services, approach, difference, contact) are **inline `<svg>`** in the HTML; no `<img src>`, no `<use href>`, no background-image for those. Same markup on HR and EN, so they should render the same.
- **Favicon:** HR uses `href="favicon.svg"`, EN uses `href="../favicon.svg"`. From `/en/index.html`, `../favicon.svg` correctly points to the root `favicon.svg`. If the site is opened from a different base (e.g. subpath or file://), relative paths can break; **root-relative** (`/favicon.svg`) is safer.
- **Font Awesome:** Same CDN link on both; not language-dependent.
- **Conclusion:** The only asset that can “fail” on EN when paths are wrong is the **hero background** if the CSS URL is ever resolved relative to the document (e.g. in some setups). Unifying on **root-relative** paths for assets and CSS in both languages removes that risk.

---

## 4) Why the footer is broken (both languages)

- **HR home** (`index.html`) uses:
  - Wrapper: **`.footer-top`**
  - Columns: **`.footer-col.brand.footer-brand`**, **`.footer-col.services.footer-services`**, **`.footer-col.contact.footer-contact`**
- **All other pages** (EN home, privacy, terms, privacy_hr, terms_hr) use:
  - Wrapper: **`.footer-grid`**
  - First block: **`.footer-brand`** (no `.footer-col.brand` wrapper)
  - Then: **`.footer-col.footer-services`**, **`.footer-col.footer-contact`**
- **CSS:** Only **`.footer-top`** has the grid layout in `style.css` (e.g. `grid-template-columns: 1fr minmax(220px, 320px) 1fr`). There is **no** rule for **`.footer-grid`**, so the footer on EN home and all legal pages does **not** get the intended 3-column layout.
- **Conclusion:** Footer is broken wherever **`.footer-grid`** is used. Fix: use the **same** footer markup as HR home (**.footer-top** + **.footer-col.brand.footer-brand** + …) on **all** pages so the existing footer CSS applies everywhere.

---

## 5) EN “slug” / language routing

- **Routing:** Language is by **path**: HR = `/`, EN = `/en/`. No query params for language. Links: HR → `en/`, EN → `../`.
- **Link targets:** From root, `en/` correctly targets `en/index.html`. From `en/`, `../` correctly targets root. Blog: HR blog `../en/blog/` → EN blog; EN blog `../../blog/` → HR blog. These are correct.
- **Issues:**
  1. HR **home** footer links to **`privacy.html`** and **`terms.html`** (EN legal). They should link to **`privacy_hr.html`** and **`terms_hr.html`** for HR.
  2. EN legal pages (privacy/terms) and HR legal pages (privacy_hr/terms_hr) exist; footers should link to the correct language (HR footer → HR legal, EN footer → EN legal). EN legal pages currently have Croatian nav/footer labels; only content is EN.
- **Canonical/hreflang:** Present and correct on index and blog pages (e.g. HR canonical `/`, EN canonical `/en/`).

---

## Root-cause summary

| Issue | Cause |
|-------|--------|
| **Footer broken (both)** | Only HR home uses `.footer-top`; all other pages use `.footer-grid`, which has **no CSS**. Layout only works where `.footer-top` is used. |
| **EN “icons” / assets** | Inline SVGs are fine. Risk is **relative** asset paths (favicon, hero bg in CSS) when base URL is not root. Unifying on **root-relative** paths fixes this. |
| **EN slug/routing** | Paths are correct (`/en/`, `../`). **HR home footer** wrongly links to EN legal (`privacy.html` / `terms.html`) instead of HR legal (`privacy_hr.html` / `terms_hr.html`). |
| **HR/EN structure mismatch** | EN home has different sections (e.g. `#get-in-touch`, `.value-props`) and different contact block (no `.contact-cta` / `.trust-row`). Same IDs and class names as HR are needed for identical layout and behaviour. |

---

## Recommended fixes (minimal, safe)

1. **Assets:** Use root-relative paths: in `style.css` use `url('/assets/hero-bg.png')`; on EN and legal pages use `/favicon.svg`, `/style.css`, `/reveal.js` (and `/blog/blog.css` where applicable) so both languages load the same assets regardless of folder depth.
2. **Footer:** Replace **`.footer-grid`** with **`.footer-top`** and use **`.footer-col.brand.footer-brand`** (and same column classes as HR) on **en/index.html**, **privacy.html**, **terms.html**, **privacy_hr.html**, **terms_hr.html** so footer CSS applies identically.
3. **EN home:** Align section structure and IDs with HR: single contact section with **id="contact"**, **.contact.contact-cta**, **.contact-header**, **.trust-row**, **.contact-form-wrapper**; remove duplicate “Get in Touch” / value-props sections or fold into the same structure as HR; nav link to **#contact** (not #get-in-touch).
4. **HR home footer:** Change legal links from `privacy.html` / `terms.html` to **`privacy_hr.html`** / **`terms_hr.html`**.
5. **Legal pages:** Keep EN legal at `privacy.html` / `terms.html` and HR at `privacy_hr.html` / `terms_hr.html`. Ensure HR footers link to HR legal and EN footers to EN legal; optionally add language switcher in nav (EN ↔ HR) with correct targets. No new libraries; same styling via shared `style.css`.
