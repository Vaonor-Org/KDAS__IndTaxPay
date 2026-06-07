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

## Agent Runbook — Website Analysis (concise)

Purpose: help an AI agent quickly analyse and make safe UI changes to the site.

- Project type: static multi-page site (HTML, CSS, vanilla JS). No build step required for public pages.
- Run locally: use VS Code Five Server / Live Server or a simple static server:

  - `npx serve .` or
  - `python -m http.server 8080`

- Key files (edit only these for layout/theme changes):
  - `assets/js/site.js`: shared Navbar, Footer, theme toggle, mobile menu, megamenus — single source of truth for navigation and shared layout.
  - `assets/css/styles.css`: design tokens, color palettes, component styles, dark mode overrides.
  - `index.html`, `services/index.html`, page files: content pages should include `#navbarSlot` and `#footerSlot` and set `data-base` and optional `data-active-nav`.
  - `indtaxpay_design_prompt.json`: authoritative brand tokens and design guidance — link to it from prompts.

- Important conventions and safety rules for agents:
  1. Do not edit nav/footer markup in each page; change only `assets/js/site.js` to update shared layout or menu items.
 2. Respect `data-base` on pages; use `getBase()` from `site.js` when composing links.
 3. Keep CSS tokens in `:root` (in `assets/css/styles.css`); add new variables only when necessary and document them in `AGENTS.md`.
 4. Admin area (`Admin/`) is separate — avoid touching unless asked explicitly.
 5. Preserve accessibility: `aria-*`, `role`, keyboard focus, and `skipLink` must remain intact when refactoring.

- Quick analysis checklist an agent should run for any UI change:
  1. Identify target pages and whether they use injected layout (`#navbarSlot`/`#footerSlot`).
 2. Verify `data-base` and `data-active-nav` values on pages to avoid broken relative links.
 3. Run the site locally and test desktop + mobile (toggle responsive widths), theme toggle, megamenu, and mobile menu.
 4. Search for legacy scripts (`backend/script.js`, `main.js`) and confirm they are unused before removing.
 5. Run visual spot-checks for color contrast and token usage — prefer existing CSS variables.

- Suggested agent prompts (examples):
  - "Update the Services mega-menu to include new service categories — change only `assets/js/site.js`." 
  - "Create a new services category page scaffold: `services/<category>.html` with `data-base` set correctly and `#navbarSlot`/`#footerSlot` present." 
  - "Refactor `index.html` hero to use `--color-saffron` and ensure dark-theme readability." 

If you'd like, I can create a small `copilot-instructions.md` with applyTo rules scoped to `assets/js/site.js` and `assets/css/styles.css` to make UI-change requests more deterministic. What would you prefer next?
