# COD Reconcile

A lightweight SaaS for Shopify merchants to reconcile Cash on Delivery payments from courier PDF reports.

## Local Setup

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL`, `AUTH_SECRET`, `ENCRYPTION_KEY`, and Shopify app credentials.
3. Install dependencies:

```bash
npm install
```

4. Run migrations:

```bash
npx prisma migrate dev
```

5. Start the app:

```bash
npm run dev
```

## Production

Railway can build from the included `Dockerfile`.

Required environment variables:

- `DATABASE_URL`
- `AUTH_SECRET`
- `ENCRYPTION_KEY`
- `SHOPIFY_API_KEY`
- `SHOPIFY_API_SECRET`
- `SHOPIFY_SCOPES`
- `APP_URL`
- `NEXTAUTH_URL`

Generate `AUTH_SECRET` with:

```bash
openssl rand -base64 32
```

Generate `ENCRYPTION_KEY` with:

```bash
openssl rand -base64 32
```

Deployment runs Prisma migrations before starting:

```bash
npx prisma migrate deploy && npm start
```

## Shopify Flow

Merchants register, log in, enter a `myshopify.com` store domain, approve the OAuth install, and return to the app. Access tokens are encrypted before storage. The app registers an `APP_UNINSTALLED` webhook and clears the encrypted token if the app is removed.

## Reconciliation Flow

1. Upload a courier PDF report.
2. The app extracts PDF text and detects a parser.
3. Order numbers are matched against Shopify.
4. A preview shows which orders can be marked paid, skipped, or ignored.
5. The merchant explicitly selects orders and confirms the Shopify update.

The app never updates Shopify automatically.
