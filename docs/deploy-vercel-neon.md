# Free Deploy Guide

This project is prepared for free demo hosting with:

- Vercel for app hosting
- Neon for PostgreSQL
- Cloudinary for uploads

## Before You Start

You need accounts for:

- GitHub
- Vercel
- Neon
- Cloudinary

## 1. Push to GitHub

From the project folder:

```powershell
git init
git add .
git commit -m "Prepare Pancardia CRM for deployment"
```

Then create a GitHub repo and push:

```powershell
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

## 2. Create a Free Neon Database

1. Create a Neon project.
2. Copy the PostgreSQL connection string.
3. Save it for `DATABASE_URL`.

## 3. Create a Free Cloudinary Project

Collect these values:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## 4. Import Into Vercel

1. Open Vercel.
2. Import the GitHub repository.
3. Keep framework as Next.js.
4. Vercel will use [vercel.json](C:\Users\RAJESH\Documents\New project 11\vercel.json).

## 5. Add Environment Variables in Vercel

Add:

- `DATABASE_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Optional:

- `NODE_ENV=production`

## 6. Deploy

Click deploy.

The project is configured to run:

```powershell
npm run vercel-build
```

That command runs:

```powershell
prisma generate && next build
```

## 7. Set Up Database Schema

After env vars are ready, run once against the live database:

```powershell
npm.cmd run prisma:push
npm.cmd run prisma:seed
```

You can run these locally with the production `DATABASE_URL`, or from a secure terminal connected to the same repo.

## 8. Demo Login Accounts

- `admin@hospitalcrm.local / admin123`
- `marketing@hospitalcrm.local / market123`
- `counselor@hospitalcrm.local / counsel123`
- `content@hospitalcrm.local / content123`

## Important Notes

- Local filesystem uploads should not be used in production.
- If Cloudinary env vars are missing in production, uploads will fail by design.
- This setup is suitable for demo, pilot, and light usage.
- For real hospital production use, security, audit, backup, and compliance work still need to be tightened.
