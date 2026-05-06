Stripe + Supabase Edge Function setup

Overview
- Frontend: `src/components/shared/PaymentDrawer.jsx` uses Stripe Elements (CardElement) and calls a Supabase Edge Function to create a Payment Intent.
- Edge Function: `supabase/functions/create-payment-intent/index.ts` (Deno) creates a PaymentIntent by calling Stripe's REST API using `STRIPE_SECRET_KEY`.

Required environment variables (local/.env):
- `VITE_STRIPE_PUBLISHABLE_KEY` — your Stripe publishable key (test): starts with `pk_test_...`
- `VITE_SUPABASE_FUNCTIONS_URL` — URL to your deployed Supabase function (e.g. `https://<project>.functions.supabase.co/create-payment-intent`). If absent, the component will POST to `/create-payment-intent`.
- `STRIPE_SECRET_KEY` — (in Supabase Functions secrets) your Stripe secret key (test): starts with `sk_test_...`.

Install dependencies

Run from project root:

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

(We added these entries to `package.json` as `optionalDependencies` but you still need to install them.)

Supabase Edge Function deploy

1. Install Supabase CLI and authenticate.
2. From project root run (adjust path if needed):

```bash
supabase functions deploy create-payment-intent --project-ref <your-project-ref> --no-verify-jwt supabase/functions/create-payment-intent/index.ts
```

3. Set the secret in Supabase (Functions settings):

```bash
supabase secrets set STRIPE_SECRET_KEY="sk_test_..."
```

4. Note the function URL (e.g. `https://<project>.functions.supabase.co/create-payment-intent`) and set it as `VITE_SUPABASE_FUNCTIONS_URL` in your local env.

Local development

1. Create a `.env` with the required Vite vars:

```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_SUPABASE_FUNCTIONS_URL=https://<project>.functions.supabase.co/create-payment-intent
```

2. Run the app:

```bash
npm install
npm run dev
```

3. In the Requester dashboard click "Demo Pay" to open the sliding drawer. Use Stripe test card `4242 4242 4242 4242` with any future expiry and CVC to simulate a payment.

Notes

- The Edge Function calls Stripe directly using the `STRIPE_SECRET_KEY` environment secret — do not commit this key to source control.
- Amounts are provided in the smallest currency unit (e.g., centavos for PHP) — the demo uses `5000` which corresponds to `50.00 PHP`.
- Adjust currency and amount handling according to your back-end and business rules.
