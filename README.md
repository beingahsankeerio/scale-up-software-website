# Scale Up Software — Company Website

Company website for **Scale Up Software Solutions**, a UK software company
selling AI voice calling agents, WhatsApp AI booking agents, and chatbots.

## Contents

- `index.html` — the full site (single self-contained file: hero, sample-call
  demo, services, pricing, industries, cost calculator, FAQ, demo-request form,
  contact)
- Demo requests open the visitor's email app addressed to
  scaleupdoftwares@gmail.com

## Run locally

Open `index.html` in any browser, or serve it:

```sh
python3 -m http.server 8000
```

## Push to GitHub

```sh
git init
git add .
git commit -m "Initial commit: Scale Up Software website"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

To host it free with GitHub Pages: repo Settings → Pages → Deploy from a
branch → `main` → `/ (root)`.
