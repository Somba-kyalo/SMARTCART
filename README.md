# SmartCart Africa

Shop smart. Live better.

SmartCart Africa is a Kenya-first storefront for useful, thoughtfully chosen everyday products. The local app includes the storefront, shared cart, product pages, auth screens, checkout flow, Supabase schema, protected account/admin surfaces and deployment scaffolding.

## What's here

- Next.js App Router with TypeScript.
- Responsive homepage and brand styling in the SmartCart Africa palette.
- Product catalogue with text search, category filters and price sorting.
- Product cards with Kenyan shilling prices and availability labels.
- Browser-persisted shopping bag with quantity controls and subtotal calculation.
- Newsletter interaction and accessible empty states.
- Metadata and an environment-variable template.
- A Supabase foundation migration with customer/admin RLS policies.
- Server and browser Supabase clients with session-refresh middleware.
- Auth, account, protected admin, checkout and policy routes.
- Server-validated order creation with service-role access kept inside the API route.
- IntaSend payment endpoint structure that remains disabled until credentials are configured.

The current storefront catalogue still uses the sample data in `src/lib/products.ts` when Supabase is not configured. The server catalogue adapter in `src/lib/catalog.ts` is ready to read published products once the migration and seed data are applied. Browser cart state is a convenience only; the order API recalculates totals from trusted server-side product data.

## Run locally

### Install

1. Install Node.js 20.9 or later. Node 22 LTS is recommended.
2. Open PowerShell in this project folder.
3. Install the project dependencies:

```powershell
npm install
```

### Run the storefront-only demo

The storefront, static catalogue, cart and product pages work without Supabase:

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Run with Supabase

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`:

```powershell
Copy-Item .env.example .env.local
```

3. Add the project URL, publishable/anonymous key and server-only service-role key.
4. In Supabase SQL Editor, run these files in order:

   - `supabase/migrations/202611160001_initial_schema.sql`
   - `supabase/migrations/202611160002_seed_catalogue.sql`

5. Start the app again with `npm run dev`.
6. Register at `/auth/signup`. Promote a trusted account to admin from a protected SQL session:

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'your-admin-email@example.com');
```

### Verify the project

```powershell
npm run typecheck
npm run build
```

The build may show a non-fatal SWC warning on some Windows/OneDrive installations; it can still complete successfully. Keep the project in a local non-synced folder if that native-module warning persists.

## Environment variables

See `.env.example`. `NEXT_PUBLIC_*` values are browser-safe; `SUPABASE_SERVICE_ROLE_KEY` and `INTASEND_SECRET_KEY` must remain server-only. Live payments are not enabled until IntaSend sandbox credentials and webhook verification have been tested.

## Database foundation

The initial schema is in `supabase/migrations/202611160001_initial_schema.sql`; the local catalogue seed is in `supabase/migrations/202611160002_seed_catalogue.sql`. Apply both through the Supabase SQL editor or your migration workflow before connecting production data. The migrations create the commerce tables, order/payment relationships, profile bootstrap trigger, catalogue records and baseline RLS policies.

To make an administrator, update a trusted user's `profiles.role` to `admin` from a protected server-side SQL workflow after the user has registered. Never expose the service-role key in browser code.

Checkout and order creation require `SUPABASE_SERVICE_ROLE_KEY` on the server. IntaSend remains intentionally disabled until its secret key, webhook configuration and signature verification settings are supplied. Do not describe live payments as operational until a sandbox transaction and webhook have been verified.

## Current limitations before production

- IntaSend initiation and webhook signature verification still require provider-specific credentials and confirmation of the current API contract.
- Product image seed records should be replaced with Supabase Storage assets.
- Admin CRUD, supplier fulfilment tools and analytics need their operational screens completed.
- Run end-to-end checkout, authentication and RLS tests against a real Supabase project before launch.
- Have the editable policies reviewed for the actual business and delivery operation.
