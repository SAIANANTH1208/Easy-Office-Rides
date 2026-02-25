# Easy Office Rides

Live: `https://easyofficerider-dg3ssv34f-saiananthk-5852s-projects.vercel.app/`

## Tech Stack
- Next.js 14 (App Router)
- React 18 + TypeScript
- Supabase Postgres (database only)
- JWT auth (custom) + bcryptjs
- Google Maps Places API (autocomplete)

## Run Locally
```bash
npm install
npm run dev
```

## Environment Variables
Create `.env.local` in the project root:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

Notes:
- `SUPABASE_SERVICE_ROLE_KEY` is required for server routes to bypass RLS on `public.profiles` and `public.rides`.
- `JWT_SECRET` should be a strong random string in production.

## Database Setup (Supabase SQL Editor)

1) Profiles ownership + password hash:
```sql
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_vehicle_owner BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS password_hash TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_unique_ci
ON public.profiles (LOWER(email));
```

2) Rides location fields:
```sql
ALTER TABLE public.rides
ADD COLUMN IF NOT EXISTS pickup_latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS pickup_longitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS drop_latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS drop_longitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS pickup_address TEXT,
ADD COLUMN IF NOT EXISTS drop_address TEXT;
```

3) If you are NOT using Supabase Auth, ensure `profiles.id` can be generated:
```sql
ALTER TABLE public.profiles
ALTER COLUMN id SET DEFAULT gen_random_uuid();
```

4) RLS: keep enabled and use service role key on the server:
```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;
```
No policies are required if server routes always use the service role key.

## Route Overview

Public pages:
- `/` (landing)
- `/login`
- `/signup`
- `/search` (reads search params, fetches available rides)

Protected pages:
- `/dashboard` (requires login; redirects to `/login` if no JWT cookie)

API routes:
- `POST /api/auth/signup` (create profile, email+password)
- `POST /api/auth/login` (email+password login)
- `GET /api/user/me` (current profile)
- `POST /api/rides/create` (create ride; only vehicle owners)
- `GET /api/rides/search` (search rides within 4 km)

## Notes
- Search uses a server-side Haversine filter to keep it simple; no PostGIS required.
- Bangalore-only restriction is enforced in `/api/rides/create` and `/api/rides/search`.
