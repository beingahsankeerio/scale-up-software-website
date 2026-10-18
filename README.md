# Scale Up Softwares — Company Website

Company website for **Scale Up Softwares**, a UK software company selling
AI voice calling agents, WhatsApp AI booking agents, and chatbots.

## Contents

- `index.html` — the full site (hero, sample-call demo, services, pricing,
  industries, testimonials, cost calculator, FAQ, demo-request form, contact)
- `privacy.html` — privacy & cookie policy (fill in the [bracketed] details)

## Site settings

All business details live in one place: the `CONFIG` block near the top of
the `<script>` at the bottom of `index.html`. Edit the values, save, upload.
Anything left empty stays hidden on the page.

| Setting | What it does |
|---|---|
| `email` | Contact email used in every link and the form |
| `phone` | Shows your AI-answered number in the header, hero, contact and footer |
| `formspreeId` | Sends demo requests straight to your inbox (free at formspree.io); empty = opens the visitor's email app |
| `bookingUrl` | Calendly / Cal.com link so visitors can pick a demo slot |
| `legalName`, `companyNumber`, `registeredIn` | Legal disclosures required for UK companies |
| `founderName`, `founderUrl` | Founder shown in the About section |
| `testimonials` | Adds a "What owners say" section once you add one |

## Run locally

Open `index.html` in any browser, or serve it:

```sh
python3 -m http.server 8000
```

## Hosting

GitHub Pages: repo Settings → Pages → Deploy from a branch → `main` → `/ (root)`.
Upload `index.html`, `privacy.html`, `logo.png`, `og-image.png` and `apple-touch-icon.png` together.
