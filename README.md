# Scale Up Softwares — Company Website

Website for **Scale Up Softwares**, a UK software company building AI agents
for businesses.

## Pages

| File | Page |
|---|---|
| `index.html` | Homepage — company overview, services, how we work, about, demo form, FAQ, contact |
| `ai-voice-agents.html` | AI Voice Calling Agents — sample call, features, pricing, calculator |
| `whatsapp-booking-agents.html` | WhatsApp AI Booking Agents |
| `website-chatbots.html` | Website Chatbots |
| `privacy.html` | Privacy & cookie policy |

Shared files used by every page: `styles.css` (design), `site.js` (behaviour
and settings), `logo-mark.png`, `hero-voice.webp`, plus `logo.png`,
`og-image.png`, `apple-touch-icon.png`, `sitemap.xml`, `robots.txt`.

## Site settings

All business details live in the `CONFIG` block at the top of `site.js`:
email, phone, Formspree form ID, booking link, company name/number,
founder, testimonials. Edit once — every page updates. Anything left empty
stays hidden.

## Updating the live site

Upload changed files to the GitHub repository (Add file → Upload files →
Commit changes). Vercel publishes automatically within a minute.

## Demo requests (private admin page)

Every demo form on the site saves requests to a private page:
**https://www.scaleupsoftwares.co.uk/admin.html** (password protected, hidden from Google).

Files: `admin.html`, `api/demo-request.js` (saves a request), `api/leads.js`
(private list/update/delete), `api/_store.js` (shared helpers).

### One-time setup in Vercel
1. Vercel → your project → **Storage** (or **Marketplace**) → **Upstash for Redis** →
   create a free database → **Connect to project**. This adds the storage settings
   (`KV_REST_API_URL` / `KV_REST_API_TOKEN`) automatically.
2. Vercel → project → **Settings → Environment Variables** → add
   `ADMIN_PASSWORD` = a strong password (at least 12 characters). Tick Production.
3. **Deployments → ⋯ → Redeploy** so the new settings take effect.
4. Open `/admin.html`, log in, and send yourself a test request from the website.

Until steps 1–3 are done, forms still work: they fall back to opening the
visitor's email app (or Formspree, if a Formspree ID is set in `site.js`).
