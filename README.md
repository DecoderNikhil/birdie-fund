# Birdie Fund

> A subscription-driven platform combining golf performance tracking, charity fundraising, and monthly draw-based rewards.

## Live URL

[Insert Vercel deployment URL here]

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Auth | JWT (via JWT_SECRET) |
| Database | PostgreSQL (via postgres.js) |
| Payments | Stripe |
| Email | Brevo SMTP |
| Deployment | Vercel |

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Stripe account
- Brevo account

## Getting Started

### 1. Clone the repository

```bash
git clone [repo-url]
cd birdie-fund
npm install
```

### 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in all values:

```env
# Database (PostgreSQL)
DATABASE_URL=postgres://user:password@localhost:5432/birdie_fund

# Auth
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_here

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_MONTHLY_PRICE_ID=your_stripe_monthly_price_id
STRIPE_YEARLY_PRICE_ID=your_stripe_yearly_price_id

# Brevo (Email SMTP)
BREVO_SMTP_LOGIN=your_brevo_smtp_login_email
BREVO_SMTP_KEY=your_brevo_smtp_password
BREVO_SMTP_PORT=587
BREVO_EMAIL_FROM=your_sender_email@example.com
BREVO_EMAIL_FROM_NAME=Birdie Fund

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set up the database

Run all SQL migrations in `db/migrations/` in numerical order:

```bash
psql $DATABASE_URL -f db/migrations/001_users_profiles.sql
psql $DATABASE_URL -f db/migrations/002_subscriptions.sql
# ... continue for all migrations
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Test Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@birdiefund.test | [set manually in database] |
| Subscriber | user@birdiefund.test | [set manually in database] |

**To create admin:** After signing up normally, go to database → table `profiles` → find the user → set `role` to `admin`.

## Stripe Test Cards

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Use any future date, any CVC, any postal code.

## Key Features

- **Subscription system** with Stripe (monthly and yearly plans)
- **Score management** — rolling 5-score system, Stableford format (1–45)
- **Draw engine** — random and algorithmic modes, 3 prize tiers
- **Charity integration** — user-selectable charity with adjustable contribution percentage
- **Winner verification** — proof upload, admin review, payout tracking
- **Admin dashboard** — full control over users, draws, charities, winners, analytics
- **Email notifications** — via Brevo SMTP for signup, draw results, winner verification

## Project Structure

```
src/
├── app/                    # Pages and API routes
├── components/             # Reusable UI components
├── lib/                    # Core logic (db, stripe, draw engine, email)
├── hooks/                  # React hooks
├── types/                  # TypeScript types
└── middleware.ts          # Auth guard for /dashboard and /admin

db/
└── migrations/            # SQL migration files
```

## Deployment

1. Push all code to a new GitHub repository
2. Create a new Vercel project
3. Import the GitHub repo into Vercel
4. In Vercel project settings → Environment Variables: add all variables from `.env.local`
5. Set `NEXT_PUBLIC_APP_URL` to the Vercel deployment URL
6. Deploy
7. Configure PostgreSQL on Vercel (use Vercel Postgres or external provider)
8. Run migrations on production database
9. Update `NEXT_PUBLIC_APP_URL` in Stripe webhook settings to point to the live URL
10. Register the Stripe webhook endpoint: `https://[your-vercel-url]/api/stripe/webhook`
    - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
11. Update `README.md` with the live deployment URL

## Notes

- Only one score per date per user is permitted (enforced at DB and API level)
- The 5-score rolling limit is enforced by a Postgres trigger
- Jackpot rolls over to the next month if no 5-match winner
- Admin role must be set manually in the database for the first admin user