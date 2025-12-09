# What You Need to Provide for Stripe Integration

The Stripe paywall integration is now set up! Here's what you need to provide to complete the setup:

## Required Information

### 1. Stripe API Keys
You'll get these from your Stripe Dashboard (https://dashboard.stripe.com):

- **STRIPE_SECRET_KEY**: Your Stripe secret key (starts with `sk_test_` for test mode)
- **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**: Your Stripe publishable key (starts with `pk_test_` for test mode)

### 2. Stripe Price ID
After creating a product in Stripe:

- **STRIPE_PRICE_ID**: The price ID for your subscription (starts with `price_`)

### 3. Subscription Details (Optional - for customization)
- **Price**: Currently set to $29/month (can be changed in `SubscriptionPaywall.tsx`)
- **Billing Period**: Currently monthly (can be changed when creating product in Stripe)

## Quick Setup Steps

1. **Create Stripe Account** (if you don't have one)
   - Go to https://stripe.com and sign up
   - You'll automatically get test mode keys

2. **Create a Product in Stripe**
   - Dashboard → Products → Add product
   - Set as recurring subscription
   - Copy the Price ID

3. **Add to `.env.local`**:
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_PRICE_ID=price_...
   ```

4. **Run the SQL migration**:
   - Copy SQL from `migration-add-subscriptions-table.sql`
   - Run in Supabase SQL Editor

5. **Test it!**
   - Visit `/profiles`
   - You should see the paywall
   - Use test card: `4242 4242 4242 4242`

## Files Created

✅ API Routes:
- `/src/app/api/create-checkout-session/route.ts`
- `/src/app/api/verify-session/route.ts`
- `/src/app/api/check-subscription/route.ts`

✅ Components:
- `/src/components/paywall/SubscriptionPaywall.tsx`

✅ Updated:
- `/src/app/profiles/page.tsx` (now checks subscription)

✅ Database:
- `migration-add-subscriptions-table.sql`

✅ Documentation:
- `STRIPE_SETUP.md` (detailed setup guide)

## Current Status

🟢 **Ready for configuration** - Just add your Stripe keys and price ID!

The integration is a proof-of-concept without webhooks. It works by:
1. Checking subscription status on page load
2. Verifying payment after Stripe redirect
3. Storing subscription in Supabase

For production, you may want to add webhooks later for automatic subscription management.

