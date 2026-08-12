# ClinicCare Frontend

ClinicCare is a production-style bilingual clinic appointment portfolio application built with Next.js and connected to a Django REST API.

## Live demo

- Frontend: `https://appointment-booking-system-abaid-team.vercel.app`
- API: `https://clinic-care-api-production.up.railway.app/api/`

## Highlights

- English and Arabic UI with persistent language selection
- Full RTL/LTR switching
- Light and dark themes with persistent preference
- Animated ClinicCare splash experience
- Responsive premium landing, doctor, auth, booking, dashboard, and appointment screens
- JWT authentication through secure HttpOnly cookies
- Protected Dashboard, My Appointments, and Booking routes
- Guest booking redirects to Login and returns to the requested booking after authentication
- Live doctor schedules and available appointment slots
- Patient-owned appointment history and cancellation
- Loading, error, empty, and success states
- API-ready architecture with no localStorage booking data

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Django REST Framework API
- Railway PostgreSQL production database
- Vercel deployment

## Local setup

```powershell
cd "C:\Users\Bismi\Desktop\Personal Projects\appointment-booking-system"
npm install
Copy-Item .env.example .env.local
npm run dev
```

Local frontend: `http://localhost:3000`

`.env.local`:

```env
API_BASE_URL=http://127.0.0.1:8000/api
```

## Quality checks

```powershell
npm run lint
npm run build
```

## Production environment

On Vercel set:

```env
API_BASE_URL=https://clinic-care-api-production.up.railway.app/api
```

Do not commit `.env.local`.

## Main flows

1. Browse doctors publicly.
2. Open a doctor profile.
3. Booking requires authentication.
4. Register or sign in.
5. Return to the requested doctor booking screen.
6. Select a live clinic date/slot and book.
7. Track status from Dashboard / My Appointments.
8. Cancel eligible future appointments.

## Repository pairing

This repository is the Next.js frontend. The Django backend lives in the separate `clinic-care-api` repository.
