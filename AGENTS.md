# IndTaxPay — Agent Notes (Workspace Conventions)

This repo is a **static multi-page site** (plain HTML/CSS/vanilla JS). There is **no build step** for the public website.

## Key Files / Entry Points

- **Global UI + layout injection**: `assets/js/site.js`
  - Renders and injects the **Navbar** and **Footer** into per-page slots.
  - Also contains theme toggle, mobile menu, scroll progress, deadline banner, etc.
- **Design system / tokens**: `assets/css/styles.css`
  - CSS variables (`:root`, `html[data-theme="dark"]`) define colors, typography, spacing, shadows.
- **Firebase helpers** (used by apply/track/admin flows): `backend/firebase-init.js`, `backend/firestore-helpers.js`
- **Mail server (Node)**: `backend/mail-server.js` (needs `backend/.env`)

## Shared Navbar/Footer (MOST IMPORTANT)

**Do not edit nav markup page-by-page.** Most pages contain:

- `<div id="navbarSlot"></div>`
- `<div id="footerSlot"></div>`

Those slots are populated by `assets/js/site.js`:

- Navbar HTML: `renderNavbar(base)`
- Footer HTML: `renderFooter(base)`
- Injection: `injectLayout()`

If a request is “add logo / add menu item / change navbar button”, update **only** `assets/js/site.js`.

### Logo convention

The current brand mark is an `<img>` inside `.brand__mark`:

- Asset path: `assets/logo.png`
- Markup is generated from `renderNavbar(base)` using: `${base}assets/logo.png`
- Sizing/fit is controlled by `.brand__mark` and `.brand__logo` in `assets/css/styles.css`.

## Base Paths (Nested Pages)

Pages declare their relative base via a body attribute:

- Root pages use: `<body data-base="./">`
- Nested pages use: `<body data-base="../">`

`assets/js/site.js` reads this via `getBase()` and prefixes all shared links/assets with `${base}`.

**When creating a new page**, ensure:

1. Correct `data-base` (so the injected navbar/footer links work)
2. Correct script path to `site.js` (e.g. `assets/js/site.js` vs `../assets/js/site.js`)
3. Add `#navbarSlot` and `#footerSlot` if you want the shared layout

## Active Nav Highlighting

Some pages set `data-active-nav` on `<body>` to highlight the current tab.

- `assets/js/site.js` looks for a `.navLink[data-nav="<value>"]` and sets `aria-current="page"`.
- Keep `data-active-nav` values aligned with the `data-nav` values used in `renderNavbar()`.

## Styling Rules of Thumb

- Prefer existing CSS variables (tokens) in `assets/css/styles.css`.
- Avoid introducing new hard-coded colors unless the design system already contains the token.
- The site supports light/dark themes via `html[data-theme="dark"]` overrides.

## Running Locally

This is a static site:

- Use any static server from the repo root (VS Code **Five Server**/**Live Server** works well)
- Or open `index.html` directly (some browser features may behave differently under `file://`)

## Backend: Mail Server (Optional)

`backend/mail-server.js` is a separate Node process used to send acknowledgement emails.

- Install deps: `cd backend && npm install`
- Create `backend/.env` with:
  - `GMAIL_USER`
  - `GMAIL_APP_PASSWORD`
  - optional: `MAIL_PORT`, `ALLOWED_ORIGIN`
- Run: `node mail-server.js`

## Gotchas / Legacy

- `main.js` appears unused by current HTML pages.
- `backend/script.js` is included by `apply.html` and contains some legacy navbar/mobile code paths; be cautious when changing it.
- Admin UI lives under `Admin/` and does **not** use the injected public navbar.
- `vercel.json` contains host-based redirects/rewrites for an admin subdomain; validate paths match the deployed folder layout.
