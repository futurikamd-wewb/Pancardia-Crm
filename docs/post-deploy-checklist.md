# Post Deploy Checklist

After deploying on Vercel, verify these:

## 1. App Opens

Open your deployed URL and confirm:

- login page loads
- no 500 error
- no blank screen

## 2. Health Check

Open:

`/api/health`

Expected:

- `ok: true`
- `database: true`
- `cloudinary: true`

If `database` is false:

- check `DATABASE_URL` in Vercel

If `cloudinary` is false:

- check Cloudinary environment variables

## 3. Database Ready

Confirm you already ran:

```powershell
npm.cmd run prisma:push
npm.cmd run prisma:seed
```

## 4. Login Test

Try:

- `admin@hospitalcrm.local / admin123`

Then verify:

- dashboard opens
- `/users` opens
- `/leads/new` opens

## 5. Lead Creation Test

Create one patient lead and check:

- it saves without error
- it appears in leads list
- lead detail page opens

## 6. Testimonial Upload Test

Create a testimonial request and upload one file.

Confirm:

- upload succeeds
- file link appears
- file opens

## 7. Final Check

Make sure these routes work:

- `/`
- `/login`
- `/users`
- `/leads`
- `/leads/new`
- `/testimonials`
- `/testimonials/new`
