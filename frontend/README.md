# MediCare HMS — Frontend

## Setup
```bash
npm install
npm run dev
```
App runs on http://localhost:3000 (proxying /api to http://localhost:5000 — update `vite.config.js` if your backend runs elsewhere).

## What changed in this pass
- **`src/index.css`** — completely rewritten. The old file had dozens of `!important` overrides using brittle `:has()` / sibling selectors patched on top of Tailwind, which is what caused the overlapping/spacing bugs. It's now a clean Tailwind v4 `@theme` + CSS variable setup — no hacks, no `!important`.
- **`src/pages/landing/Hero.jsx`** — new landing page (didn't exist before). Shows portals, features, stats. "Sign In" opens the login as a modal instead of being a full separate page.
- **`src/pages/auth/LoginForm.jsx`** + **`LoginModal.jsx`** — your original `LoginPage` logic (auth calls, demo login, validation) moved into a reusable form, now rendered inside a modal. No auth/logic changes.
- **`src/components/layout/index.jsx`** — Sidebar/Navbar cleaned up (no longer depends on CSS hacks to size the content area), added a **Footer** component, and a quick **"Overview" button** in the navbar that jumps straight to your role's dashboard from anywhere in the app.
- **`src/App.jsx`** — `/` now shows the Hero page; `/login` still works (opens the same page with the login modal pre-opened) for any bookmarked links. All route guards / role logic unchanged.
- **`src/pages/patient/PatientDashboard.jsx`** — one hardcoded `bg-blue-600` button swapped for the shared themed `Button` component. That's the only page-level change; every other page's business logic (fetch calls, state, handlers) is untouched.
- **`src/components/ui/index.jsx`** — kept as-is (your component library was already solid — the bug was entirely in the CSS file fighting it).

## Theme
Colors are defined in `src/index.css` under `@theme` (primary/accent/warning/danger/teal/purple/rose) and as CSS variables under `:root` / `.dark` for backgrounds, text, borders etc. Dark/light toggle is unchanged — still backed by `ThemeContext` — just restyled.

## Notes
- I don't have network access in this sandbox, so I couldn't run `npm install` / `npm run dev` here to do a live visual check — please run it locally and ping me if anything looks off, happy to iterate.
- `package.json` was recreated based on the imports found in your code (react-router-dom, lucide-react, recharts, jspdf, tailwindcss v4 + @tailwindcss/vite). If your original had extra/different versions, swap them in.
