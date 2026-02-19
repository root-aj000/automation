# Developer Onboarding Guide - Billing System

This guide will help new developers set up their local development environment to work with the Stripe billing system.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables Setup](#environment-variables-setup)
3. [Stripe Account Setup](#stripe-account-setup)
4. [Stripe CLI Installation](#stripe-cli-installation)
5. [Local Webhook Testing](#local-webhook-testing)
6. [Test Card Numbers](#test-card-numbers)
7. [Common Development Scenarios](#common-development-scenarios)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:

- Node.js 18+ installed
- Bun package manager
- PostgreSQL database running
- Stripe account (test mode)
- Git installed

---

## Environment Variables Setup

### Required Environment Variables

Create a `.env` file in the `apps/sim` directory with the following billing-related variables:

```bash
# ===========================================
# PAYMENT & BILLING CONFIGURATION
# ===========================================

# Stripe Secret Key (starts with sk_test_ for test mode)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# Stripe Webhook Secret (starts with whsec_)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# ===========================================
# PRICE IDs FOR EACH PLAN
# ===========================================
# Create these prices in your Stripe Dashboard

# Free tier (usually empty or placeholder)
STRIPE_FREE_PRICE_ID=

# Pro tier price ID
STRIPE_PRO_PRICE_ID=price_your_pro_price_id

# Team tier price ID (per seat)
STRIPE_TEAM_PRICE_ID=price_your_team_price_id

# Enterprise tier price ID
STRIPE_ENTERPRISE_PRICE_ID=price_your_enterprise_price_id

# ===========================================
# TIER LIMITS (in dollars)
# ===========================================

FREE_TIER_COST_LIMIT=5
PRO_TIER_COST_LIMIT=50
TEAM_TIER_COST_LIMIT=100
ENTERPRISE_TIER_COST_LIMIT=500

# ===========================================
# STORAGE LIMITS (in GB)
# ===========================================

FREE_STORAGE_LIMIT_GB=5
PRO_STORAGE_LIMIT_GB=50
TEAM_STORAGE_LIMIT_GB=500
```

### Environment Variable Validation

The environment variables are validated in:

**File:** [`apps/sim/lib/core/config/env.ts:41-54`](apps/sim/lib/core/config/env.ts:41)

```typescript
// Payment & Billing
STRIPE_SECRET_KEY: z.string().min(1).optional(), // Stripe secret key for payment processing
STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(), // General Stripe webhook secret
STRIPE_FREE_PRICE_ID: z.string().min(1).optional(), // Stripe price ID for free tier
FREE_TIER_COST_LIMIT: z.number().optional(), // Cost limit for free tier users
FREE_STORAGE_LIMIT_GB: z.number().optional().default(5), // Storage limit in GB for free tier users
STRIPE_PRO_PRICE_ID: z.string().min(1).optional(), // Stripe price ID for pro tier
PRO_TIER_COST_LIMIT: z.number().optional(), // Cost limit for pro tier users
PRO_STORAGE_LIMIT_GB: z.number().optional().default(50), // Storage limit in GB for pro tier users
STRIPE_TEAM_PRICE_ID: z.string().min(1).optional(), // Stripe price ID for team tier
TEAM_TIER_COST_LIMIT: z.number().optional(), // Cost limit for team tier users
TEAM_STORAGE_LIMIT_GB: z.number().optional().default(500), // Storage limit in GB for team tier organizations (pooled)
STRIPE_ENTERPRISE_PRICE_ID: z.string().min(1).optional(), // Stripe price ID for enterprise tier
ENTERPRISE_TIER_COST_LIMIT: z.number().optional(), // Cost limit for enterprise tier users
```

---

## Stripe Account Setup

### Step 1: Create Stripe Account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign up or log in
3. **Important:** Ensure you're in **Test Mode** (toggle in the top right)

### Step 2: Get API Keys

1. Navigate to **Developers** → **API Keys**
2. Copy the **Secret key** (starts with `sk_test_`)
3. Add it to your `.env` as `STRIPE_SECRET_KEY`

### Step 3: Create Products and Prices

1. Go to **Products** in Stripe Dashboard
2. Create products for each plan:

| Product Name | Price ID Variable | Billing Model |
|--------------|-------------------|---------------|
| Free | `STRIPE_FREE_PRICE_ID` | No price needed |
| Pro | `STRIPE_PRO_PRICE_ID` | Monthly subscription |
| Team | `STRIPE_TEAM_PRICE_ID` | Per-seat pricing |
| Enterprise | `STRIPE_ENTERPRISE_PRICE_ID` | Custom pricing |

3. Copy each Price ID and add to your `.env`

---

## Stripe CLI Installation

The Stripe CLI allows you to test webhooks locally by forwarding events from Stripe to your local development server.

### Windows Installation

```powershell
# Using Scoop
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe

# Or using Chocolatey
choco install stripe-cli
```

### macOS Installation

```bash
# Using Homebrew
brew install stripe/stripe-cli/stripe
```

### Linux Installation

```bash
# Download and install
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.4/stripe_1.19.4_linux_x86_64.tar.gz
tar -xvf stripe_1.19.4_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/
```

### Login to Stripe CLI

```bash
stripe login
```

This will open a browser window to authenticate with your Stripe account.

---

## Local Webhook Testing

### Step 1: Start Your Development Server

```bash
# From the project root
bun run dev
```

The API server typically runs on `http://localhost:3000`

### Step 2: Forward Webhooks to Local Server

Open a new terminal and run:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

You'll see output like:

```
Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

### Step 3: Copy Webhook Secret

Copy the `whsec_` signing secret and add it to your `.env`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### Step 4: Trigger Test Events

In another terminal, trigger test webhook events:

```bash
# Test payment succeeded
stripe trigger invoice.payment_succeeded

# Test payment failed
stripe trigger invoice.payment_failed

# Test subscription created
stripe trigger customer.subscription.created

# Test subscription deleted
stripe trigger customer.subscription.deleted
```

---

## Test Card Numbers

Use these test card numbers with any future expiry date and any CVC:

### Successful Payments

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | Visa - Success |
| `5555 5555 5555 4444` | Mastercard - Success |
| `4000 0025 0000 3155` | Requires 3D Secure |

### Failed Payments

| Card Number | Scenario |
|-------------|----------|
| `4000 0000 0000 0002` | Decline (generic) |
| `4000 0000 0000 3220` | 3D Secure required |
| `4000 0000 0000 9995` | Insufficient funds |
| `4000 0000 0000 9987` | Lost card |
| `4000 0000 0000 0069` | Expired card |

### Testing Specific Scenarios

```bash
# Test dispute/chargeback
stripe trigger charge.dispute.created

# Test refund
stripe trigger charge.refunded
```

---

## Common Development Scenarios

### Scenario 1: Testing New User Signup

1. Start your local server
2. Start Stripe CLI webhook forwarding
3. Create a new user account in your app
4. Verify customer was created in Stripe Dashboard
5. Check database for `stripeCustomerId` in user table

### Scenario 2: Testing Subscription Upgrade

1. Use test card `4242 4242 4242 4242`
2. Go to subscription settings
3. Click upgrade button
4. Complete Stripe checkout
5. Verify webhook received: `checkout.session.completed`
6. Check subscription status in database

### Scenario 3: Testing Payment Failure

1. Use test card `4000 0000 0000 0002`
2. Attempt a subscription purchase
3. Verify payment fails
4. Check error handling in UI

### Scenario 4: Testing Webhook Handlers

```bash
# View webhook handler logs
stripe logs tail

# Trigger specific webhook
stripe trigger invoice.payment_succeeded

# Check your server logs for processing
```

---

## Architecture Overview for Developers

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        BILLING ARCHITECTURE                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────┐    │
│   │   Frontend      │    │   Backend       │    │   Stripe Services   │    │
│   │   Components    │    │   API Routes    │    │                     │    │
│   └────────┬────────┘    └────────┬────────┘    └──────────┬──────────┘    │
│            │                      │                        │               │
│            │                      │                        │               │
│   ┌────────▼────────┐    ┌────────▼────────┐    ┌──────────▼──────────┐    │
│   │ subscription.tsx│    │ /api/billing/*  │    │ lib/billing/        │    │
│   │ usage-indicator │    │ /api/webhooks/* │    │   stripe-client.ts  │    │
│   │ .tsx            │    │                 │    │   webhooks/         │    │
│   └────────┬────────┘    └────────┬────────┘    │   credits/          │    │
│            │                      │             │   subscriptions/    │    │
│            │                      │             │   types/            │    │
│            │                      │             └──────────┬──────────┘    │
│            │                      │                        │               │
│            │                      │                        │               │
│   ┌────────▼────────┐    ┌────────▼────────┐    ┌──────────▼──────────┐    │
│   │ User clicks     │    │ API processes   │    │ Stripe SDK calls    │    │
│   │ "Upgrade"       │────▶│ request, calls  │────▶│ customers.create    │    │
│   │                 │    │ billing libs    │    │ checkout.sessions   │    │
│   └─────────────────┘    └─────────────────┘    │ billingPortal       │    │
│                                                 └─────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Files to Understand

| File Path | Purpose |
|-----------|---------|
| [`lib/billing/stripe-client.ts`](apps/sim/lib/billing/stripe-client.ts) | Stripe SDK singleton initialization |
| [`lib/billing/plans.ts`](apps/sim/lib/billing/plans.ts) | Plan configuration and pricing |
| [`lib/billing/webhooks/invoices.ts`](apps/sim/lib/billing/webhooks/invoices.ts) | Invoice webhook handlers |
| [`lib/billing/credits/purchase.ts`](apps/sim/lib/billing/credits/purchase.ts) | Credit purchase logic |
| [`lib/billing/threshold-billing.ts`](apps/sim/lib/billing/threshold-billing.ts) | Usage overage billing |
| [`lib/auth/auth.ts`](apps/sim/lib/auth/auth.ts) | Better Auth with Stripe plugin |
| [`app/api/billing/portal/route.ts`](apps/sim/app/api/billing/portal/route.ts) | Billing portal endpoint |
| [`app/api/webhooks/stripe/route.ts`](apps/sim/app/api/webhooks/stripe/route.ts) | Webhook receiver endpoint |

---

## Troubleshooting

### Issue: "Stripe client is not available"

**Solution:** Ensure `STRIPE_SECRET_KEY` is set in your `.env` file.

```bash
# Check if key is set
echo $STRIPE_SECRET_KEY

# Or in Windows PowerShell
echo $env:STRIPE_SECRET_KEY
```

### Issue: Webhooks not received locally

**Solution:**

1. Verify Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
2. Check your server is running on the correct port
3. Verify `STRIPE_WEBHOOK_SECRET` matches the CLI output

### Issue: "Customer not found" error

**Solution:**

1. Check if user has `stripeCustomerId` in database
2. Verify the customer exists in Stripe Dashboard
3. Check webhook handlers processed `customer.created` event

### Issue: Test payments not working

**Solution:**

1. Ensure you're using test mode API keys (start with `sk_test_`)
2. Use valid test card numbers (see above)
3. Check browser console for errors
4. Verify Stripe checkout session was created

### Issue: Subscription status not updating

**Solution:**

1. Run Stripe CLI to forward webhooks
2. Trigger the relevant webhook event
3. Check server logs for webhook processing
4. Verify database subscription table updates

---

## Next Steps

After setting up your local environment:

1. Read the [Billing State Machine](../guides/billing-state-machine.md) documentation
2. Review [Webhook Handler Deep Dive](../guides/webhook-deep-dive.md)
3. Understand the [Credit System](../guides/credit-system.md)
4. Learn about [Team/Organization Billing](../guides/team-billing.md)

---

## Quick Reference Commands

```bash
# Start Stripe CLI webhook forwarding
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test webhook events
stripe trigger invoice.payment_succeeded
stripe trigger invoice.payment_failed
stripe trigger customer.subscription.created
stripe trigger customer.subscription.deleted

# View Stripe CLI logs
stripe logs tail

# Login to Stripe
stripe login

# Check Stripe CLI version
stripe version
```
