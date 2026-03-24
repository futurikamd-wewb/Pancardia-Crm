# Hospital Marketing CRM

Hospital ke liye CRM-based web app jo digital marketing leads, patient follow-ups, testimonial collection, aur media management ko ek jagah organize kare.

## Problem

Hospital marketing teams ko leads alag-alag channels se milte hain:

- Facebook / Instagram ads
- Google ads
- Website forms
- WhatsApp inquiries
- Call center entries

Ye data messy ho jata hai. Result:

- duplicate leads
- missed follow-ups
- patient journey ka poor tracking
- testimonial collection ka weak process
- consent aur media approval ka missing record

## MVP Goal

Ek aisa web app banana jo:

- leads ko centralize kare
- follow-up workflow manage kare
- conversion stages track kare
- testimonial requests automate kare
- patient media aur consent records organize kare

## Recommended Stack

- Frontend: Next.js
- Backend: Next.js Route Handlers / Node.js
- Database: PostgreSQL
- ORM: Prisma
- Auth: Clerk ya NextAuth
- File Storage: Cloudinary ya AWS S3
- Notifications: WhatsApp API / SMS / Email later phase

## Documents

- [MVP blueprint](C:\Users\RAJESH\Documents\New project 11\docs\hospital-crm-mvp.md)
- [Starter database schema](C:\Users\RAJESH\Documents\New project 11\docs\db-schema.sql)
- [Free deploy guide](C:\Users\RAJESH\Documents\New project 11\docs\deploy-vercel-neon.md)
- [Post deploy checklist](C:\Users\RAJESH\Documents\New project 11\docs\post-deploy-checklist.md)

## Run Locally

1. Copy `.env.example` to `.env` and set `DATABASE_URL` if PostgreSQL ready hai.
2. Install dependencies: `npm.cmd install`
3. Start app: `npm.cmd run dev`
4. Open `http://localhost:3000`

Note:

- Agar `DATABASE_URL` set nahi hai, app mock data fallback use karega.
- Demo users multi-role mode me available hain:
- `admin@hospitalcrm.local / admin123`
- `marketing@hospitalcrm.local / market123`
- `counselor@hospitalcrm.local / counsel123`
- `content@hospitalcrm.local / content123`
- Local development me uploads `public/uploads/...` me save hoti hain.
- Production deploy ke liye Cloudinary env vars set karo.
- Mock mode uploaded media metadata `data/runtime/mock-db.json` me persist hota hai.
- Leads API: `/api/leads`
- Health API: `/api/health`
- Testimonials API: `/api/testimonials`
- New lead form: `/leads/new`
- New testimonial form: `/testimonials/new`
- Login page: `/login`
- User management: `/users`
- Lead edit page: `/leads/[id]/edit`
- Testimonial edit page: `/testimonials/[id]/edit`

## Real Database Setup

1. Start PostgreSQL:
   `docker compose up -d`
2. Copy env:
   `Copy-Item .env.example .env`
3. Generate Prisma client:
   `npm.cmd run prisma:generate`
4. Push schema to database:
   `npm.cmd run prisma:push`
5. Seed starter data:
   `npm.cmd run prisma:seed`
6. Start app:
   `npm.cmd run dev`

Agar Docker use nahi karna, to kisi existing PostgreSQL instance ka connection `.env` me set kar do.

## Free Online Deploy

Free deploy target:

- Hosting: Vercel
- Database: Neon
- File uploads: Cloudinary

Deployment steps detail:

- [Open deploy guide](C:\Users\RAJESH\Documents\New project 11\docs\deploy-vercel-neon.md)
- [Open post deploy checklist](C:\Users\RAJESH\Documents\New project 11\docs\post-deploy-checklist.md)

Build command for Vercel:

- `npm run vercel-build`

## Suggested Build Order

1. Auth + roles
2. Lead management dashboard
3. Follow-up workflow
4. Patient conversion pipeline
5. Testimonial and consent workflow
6. Media library
7. Reporting dashboard

## Next Step

Agle phase me hum is repo me actual `Next.js` app scaffold kar sakte hain aur dashboard + database integration start kar sakte hain.
Pancardia CRM
