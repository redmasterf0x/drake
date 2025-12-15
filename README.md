# Drake Supabase Vite App

Minimal Vite + React app demonstrating Supabase email sign-up, confirmation flow, and protected dashboard.

Quick start

# Drake Supabase Vite App

Minimal Vite + React app demonstrating Supabase email sign-up, confirmation flow, protected dashboard, and user profiles.

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
- Email confirmation should redirect to `/confirm` (the app expects that). After confirming, sign in and your profile will be created/updated.
- `/signin` — sign in with your credentials and you'll be redirected to `/dashboard`.

Notes

- This scaffold stores pending signup info temporarily in `localStorage` under `pendingSignup` until the user completes email confirmation.
- For production deployments (Netlify), set `VITE_SITE_URL` to your site URL (for example `https://starcastlivemedia.netlify.app`). The signup flow will use `VITE_SITE_URL/confirm` as the email confirmation redirect when present. Also add that URL to your Supabase project's "Redirect URLs" in the Authentication settings.
- The project uses `@supabase/supabase-js` v2 APIs. If a method name differs because of version changes, update the call per Supabase docs.

Profiles and storage

- This app stores profile data in a Postgres `profiles` table instead of using `auth.user_metadata`.
- To create the `profiles` table and RLS policies, run the SQL migration in `supabase/migrations/001_create_profiles.sql` in your Supabase project's SQL editor.
- Create a Storage bucket named `avatars` in Supabase (we use public URLs by default). If you want private avatars, set the bucket to private and update the code to use signed URLs.

Applying the migration

1. Open Supabase dashboard → SQL Editor.
2. Copy the contents of `supabase/migrations/001_create_profiles.sql` and run it.
3. Create a Storage bucket named `avatars`.

After that, the signup flow will upsert rows into `profiles` when users sign in after confirming their email. Avatar uploads will be stored in the `avatars` bucket and the public URL saved to the `profiles.avatar_url` column.
