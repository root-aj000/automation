# Payment Gateway Migration Guide

This document provides a comprehensive guide for replacing Stripe with an alternative payment gateway (Razorpay, Paytm, or PhonePe).

---

## Understanding the Two Stripe Integrations

**IMPORTANT:** The Sim application has TWO separate Stripe integrations:

### 1. Main Sim Billing (`lib/billing/`)
This is the **internal billing system** for Sim platform subscriptions.
- Handles subscription management for Sim users
- Processes payments for Sim's own revenue
- Uses Stripe API key from environment variables
- Files: `lib/billing/stripe-client.ts`, `lib/billing/webhooks/`, `lib/billing/credits/`, etc.

### 2. Automation Tools (`tools/stripe/`)
This is part of the **workflow automation feature** for Sim users.
- Allows users to connect their own Stripe accounts
- Users provide their own API keys in workflows
- Not used for Sim's internal billing
- Files: `tools/stripe/*.ts`, `blocks/blocks/stripe.ts`

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     TWO SEPARATE STRIPE INTEGRATIONS                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   MAIN BILLING (lib/billing/)          AUTOMATION TOOLS (tools/stripe/)     │
│   ─────────────────────────────        ─────────────────────────────────    │
│                                                                             │
│   Purpose: Sim's subscription         Purpose: User workflows with         │
│            management                          any Stripe account           │
│                                                                             │
│   API Key: Environment variable       API Key: User-provided per workflow  │
│   (STRIPE_SECRET_KEY)                                                │
│                                                                             │
│   Webhooks: For Sim's billing         Webhooks: User-configured endpoints  │
│                                                                             │
│   Used by: Sim platform itself        Used by: Sim users in their          │
│                                        automation workflows                 │
│                                                                             │
│   MIGRATE THIS ◀────────              KEEP OR REPLACE SEPARATELY            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Payment Gateway Comparison

### Feature Comparison Table

| Feature | Stripe | Razorpay | Paytm | PhonePe |
|---------|--------|----------|-------|---------|
| **Subscriptions** | ✅ Full support | ✅ Full support | ⚠️ Limited | ⚠️ Limited |
| **Webhooks** | ✅ Reliable | ✅ Reliable | ✅ Good | ✅ Good |
| **Customer Management** | ✅ Full API | ✅ Full API | ⚠️ Basic | ⚠️ Basic |
| **Invoice Management** | ✅ Full API | ✅ Good | ❌ Limited | ❌ Limited |
| **Multiple Currencies** | ✅ 135+ | ⚠️ Mostly INR | ❌ INR only | ❌ INR only |
| **International Cards** | ✅ Yes | ✅ Yes | ⚠️ Limited | ⚠️ Limited |
| **SDK Quality** | ✅ Excellent | ✅ Good | ⚠️ Basic | ⚠️ Basic |
| **Documentation** | ✅ Excellent | ✅ Good | ⚠️ Average | ⚠️ Average |
| **Test Mode** | ✅ Easy | ✅ Easy | ✅ Available | ✅ Available |
| **Billing Portal** | ✅ Built-in | ❌ Custom needed | ❌ Custom needed | ❌ Custom needed |
| **Seat-based Billing** | ✅ Native | ⚠️ Custom needed | ❌ Custom | ❌ Custom |
| **Usage-based Billing** | ✅ Native | ⚠️ Custom needed | ❌ Custom | ❌ Custom |

### Recommendation Summary

| Gateway | Ease of Migration | Features Match | Best For |
|---------|-------------------|----------------|----------|
| **Razorpay** | ⭐⭐⭐⭐⭐ Best | ⭐⭐⭐⭐ Good | Indian market, best Stripe alternative |
| **Paytm** | ⭐⭐⭐ Moderate | ⭐⭐ Limited | If Paytm wallet integration needed |
| **PhonePe** | ⭐⭐⭐ Moderate | ⭐⭐ Limited | If UPI focus needed |

### **Recommended: Razorpay**

Razorpay is the closest Stripe alternative for Indian businesses:
- Similar API structure
- Full subscription support
- Good webhook reliability
- Comprehensive customer management

---

## Migration Complexity Analysis

### Files That Need Modification

#### CRITICAL - Must Migrate (Main Billing)

| File | Changes Required | Complexity |
|------|------------------|------------|
| [`stripe-client.ts`](apps/sim/lib/billing/stripe-client.ts) | Replace with Razorpay client | Medium |
| [`auth.ts`](apps/sim/lib/auth/auth.ts) | Replace `@better-auth/stripe` plugin | High |
| [`webhooks/invoices.ts`](apps/sim/lib/billing/webhooks/invoices.ts) | Rewrite for new webhook format | High |
| [`webhooks/disputes.ts`](apps/sim/lib/billing/webhooks/disputes.ts) | Adapt dispute handling | Medium |
| [`webhooks/enterprise.ts`](apps/sim/lib/billing/webhooks/enterprise.ts) | Update enterprise handling | Medium |
| [`threshold-billing.ts`](apps/sim/lib/billing/threshold-billing.ts) | Update invoice creation | High |
| [`credits/purchase.ts`](apps/sim/lib/billing/credits/purchase.ts) | Update payment flow | Medium |
| [`organizations/membership.ts`](apps/sim/lib/billing/organizations/membership.ts) | Update subscription operations | Medium |

#### OPTIONAL - Automation Tools

| File | Changes Required | Notes |
|------|------------------|-------|
| `tools/stripe/*` | Create equivalent tools | For user automation |
| `blocks/blocks/stripe.ts` | Create Razorpay block | For workflow builder |
| `triggers/stripe/*` | Create Razorpay triggers | For webhook triggers |

#### Database

| Table | Changes Required |
|-------|------------------|
| `user` | Add `razorpay_customer_id` column |
| `subscription` | Add `razorpay_customer_id`, `razorpay_subscription_id` columns |

---

## Step-by-Step Migration Plan

### Phase 1: Preparation (1-2 weeks)

#### Step 1.1: Create Razorpay Account

1. Sign up at https://dashboard.razorpay.com
2. Complete KYC verification
3. Get API keys (Test mode first)
4. Set up webhook endpoint URL

#### Step 1.2: Install Razorpay SDK

```bash
cd apps/sim
bun add razorpay
```

#### Step 1.3: Add Environment Variables

Add to your `.env` file:
```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxx

# Feature Flag for gradual migration
USE_RAZORPAY=false
```

---

### Phase 2: Create Razorpay Client (1-2 days)

Create `apps/sim/lib/billing/razorpay-client.ts`:

```typescript
import { createLogger } from '@sim/logger'
import Razorpay from 'razorpay'
import { env } from '@/lib/core/config/env'

const logger = createLogger('RazorpayClient')

const createRazorpayClientSingleton = () => {
  let razorpayClient: Razorpay | null = null

  return {
    getInstance(): Razorpay | null {
      if (razorpayClient) return razorpayClient
      
      const keyId = env.RAZORPAY_KEY_ID
      const keySecret = env.RAZORPAY_KEY_SECRET
      
      if (!keyId || !keySecret) {
        logger.warn('Razorpay credentials not configured')
        return null
      }

      try {
        razorpayClient = new Razorpay({
          key_id: keyId,
          key_secret: keySecret,
        })
        logger.info('Razorpay client initialized successfully')
        return razorpayClient
      } catch (error) {
        logger.error('Failed to initialize Razorpay client', { error })
        return null
      }
    },

    reset(): void {
      razorpayClient = null
    },
  }
}

const razorpayClientSingleton = createRazorpayClientSingleton()

export function getRazorpayClient(): Razorpay | null {
  return razorpayClientSingleton.getInstance()
}

export function requireRazorpayClient(): Razorpay {
  const client = getRazorpayClient()
  if (!client) {
    throw new Error('Razorpay client is not available. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment variables.')
  }
  return client
}

export function hasValidRazorpayCredentials(): boolean {
  return !!(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET)
}
```

---

### Phase 3: Update Database Schema (1 day)

Create a new migration to add Razorpay columns:

```sql
-- Add Razorpay columns to user table
ALTER TABLE "user" ADD COLUMN "razorpay_customer_id" text;

-- Add Razorpay columns to subscription table  
ALTER TABLE "subscription" ADD COLUMN "razorpay_customer_id" text;
ALTER TABLE "subscription" ADD COLUMN "razorpay_subscription_id" text;
```

Update `packages/db/schema.ts`:

```typescript
// In user table
stripeCustomerId: text('stripe_customer_id'),
razorpayCustomerId: text('razorpay_customer_id'), // NEW

// In subscription table
stripeCustomerId: text('stripe_customer_id'),
stripeSubscriptionId: text('stripe_subscription_id'),
razorpayCustomerId: text('razorpay_customer_id'), // NEW
razorpaySubscriptionId: text('razorpay_subscription_id'), // NEW
```

---

### Phase 4: Replace Auth Plugin (High Complexity)

The `@better-auth/stripe` plugin needs to be replaced with custom implementation or a new Razorpay plugin.

#### Option A: Create Custom Billing Integration (Recommended)

Remove the Stripe plugin from `auth.ts` and create custom subscription management:

```typescript
// In auth.ts - Remove stripe() plugin
// Create separate billing service

// Create new file: lib/billing/auth-billing-integration.ts
export async function handleUserSignup(user: { id: string; email: string }) {
  const razorpay = getRazorpayClient()
  if (!razorpay) return

  // Create Razorpay customer
  const customer = await razorpay.customers.create({
    name: user.email,
    email: user.email,
  })

  // Store customer ID
  await db.update(user)
    .set({ razorpayCustomerId: customer.id })
    .where(eq(user.id, user.id))
}
```

#### Option B: Fork better-auth and Create Razorpay Plugin

This is more complex but provides similar integration to Stripe.

---

### Phase 5: Implement Subscription Management

Create `lib/billing/razorpay/subscriptions.ts`:

```typescript
import Razorpay from 'razorpay'
import { requireRazorpayClient } from '../razorpay-client'

interface CreateSubscriptionParams {
  customerId: string
  planId: string
  quantity?: number
}

export async function createRazorpaySubscription(params: CreateSubscriptionParams) {
  const razorpay = requireRazorpayClient()
  
  // First, create a plan in Razorpay (or use existing)
  // Then create subscription
  
  const subscription = await razorpay.subscriptions.create({
    plan_id: params.planId,
    customer_notify: 1,
    quantity: params.quantity || 1,
    // Add other params
  })
  
  return subscription
}

export async function cancelRazorpaySubscription(subscriptionId: string) {
  const razorpay = requireRazorpayClient()
  
  const subscription = await razorpay.subscriptions.cancel(subscriptionId)
  return subscription
}
```

---

### Phase 6: Implement Webhook Handlers

Razorpay webhook events differ from Stripe. Create new handlers:

```typescript
// lib/billing/webhooks/razorpay-handlers.ts

import type { Request, Response } from 'express'
import { validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils'
import { env } from '@/lib/core/config/env'

export async function handleRazorpayWebhook(req: Request, res: Response) {
  const webhookSignature = req.headers['x-razorpay-signature'] as string
  const webhookSecret = env.RAZORPAY_WEBHOOK_SECRET

  // Verify signature
  const isValid = validateWebhookSignature(
    JSON.stringify(req.body),
    webhookSignature,
    webhookSecret
  )

  if (!isValid) {
    return res.status(400).json({ error: 'Invalid signature' })
  }

  const event = req.body

  switch (event.event) {
    case 'subscription.activated':
      await handleSubscriptionActivated(event.payload.subscription.entity)
      break
    case 'subscription.charged':
      await handleSubscriptionCharged(event.payload.subscription.entity)
      break
    case 'subscription.cancelled':
      await handleSubscriptionCancelled(event.payload.subscription.entity)
      break
    case 'payment.failed':
      await handlePaymentFailed(event.payload.payment.entity)
      break
    // Add more handlers
  }

  res.status(200).json({ received: true })
}

async function handleSubscriptionActivated(subscription: any) {
  // Update database with subscription details
}

async function handleSubscriptionCharged(subscription: any) {
  // Handle successful payment
}

async function handleSubscriptionCancelled(subscription: any) {
  // Handle cancellation
}

async function handlePaymentFailed(payment: any) {
  // Handle failed payment
}
```

---

### Phase 7: Update Credit Purchase Flow

Update `lib/billing/credits/purchase.ts`:

```typescript
// Replace Stripe invoice creation with Razorpay order creation

export async function purchaseCredits(params: PurchaseCreditsParams): Promise<PurchaseResult> {
  const razorpay = requireRazorpayClient()
  
  // Create Razorpay order
  const order = await razorpay.orders.create({
    amount: params.amount * 100, // Razorpay uses paise
    currency: 'INR',
    payment_capture: 1, // Auto capture
  })
  
  // Return order details for frontend to process payment
  // After payment success, verify and update credits
}
```

---

### Phase 8: Update Threshold Billing

Update `lib/billing/threshold-billing.ts`:

```typescript
// Replace Stripe invoice creation with Razorpay invoice/order

async function createAndFinalizeOverageInvoice(
  razorpay: Razorpay,
  params: {
    customerId: string
    amountCents: number
    description: string
  }
): Promise<string> {
  // Create invoice in Razorpay
  const invoice = await razorpay.invoices.create({
    type: 'invoice',
    date: Math.floor(Date.now() / 1000),
    customer_id: params.customerId,
    line_items: [{
      name: params.description,
      amount: params.amountCents,
      currency: 'INR',
      quantity: 1,
    }],
  })
  
  // Send invoice or auto-collect
  return invoice.id
}
```

---

### Phase 9: Create API Route for Webhooks

Create `app/api/webhooks/razorpay/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { handleRazorpayWebhook } from '@/lib/billing/webhooks/razorpay-handlers'

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  // Handle webhook
  const response = await handleRazorpayWebhook(
    { body, headers: Object.fromEntries(request.headers) } as any,
    { status: (code: number) => ({ json: (data: any) => NextResponse.json(data, { status: code }) }) } as any
  )
  
  return response
}
```

---

### Phase 10: Update Frontend

Update checkout components to use Razorpay checkout:

```typescript
// In checkout component
import { loadRazorpay } from '@/lib/razorpay'

async function initiatePayment(order: any) {
  const Razorpay = await loadRazorpay()
  
  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: 'INR',
    name: 'Sim',
    order_id: order.id,
    handler: async (response: any) => {
      // Verify payment on backend
      await verifyPayment(response)
    },
    prefill: {
      name: user.name,
      email: user.email,
    },
  }
  
  const rzp = new Razorpay(options)
  rzp.open()
}
```

---

## Migration Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| 1. Preparation | 1-2 weeks | Razorpay account, KYC |
| 2. Razorpay Client | 1-2 days | SDK installation |
| 3. Database Schema | 1 day | Migration scripts |
| 4. Auth Plugin | 3-5 days | Custom implementation |
| 5. Subscriptions | 3-5 days | Plan creation in Razorpay |
| 6. Webhooks | 2-3 days | Webhook setup in Razorpay |
| 7. Credit Purchase | 2 days | Order flow |
| 8. Threshold Billing | 2-3 days | Invoice creation |
| 9. API Routes | 1 day | Webhook endpoint |
| 10. Frontend | 3-5 days | Checkout integration |
| **Total** | **3-5 weeks** | |

---

## Handling Existing Subscribers

### Option A: Soft Migration (Recommended)

Keep both Stripe and Razorpay running simultaneously:

1. New subscribers use Razorpay
2. Existing subscribers stay on Stripe
3. Gradually migrate existing users when they update payment method

```typescript
// In stripe-client.ts - Add dual mode
export function getPaymentClient() {
  if (env.USE_RAZORPAY) {
    return { provider: 'razorpay', client: getRazorpayClient() }
  }
  return { provider: 'stripe', client: getStripeClient() }
}
```

### Option B: Hard Migration

1. Export all customer data from Stripe
2. Import customers to Razorpay
3. Migrate subscription data
4. Notify users of payment method change

---

## Testing Checklist

### Before Going Live

- [ ] Test subscription creation
- [ ] Test subscription cancellation
- [ ] Test subscription upgrade/downgrade
- [ ] Test payment success webhook
- [ ] Test payment failure webhook
- [ ] Test credit purchase
- [ ] Test overage billing
- [ ] Test billing portal access
- [ ] Test refund processing
- [ ] Test dispute handling

### Test Cards (Razorpay)

| Card Number | Scenario |
|-------------|----------|
| 4111 1111 1111 1111 | Success |
| 4000 0000 0000 0002 | Failure |
| 4000 0000 0000 0069 | Expired |

---

## Key Differences: Stripe vs Razorpay

### API Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    API STRUCTURE COMPARISON                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   STRIPE                          RAZORPAY                      │
│   ──────                          ─────────                     │
│                                                                 │
│   Customer                        Customer                      │
│   ├── Subscription                ├── Subscription              │
│   ├── PaymentMethod               ├── Payment Method (token)    │
│   └── Invoice                     └── Invoice                   │
│                                                                 │
│   Subscription                    Subscription                  │
│   ├── items[]                     ├── plan_id                   │
│   ├── default_payment_method      ├── customer_id               │
│   └── latest_invoice              └── quantity                  │
│                                                                 │
│   Invoice                         Invoice                       │
│   ├── auto_advance                ├── status                    │
│   ├── collection_method           └── amount                    │
│   └── payment_intent                                            │
│                                                                 │
│   Payment Intent                  Order                         │
│   ├── amount                      ├── amount                    │
│   ├── currency                    ├── currency                  │
│   └── status                      └── payment_capture           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Key Terminology Differences

| Stripe Term | Razorpay Equivalent |
|-------------|---------------------|
| Payment Intent | Order |
| Customer | Customer |
| Subscription | Subscription |
| Invoice | Invoice |
| Payment Method | Token/Card |
| Price | Plan |
| Product | Product/Plan |
| Webhook Signature | Webhook Signature |

---

## Rollback Plan

If migration fails, rollback steps:

1. Set `USE_RAZORPAY=false` in environment
2. Revert to Stripe client
3. Re-enable Stripe webhooks
4. Notify affected users
5. Process refunds if needed

---

## Support Contacts

| Provider | Support | Documentation |
|----------|---------|---------------|
| Razorpay | support@razorpay.com | https://razorpay.com/docs |
| Paytm | Paytm for Business app | https://developer.paytm.com |
| PhonePe | merchant support | https://developer.phonepe.com |
