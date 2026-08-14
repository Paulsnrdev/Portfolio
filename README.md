

Personal portfolio for Ajibade Paul Oluwasegun — a full-stack developer and founder of CHUNKZ. Static site (HTML/CSS/JS) showcasing projects, skills, and experience, with a self-built admin dashboard for managing site content without touching code.

## Structure

- `index.html`, `projects.html`, `style.css`, `script.js`, `projects-data.js` — the public site
- `admin/` — dashboard UI (login, section editors, messages inbox, analytics)
- `server/` — Node/Express/MongoDB API powering the dashboard (auth, content drafts/publish, contact messages, page-view analytics)
- `site-content.js` — fetches published content from the API on page load and overlays it onto the static markup, falling back to the hardcoded content if the API is unreachable

## Running locally

**Public site**: open `index.html` with VS Code's Live Server extension (port 5501).

**Admin dashboard**:
```
cd server
npm install
# fill in MONGODB_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD in .env
npm run seed   # first time only — creates the admin user and initial content
npm run dev
```
Then open `admin/login.html` via Live Server.

## Stack

React-free, build-step-free frontend by design. Backend: Node.js, Express, MongoDB (Mongoose), JWT auth.
