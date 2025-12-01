## Lead Tracking & Management System

A full‑stack app to register websites, detect and register forms, capture submissions from external sites, manage leads, and view analytics.

### Features
- Admin auth (signup/login), protected routes
- Websites: add, edit, delete
- Form registration
  - Auto‑detect forms on a page (server‑side HTML parse)
  - Manual extraction for any page URL (preview → save)
  - Manual create a form (no extraction needed)
- Lead capture (JS snippet)
  - Works on any external site (WordPress, Shopify, React/Next, etc.)
  - Captures form submits using `navigator.sendBeacon`/`fetch`
  - SPA-friendly API `window.LTM_SEND_LEAD(formId, data)`
- Leads dashboard: list, paginate, filter (website, form, date)
- Analytics: leads per day, top forms
- Theming: light/dark toggle; customizable palette

---

## Quick start

Prereqs: Node 18+, MongoDB (local or cloud)

1) Backend
```
cd backend
npm install
```
Create `backend/.env`:
```
MONGODB_URI=mongodb://127.0.0.1:27017/lead_tracking
JWT_SECRET=replace_me
# Optional: if you serve capture.js from a tunnel, set the origin there
# CAPTURE_API_BASE=https://your-tunnel.lhr.life
# If you lock down CORS, pass allowed origins (comma-separated)
# CAPTURE_ALLOWED_ORIGINS=https://yourapp.example.com,https://your-site.com
```
Run:
```
npm run dev
```
Health check: open `http://localhost:5000/health` → `{ "status": "ok" }`

2) Frontend
```
cd frontend
npm install
```
Create `frontend/.env` (optional):
```
VITE_API_URL=http://localhost:5000
```
Run:
```
npm run dev
```
Open the shown URL (typically `http://localhost:5173`).

---

## How to use

1) Sign up / log in
2) Add a website (use the exact page with a form if possible)
3) Register forms:
   - Auto‑detect: Websites → “Auto‑detect” on the row
   - Manual extraction: Forms → “Manual Extraction” → paste page URL → Extract → Save Form
   - Manual create: Forms → “Create Manually” (useful for SPA/logged‑in pages)
4) Install the snippet on the external site
   - In Forms list, click “Snippet” for that form and copy it.
   - Paste before `</body>` on the target site.

Example snippet:
```html
<!-- Use YOUR public HTTPS origin that serves capture.js -->
<script src="https://YOUR_PUBLIC_HOST/capture.js" async></script>
<script>window.LTM_FORM_ID="FORM_ID"</script>
```
Options to bind a form:
- Add `data-ltm-form="FORM_ID"` to the actual `<form>` element, or
- Set `window.LTM_FORM_ID='FORM_ID'` to attach to the first form on the page.

SPA/non-form submits:
```html
<!-- Call this from your click/submit handler -->
<script>
  // Available after capture.js loads
  // window.LTM_SEND_LEAD(formId, dataObject)
  // Example:
  window.LTM_SEND_LEAD("FORM_ID", { email: "a@b.com", name: "Alice" });
</script>
```

5) Submit a form → view the lead under Leads; charts appear under Analytics.

---

## Important integration notes

- Always load `capture.js` over HTTPS if the page is HTTPS. Never point to `http://localhost` on a public HTTPS page (browser will block mixed content).
- The snippet posts to the same origin that serves `capture.js`. If you serve `capture.js` from `https://your-tunnel.lhr.life`, the lead POST will go there too (`/api/leads/:formId`).
- Auto‑detect scans exactly one page you saved (no crawling). Forms rendered only by client‑side JS or inside iframes won’t be detected reliably; use Manual Extraction or “Create Manually” + snippet instead.
- Beacon requests may show as “canceled” in DevTools if the page navigates after submit. They typically still deliver. For testing, set the form `action="#"` or call `window.LTM_SEND_LEAD` before navigation.

Example public form (for testing only): [W3Schools sample](https://www.w3schools.com/html/tryit.asp?filename=tryhtml_form_submit)

---

## Backend overview

- Node.js + Express, MongoDB (Mongoose), JWT auth
- Public endpoint: `GET /capture.js` (serves the embed script)
- Auth: `POST /auth/signup`, `POST /auth/login`
- Websites: `GET/POST/PUT/DELETE /api/websites`
- Forms:
  - `GET /api/forms` (filter by `websiteId`)
  - `POST /api/forms` (manual create: `{ websiteId, formUrl, fields }`)
  - `POST /api/forms/extract` (preview fields from `{ formUrl }`)
  - `POST /api/forms/auto-detect/:websiteId` (detect + save from stored website URL)
  - `DELETE /api/forms/:id`
- Leads:
  - Public capture: `POST /api/leads/:formId` (body: `{ data, href, userAgent, submittedAt }` or raw `{...}`)
  - List: `GET /api/leads?websiteId=&formId=&startDate=&endDate=&page=&limit=`
- Analytics:
  - `GET /api/analytics/leads-per-day`
  - `GET /api/analytics/leads-per-form`

Form detection service:
- Fetches the page HTML (axios), parses with JSDOM, finds `<form>`, extracts `action` (absolute URL) and fields from `input/select/textarea` (skips non‑data inputs). Dedupe by name.

Lead capture (capture.js):
- Attaches to `form[data-ltm-form]` or the first form if `window.LTM_FORM_ID` is set.
- Serializes values by `name`, `data-name`, or `id`.
- Sends via `navigator.sendBeacon` (falls back to `fetch`).

---

## Frontend overview

- React + Vite, React Router, React Query, TailwindCSS
- Pages: Login, Signup, Dashboard, Websites, Forms, Manual Extraction, Leads, Analytics
- UI: light/dark theme toggle; iconified inputs/buttons; shared components (`Button`, `Input`, `Card`, `Modal`, `Table`, `Pagination`)
- Snippet helper modal (`CopySnippet`) per form

Theming:
- `src/providers/ThemeProvider.jsx` toggles `dark` class on `<html>`
- Tailwind colors in `frontend/tailwind.config.js`
- Base CSS vars in `frontend/src/index.css`

---

## Deploying capture.js over HTTPS

For external HTTPS pages you don’t control, you need an HTTPS origin to serve `capture.js`:

Option A: Tunneling
- Run your backend locally on port 5000
- Start a tunnel (e.g., localhost.run/ngrok/Cloudflare Tunnel) → you receive an HTTPS URL like `https://xxxx.lhr.life`
- Use that URL in the snippet:
```html
<script src="https://xxxx.lhr.life/capture.js" async></script>
<script>window.LTM_FORM_ID="FORM_ID"</script>
```

Option B: Host the backend publicly behind HTTPS and use that domain.

---

## Troubleshooting

**capture.js 503 / net::ERR**  
Tunnel down or wrong URL. Open `https://your-host/health` and `https://your-host/capture.js`. Restart tunnel/server if needed.

**CORS / Mixed content**  
Do not load `http://localhost` on an HTTPS page. Load `capture.js` from an HTTPS origin, then the lead POST will target the same origin.

**Beacon shows “canceled”**  
Common after navigation. Lead often still arrives. For testing, prevent navigation or call `window.LTM_SEND_LEAD` before redirect.

**Auto‑detect finds nothing**  
Likely client‑rendered forms or iframes. Use Manual Extraction or “Create Manually”, then embed the snippet.

**Field values missing**  
Ensure inputs have `name`, or add `data-name`/`id`. The serializer uses `name || data-name || id`.

**Sites blocking bots**  
Auto‑detect might return upstream errors (403/504). You’ll see clear backend messages. Use manual flows + snippet as a fallback.

---

## Security & notes
- Auth protected CRUD/read endpoints; public capture endpoint is form‑ID scoped.
- Do not log sensitive data. If capturing passwords, ensure you have consent and secure storage policies.
- Consider rate limiting, spam filters, and webhook signing in production.

---

## Mapping to assignment rubric
- Auth & website CRUD
- Form registration: auto‑detect + manual extraction + manual create
- Lead capture: JS snippet + SPA API
- Leads dashboard: list + filters
- Analytics: two widgets (per day, per form)
- Docs: this README (setup + architecture + integration)

---

## License
For interview/use‑case purposes. Adapt before production.


