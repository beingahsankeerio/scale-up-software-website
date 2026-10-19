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
