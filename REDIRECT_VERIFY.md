# Redirect verification (blog + trailing slash)

Use these commands to confirm no redirect loops and correct 301 → 200 behaviour.

## Expected behaviour

- `/blog` → **301** → `/blog/` → **200**
- `/en/blog` → **301** → `/en/blog/` → **200**
- `/blog/` and `/en/blog/` must **not** redirect to each other.

## Curl commands (run against live site)

```bash
# Blog index: no slash → 301 to /blog/
curl -I https://mangai.hr/blog

# Blog index: with slash → 200
curl -I https://mangai.hr/blog/

# EN blog: no slash → 301 to /en/blog/
curl -I https://mangai.hr/en/blog

# EN blog: with slash → 200
curl -I https://mangai.hr/en/blog/
```

## What to check

- First response for `https://mangai.hr/blog` should be `301` with `Location: https://mangai.hr/blog/`.
- First response for `https://mangai.hr/blog/` should be `200`.
- No chain that goes /blog → /en/blog or /en/blog → /blog.

## Host config

- **Vercel**: `vercel.json` redirects (already in repo).
- **Netlify**: `_redirects` (already in repo).
- **Apache**: add rules from `.htaccess.redirects-example` if you use Apache.
