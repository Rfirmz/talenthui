# Stripe Paywall Setup Guide

This guide will help you set up the Stripe paywall for the talent section.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Your Supabase project set up

## Step 1: Get Your Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Make sure you're in **Test Mode** (toggle in the top right)
3. Go to **Developers** → **API keys**
4. Copy your:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

## Step 2: Create a Product and Price in Stripe

1. In Stripe Dashboard, go to **Products** → **Add product**
2. Fill in:
   - **Name**: "Talent Directory Access" (or your preferred name)
   - **Description**: "Monthly subscription to access the talent directory"
3. Under **Pricing**, select:
   - **Recurring**
   - **Monthly** (or your preferred billing period)
   - **Price**: e.g., $29.00 USD
4. Click **Save product**
5. **Copy the Price ID** (starts with `price_`) - you'll need this!

## Step 3: Add Environment Variables

Add these to your `.env.local` file:

```env
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Stripe Price ID (from Step 2)
STRIPE_PRICE_ID=price_your_price_id_here
```

## Step 4: Create Supabase Table

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run the SQL from `migration-add-subscriptions-table.sql`:

```sql
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled', 'past_due')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);

ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription"
  ON user_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);
```

## Step 5: Update Price ID in Code (if needed)

If you want to use a different price ID per request, you can modify:
- `src/app/api/create-checkout-session/route.ts` - Update the `priceId` variable

Currently, it uses `process.env.STRIPE_PRICE_ID` or defaults to `'price_1234567890'`.

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to `/profiles`
3. You should see the paywall
4. Click "Subscribe Now"
5. Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any ZIP code
6. Complete the checkout
7. You should be redirected back and see the profiles

## Troubleshooting

### "Unauthorized" error
- Make sure the user is logged in
- Check that Supabase auth is working correctly

### Subscription not saving
- Verify the Supabase table was created correctly
- Check browser console for errors
- Verify RLS policies allow inserts

### Checkout session not creating
- Verify Stripe keys are correct in `.env.local`
- Check that `STRIPE_PRICE_ID` matches your Stripe product
- Look at server logs for detailed error messages

## Production Setup

When ready for production:

1. Switch Stripe to **Live Mode**
2. Get your **live** API keys
3. Update `.env.local` with live keys
4. Create a live product/price in Stripe
5. Update `STRIPE_PRICE_ID` with the live price ID
6. Test with real payment methods

## Notes

- This is a **proof of concept** implementation without webhooks
- For production, consider adding webhooks to handle:
  - Subscription cancellations
  - Payment failures
  - Subscription renewals
- The current implementation verifies subscriptions on page load
- For better UX, you may want to add webhook support later

