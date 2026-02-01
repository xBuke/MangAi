# Blog URL Migration – Clean URLs

Blog posts now use canonical URLs: `/blog/<slug>.html` (e.g. `/blog/ai-alati-hrvatska.html`).

## Generator

Run after adding or editing posts:

```bash
node scripts/generate-blog.js
```

No npm install required. Regenerates:
- `blog/<slug>.html` (HR)
- `en/blog/<slug>.html` (EN)
- `sitemap.xml`

## Verification Checklist

- [ ] **Old URL redirects to new** – Visit `/blog/post.html?slug=ai-alati-hrvatska` → redirects to `/blog/ai-alati-hrvatska.html`
- [ ] **New URL loads** – Visit `/blog/ai-alati-hrvatska.html` → page renders with title, content, nav
- [ ] **Blog index links** – Visit `/blog/` → post cards link to `/<slug>.html`
- [ ] **Sitemap** – Open `/sitemap.xml` → contains all blog URLs with `.html`
- [ ] **Internal links** – Within a post, links to other posts use `/<slug>.html`

## Files Changed

| File | Change |
|------|--------|
| `scripts/generate-blog.js` | New – generates static HTML + sitemap |
| `blog/index.js` | Links use `slug.html` |
| `en/blog/index.js` | Same |
| `blog/post.html` | Legacy redirect script + lang link |
| `en/blog/post.html` | Same |
| `blog/post.js` | Canonical/related URLs updated |
| `en/blog/post.js` | Same |
| `blog/index.html` | Schema.org ItemList URLs |
| `en/blog/index.html` | Same |
| `sitemap.xml` | All URLs use `.html` |
| `en/blog/posts.json` | Fixed JSON escape (buy or rent) |
| `blog/posts.json` | Internal links to `.html` |

## Generated Files

- `blog/ai-alati-male-tvrtke-hrvatska-2026.html`
- `blog/ai-automatizacija-poslovanja-hrvatska.html`
- `blog/ai-alati-hrvatska.html`
- `blog/ai-automatizacija-poslovanja.html`
- `blog/ai-strategija-mali-biznis.html`
- `blog/ai-agenti-korisnicka-podrska-prodaja.html`
- `blog/ai-alati-poduzetnici-kategorije.html`
- `en/blog/ai-alati-hrvatska.html`
- `en/blog/ai-automatizacija-poslovanja.html`
- `en/blog/ai-strategija-mali-biznis.html`
- `en/blog/ai-agenti-korisnicka-podrska-prodaja.html`
- `en/blog/ai-alati-poduzetnici-kategorije.html`
