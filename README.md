# ABD World Rice — Premium Rice Wholesaler Website

A premium, animated, fully responsive **rice wholesaler / supplier website** built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Supabase (PostgreSQL)**. Deployable directly to **Vercel** — no PHP, no traditional hosting, no cPanel.

---

## ✨ Features

- **Premium homepage** — animated hero ("Premium Rice. Trusted Quality."), floating rice-grain particles, featured collection, why-choose-us cards, quality process timeline, animated counters, and CTA.
- **Rice Collection** — searchable, filterable product catalogue with category / price / pack-size filters, pagination, and a beautiful mobile slide-out filter panel.
- **Product Detail pages** — image gallery (thumbnails, zoom, fullscreen), optional product video player (lazy-loaded, no autoplay-with-sound), rich product information, animated specification cards, related products, and **JSON-LD structured data** for SEO.
- **Order / Enquiry system** — low-cost, no payment infrastructure required:
  - `Send Order Enquiry` → stored in Supabase `orders` table.
  - `Order via WhatsApp` → dynamically generated WhatsApp message with product, pack size, quantity, customer name and location.
- **Wholesale section** — dedicated page with bulk audiences, partnership benefits, "how it works" steps, and a wholesale quote request form.
- **Contact page** — phone / WhatsApp / email / address cards, business hours, and a contact form.
- **Admin panel** (single admin only):
  - Dashboard with stats (total products, new orders, new enquiries, active products).
  - Add / edit / soft-delete products (images, video URL, pack sizes, prices, specs, SEO).
  - Manage orders with status workflow (`new → contacted → confirmed → processing → completed → cancelled`).
  - Manage wholesale enquiries and contact messages.
  - Update site settings (business name, phone, WhatsApp, email, address, social links, about content, business hours).
- **SEO** — per-product metadata, Open Graph, sitemap.xml, robots.txt, semantic HTML, clean URLs, breadcrumbs.
- **Security** — parameterized Supabase queries, RLS policies, server-side admin authorization, bcrypt password hashing, JWT sessions (httpOnly cookies), login rate limiting, input sanitization & zod validation, upload validation, secure HTTP headers (CSP, X-Content-Type-Options, Referrer-Policy).
- **Performance** — Next.js Image-ready, lazy-loaded media, code splitting, lightweight animations that respect `prefers-reduced-motion`.

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- Node.js 18+ (or 20+ recommended)
- npm
- A free [Supabase](https://supabase.com) project
- A free [Vercel](https://vercel.com) account

### 1. Install dependencies

```bash
cd rice-wholesaler
npm install
```

### 2. Create the Supabase database

1. Go to your Supabase project → **SQL Editor**.
2. Open `supabase-schema.sql` from this repository.
3. Copy the entire contents and paste into the SQL Editor.
4. Click **Run**.

This creates all tables (`admins`, `products`, `orders`, `wholesale_enquiries`, `contact_messages`, `site_settings`), indexes, and **Row Level Security** policies.

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY

ADMIN_EMAIL=your-admin@email.com
ADMIN_INITIAL_PASSWORD=your-secure-password

NEXT_PUBLIC_WHATSAPP_NUMBER=919999999999
NEXT_PUBLIC_BUSINESS_NAME=ABD World Rice
NEXT_PUBLIC_BUSINESS_PHONE=+919999999999
NEXT_PUBLIC_BUSINESS_EMAIL=info@yourdomain.com
```

> **Where to find Supabase keys:** Supabase Dashboard → **Settings → API**.
> - `anon`/`publishable` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
> - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (**server-only — never expose it to the browser**)

> **Never commit `.env.local`.** It is already in `.gitignore`.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Admin login

1. Go to `http://localhost:3000/admin/login`.
2. Sign in using `ADMIN_EMAIL` and `ADMIN_INITIAL_PASSWORD`.
3. On first login the admin record is created securely in the `admins` table with a bcrypt-hashed password.

> There is **no registration, signup, or invite flow**. Only the single admin configured via environment variables can log in.

---

## ☁️ Deploying to Vercel

### 1. Push the project to GitHub

```bash
git init
git add .
git commit -m "Initial commit: ABD World Rice"
git remote add origin https://github.com/YOUR_USERNAME/rice-wholesaler.git
git push -u origin main
```

### 2. Import into Vercel

1. Go to [vercel.com](https://vercel.com) and click **Add New → Project**.
2. Import your GitHub repository.
3. Vercel auto-detects the **Next.js** framework.

### 3. Add environment variables in Vercel

In the project settings → **Environment Variables**, add the same values from your `.env.local`:

| Name                          | Example                          |
| ----------------------------- | -------------------------------- |
| `NEXT_PUBLIC_SITE_URL`        | `https://yourdomain.com`         |
| `NEXT_PUBLIC_SUPABASE_URL`    | `https://xxxx.supabase.co`       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...`                       |
| `SUPABASE_SERVICE_ROLE_KEY`   | `eyJ...` (secret — server only)  |
| `ADMIN_EMAIL`                 | `admin@yourdomain.com`           |
| `ADMIN_INITIAL_PASSWORD`      | `your-secure-password`           |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `919999999999`                   |
| `NEXT_PUBLIC_BUSINESS_NAME`   | `ABD World Rice`                 |
| `NEXT_PUBLIC_BUSINESS_PHONE`  | `+919999999999`                  |
| `NEXT_PUBLIC_BUSINESS_EMAIL`  | `info@yourdomain.com`            |

> Add these to **Production**, and optionally **Preview** / **Development** environments too.

### 4. Deploy

Click **Deploy**. Vercel builds and serves the site at a `*.vercel.app` URL.

### 5. Connect a custom domain

1. In your Vercel project → **Settings → Domains**.
2. Add your domain (e.g. `abdworldrice.com`).
3. Follow the DNS instructions (add an `A` record to Vercel's IPs, or a `CNAME` for subdomains).
4. Once DNS propagates (minutes to a few hours), your site is live on your domain.
5. Update `NEXT_PUBLIC_SITE_URL` to your real domain and redeploy.

### 6. Production configuration

- **In Supabase Dashboard → Auth:** if you don't use Supabase Auth (this site uses custom JWT sessions), you can leave Auth enabled but unused.
- **RLS is already enabled** on all tables — public visitors can only read active products and public settings. Orders, enquiries, contacts, and admin data are fully restricted (server-side access only via the service role).
- Change `ADMIN_INITIAL_PASSWORD` after first login considerations:
  - The credentials are **never hardcoded** in source code.
  - For extra safety, after the first login the admin password hash is stored in Supabase; subsequent logins compare against the stored hash.

---

## 🛡️ Security Notes

- **Never expose the SUPABASE_SERVICE_ROLE_KEY** to frontend code. It is only used server-side in API routes.
- All admin API routes verify the JWT session before doing anything.
- Login is rate-limited (5 attempts / 15 min per IP).
- User inputs are validated with **zod** and Supabase uses **parameterized queries** (no raw SQL string injection).
- Uploaded file validation happens in the admin upload flow (MIME type, extension, and size checks — no executable files).

---

## 🧱 Project Structure

```
rice-wholesaler/
├── app/                      # Next.js App Router pages & API routes
│   ├── page.tsx              # Homepage
│   ├── about/                # About Us
│   ├── products/             # Rice Collection + Product detail
│   ├── wholesale/            # Wholesale page
│   ├── contact/              # Contact us
│   ├── privacy/ terms/       # Legal pages
│   ├── admin/                # Admin panel (login, dashboard, products, orders, enquiries, settings)
│   └── api/                  # All server-side API routes
├── components/
│   ├── navbar/  hero/  footer/
│   ├── home/    (homepage sections)
│   ├── products/ (grid, gallery, specs, video, order form)
│   ├── forms/    (wholesale & contact forms)
│   ├── animations/ (scroll reveal, animated counter)
│   └── ui/       (button, card, input, modal, badge, particles)
├── lib/
│   ├── supabase/  (client + server clients)
│   ├── auth/      (JWT sessions, bcrypt, rate limiting)
│   └── validation/ (zod schemas)
├── types/
├── supabase-schema.sql       # Run this in Supabase SQL editor
├── .env.example
└── README.md
```

---

## 🔮 Adding a Payment Gateway (Optional, Future)

The architecture keeps orders as **enquiries** to stay low-cost. To add online payments later (e.g. Razorpay):

1. Add a `payment` column to `orders`.
2. Create a new API route (e.g. `/api/payment/create-order`) that calls the gateway.
3. Add a webhook route to confirm payment and update order status.
4. Update `OrderForm` to show a "Pay Online" option.

No existing code needs to be rebuilt — the order system is already decoupled.

---

## ⚠️ Honest Content Policy

Sample/placeholder data (featured products, statistics, contact details) is clearly editable and **not presented as real business facts**. Update the sample products in the homepage, the stats in `src/components/home/Stats.tsx`, and the contact/WhatsApp values in your environment variables before going live. Do not display claims (reviews, certifications, years of experience, customer counts) you cannot support.

---

## 📄 License

Private project — all rights reserved.