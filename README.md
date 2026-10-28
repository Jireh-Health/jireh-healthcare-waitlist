# Jireh Healthcare Waitlist

Healthcare provider waitlist application for Jireh Health.

## Project

This is a Next.js-based application that collects healthcare provider information and manages signups for Jireh Health's healthcare provider network. Providers submit their details and consent to participate in the waitlist.

## Local setup

1. Clone the repository:
```bash
git clone https://github.com/Jireh-Health/jireh-healthcare-waitlist.git
cd jireh-healthcare-waitlist
```

2. Copy environment variables:
```bash
cp .env.example .env.local
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Supabase setup

Both `patient_waitlist` and `healthcare_waitlist` tables live in the same Supabase project.

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. In the SQL Editor, run the schema from `patient_waitlist` first (if not already present)
3. Then run the schema from `supabase/schema.sql` in this repo
4. Copy your Supabase URL and anon key to `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Resend setup

Email notifications use [Resend](https://resend.com).

1. Create a Resend account and generate an API key
2. Set `RESEND_API_KEY` in `.env.local`
3. Set `NOTIFICATION_EMAIL` to the email address for healthcare provider notifications

Note: Use the same Resend API key as the `jireh-patient-waitlist` application.

## Deployment

Deploy to Vercel:

1. Connect your repository to Vercel
2. Set the following environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `RESEND_API_KEY`
   - `NOTIFICATION_EMAIL`
3. Set the production domain to `healthcare.jireh-health.com`
4. Optionally add `/healthcare/signup` to Vercel edge redirects (or use Next.js server redirects)

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
