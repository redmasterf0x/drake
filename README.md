# Drake Supabase Vite App

Minimal Vite + React app demonstrating Supabase email sign-up, confirmation flow, and protected dashboard.

Quick start

1. Install dependencies

```bash
cd /workspaces/drake
npm install
```

2. Create a local env file

Copy `.env.example` to `.env.local` and fill your Supabase values. Example keys (replace):

```
VITE_SUPABASE_URL=https://evphkvkmhzlbfcdczmmv.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
VITE_SITE_URL=https://starcastlivemedia.netlify.app
```

3. Run the dev server

```bash
npm run dev
```

Auth flow

- `/signup` — creates an account and sends a confirmation email.
- Email confirmation should redirect to `/confirm` (the app expects that). Press the "I've confirmed" button which will take you to sign in.
- `/signin` — sign in with your credentials and you'll be redirected to `/dashboard`.

Notes

- This scaffold stores pending signup email temporarily in `localStorage` under `pendingSignup` until the user completes email confirmation.
- For production deployments (Netlify), set `VITE_SITE_URL` to your site URL (for example `https://starcastlivemedia.netlify.app`). The signup flow will use `VITE_SITE_URL/confirm` as the email confirmation redirect when present. Also add that URL to your Supabase project's "Redirect URLs" in the Authentication settings.
- The project uses `@supabase/supabase-js` v2 APIs. If a method name differs because of version changes, update the call per Supabase docs.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
