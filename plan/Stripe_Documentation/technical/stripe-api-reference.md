# Complete Stripe API Reference

This document provides a comprehensive list of every Stripe function, class, and API used in the Sim application.

---

## Overview

The Sim application uses Stripe SDK version `18.5.0` with API version `2025-08-27.basil`.

---

## Stripe Classes & Imports

### Main Import
```typescript
import Stripe from 'stripe'
```

### Class Instantiation
```typescript
new Stripe(secretKey, {
  apiVersion: '2025-08-27.basil',
})
```

### Type Imports
```typescript
import type Stripe from 'stripe'  // Type-only import

// Specific types used:
// - Stripe.Event
// - Stripe.Subscription
// - Stripe.Invoice
// - Stripe.Customer
// - Stripe.Charge
// - Stripe.PaymentMethod
```

---

## Stripe API Methods Used

### 1. Customers API

| Method | File | Purpose |
|--------|------|---------|
| `stripe.customers.retrieve(id)` | [`credits/purchase.ts:154`](apps/sim/lib/billing/credits/purchase.ts:154) | Get customer details for payment method |
| `stripe.customers.retrieve(id)` | [`threshold-billing.ts:44`](apps/sim/lib/billing/threshold-billing.ts:44) | Get default payment method for customer |
| `stripe.customers.retrieve(id)` | [`webhooks/invoices.ts:78`](apps/sim/lib/billing/webhooks/invoices.ts:78) | Get customer payment info |
| `stripe.customers.retrieve(id)` | [`webhooks/invoices.ts:778`](apps/sim/lib/billing/webhooks/invoices.ts:778) | Get customer payment method |

**Code Example:**
```typescript
const customer = await stripe.customers.retrieve(customerId)
if (customer && !('deleted' in customer)) {
  const defaultPm = customer.invoice_settings?.default_payment_method
}
```

---

### 2. Subscriptions API

| Method | File | Purpose |
|--------|------|---------|
| `stripe.subscriptions.retrieve(id)` | [`credits/purchase.ts:144`](apps/sim/lib/billing/credits/purchase.ts:144) | Get subscription for payment method |
| `stripe.subscriptions.retrieve(id)` | [`threshold-billing.ts:39`](apps/sim/lib/billing/threshold-billing.ts:39) | Get subscription details |
| `stripe.subscriptions.retrieve(id)` | [`threshold-billing.ts:212`](apps/sim/lib/billing/threshold-billing.ts:212) | Get subscription for billing |
| `stripe.subscriptions.retrieve(id)` | [`threshold-billing.ts:453`](apps/sim/lib/billing/threshold-billing.ts:453) | Get org subscription |
| `stripe.subscriptions.retrieve(id)` | [`webhooks/subscription.ts:204`](apps/sim/lib/billing/webhooks/subscription.ts:204) | Get subscription for overage |
| `stripe.subscriptions.retrieve(id)` | [`webhooks/invoices.ts:770`](apps/sim/lib/billing/webhooks/invoices.ts:770) | Get collection method |
| `stripe.subscriptions.retrieve(id)` | [`app/api/organizations/[id]/seats/route.ts:125`](apps/sim/app/api/organizations/[id]/seats/route.ts:125) | Get subscription for seat update |
| `stripe.subscriptions.update(id, params)` | [`organizations/membership.ts:65`](apps/sim/lib/billing/organizations/membership.ts:65) | Restore Pro subscription |
| `stripe.subscriptions.update(id, params)` | [`admin/subscriptions/[id]/route.ts:98`](apps/sim/app/api/v1/admin/subscriptions/[id]/route.ts:98) | Cancel at period end |
| `stripe.subscriptions.update(id, params)` | [`admin/organizations/[id]/members/route.ts:234`](apps/sim/app/api/v1/admin/organizations/[id]/members/route.ts:234) | Sync cancellation |
| `stripe.subscriptions.update(id, params)` | [`organizations/[id]/seats/route.ts:154`](apps/sim/app/api/organizations/[id]/seats/route.ts:154) | Update seat quantity |
| `stripe.subscriptions.update(id, params)` | [`organizations/[id]/invitations/[invitationId]/route.ts:329`](apps/sim/app/api/organizations/[id]/invitations/[invitationId]/route.ts:329) | Cancel Pro subscription |
| `stripe.subscriptions.cancel(id, params)` | [`admin/subscriptions/[id]/route.ts:128`](apps/sim/app/api/v1/admin/subscriptions/[id]/route.ts:128) | Immediate cancellation |

**Code Examples:**
```typescript
// Retrieve subscription
const subscription = await stripe.subscriptions.retrieve(subscriptionId)
const customerId = typeof subscription.customer === 'string' 
  ? subscription.customer 
  : subscription.customer.id

// Update subscription (cancel at period end)
await stripe.subscriptions.update(subscriptionId, {
  cancel_at_period_end: true
})

// Cancel subscription immediately
await stripe.subscriptions.cancel(subscriptionId, {
  prorate: true
})

// Update subscription items (for seats)
await stripe.subscriptions.update(subscriptionId, {
  items: [{ id: itemId, quantity: newQuantity }]
})
```

---

### 3. Invoices API

| Method | File | Purpose |
|--------|------|---------|
| `stripe.invoices.create(params)` | [`credits/purchase.ts:179`](apps/sim/lib/billing/credits/purchase.ts:179) | Create invoice for credit purchase |
| `stripe.invoices.create(params)` | [`threshold-billing.ts:55`](apps/sim/lib/billing/threshold-billing.ts:55) | Create overage invoice |
| `stripe.invoices.create(params)` | [`webhooks/subscription.ts:217`](apps/sim/lib/billing/webhooks/subscription.ts:217) | Create final overage invoice |
| `stripe.invoices.create(params)` | [`webhooks/invoices.ts:790`](apps/sim/lib/billing/webhooks/invoices.ts:790) | Create overage invoice |
| `stripe.invoices.finalizeInvoice(id)` | [`credits/purchase.ts:209`](apps/sim/lib/billing/credits/purchase.ts:209) | Finalize credit purchase invoice |
| `stripe.invoices.finalizeInvoice(id)` | [`threshold-billing.ts:80`](apps/sim/lib/billing/threshold-billing.ts:80) | Finalize overage invoice |
| `stripe.invoices.finalizeInvoice(id)` | [`webhooks/subscription.ts:254`](apps/sim/lib/billing/webhooks/subscription.ts:254) | Finalize final invoice |
| `stripe.invoices.finalizeInvoice(id)` | [`webhooks/invoices.ts:827`](apps/sim/lib/billing/webhooks/invoices.ts:827) | Finalize invoice |
| `stripe.invoices.pay(id, params)` | [`credits/purchase.ts:212`](apps/sim/lib/billing/credits/purchase.ts:212) | Pay credit purchase invoice |
| `stripe.invoices.pay(id, params)` | [`threshold-billing.ts:84`](apps/sim/lib/billing/threshold-billing.ts:84) | Pay overage invoice |
| `stripe.invoices.pay(id, params)` | [`webhooks/invoices.ts:836`](apps/sim/lib/billing/webhooks/invoices.ts:836) | Pay invoice |

**Code Examples:**
```typescript
// Create invoice
const invoice = await stripe.invoices.create({
  customer: customerId,
  collection_method: 'charge_automatically',
  auto_advance: false,
  description: 'Credit Purchase',
  metadata: { type: 'credit_purchase' },
  default_payment_method: paymentMethodId,
})

// Create invoice item
await stripe.invoiceItems.create({
  customer: customerId,
  invoice: invoice.id,
  amount: amountCents,
  currency: 'usd',
  description: 'Credit Purchase',
})

// Finalize invoice
const finalized = await stripe.invoices.finalizeInvoice(invoice.id)

// Pay invoice
await stripe.invoices.pay(finalized.id, {
  payment_method: paymentMethodId,
})
```

---

### 4. Invoice Items API

| Method | File | Purpose |
|--------|------|---------|
| `stripe.invoiceItems.create(params)` | [`credits/purchase.ts:192`](apps/sim/lib/billing/credits/purchase.ts:192) | Add line item for credits |
| `stripe.invoiceItems.create(params)` | [`threshold-billing.ts:67`](apps/sim/lib/billing/threshold-billing.ts:67) | Add overage line item |
| `stripe.invoiceItems.create(params)` | [`webhooks/subscription.ts:234`](apps/sim/lib/billing/webhooks/subscription.ts:234) | Add final overage item |
| `stripe.invoiceItems.create(params)` | [`webhooks/invoices.ts:806`](apps/sim/lib/billing/webhooks/invoices.ts:806) | Add overage item |

**Code Example:**
```typescript
await stripe.invoiceItems.create({
  customer: customerId,
  invoice: invoice.id,
  amount: amountCents,
  currency: 'usd',
  description: 'Usage Overage',
  metadata: {
    type: 'overage',
    billingPeriod: '2024-01',
  },
})
```

---

### 5. Payment Methods API

| Method | File | Purpose |
|--------|------|---------|
| `stripe.paymentMethods.retrieve(id)` | [`webhooks/invoices.ts:70`](apps/sim/lib/billing/webhooks/invoices.ts:70) | Get card last 4 digits |
| `stripe.paymentMethods.retrieve(id)` | [`webhooks/invoices.ts:82`](apps/sim/lib/billing/webhooks/invoices.ts:82) | Get customer default payment method |

**Code Example:**
```typescript
const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)
const last4 = paymentMethod.card?.last4
const brand = paymentMethod.card?.brand
```

---

### 6. Payment Intents API

| Method | File | Purpose |
|--------|------|---------|
| `stripe.paymentIntents.retrieve(id)` | [`webhooks/invoices.ts:113`](apps/sim/lib/billing/webhooks/invoices.ts:113) | Get payment error details |

**Code Example:**
```typescript
const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
const errorMessage = paymentIntent.last_payment_error?.message
```

---

### 7. Charges API

| Method | File | Purpose |
|--------|------|---------|
| `stripe.charges.retrieve(id)` | [`webhooks/disputes.ts:15`](apps/sim/lib/billing/webhooks/disputes.ts:15) | Get customer from charge |
| `stripe.charges.retrieve(id)` | [`webhooks/invoices.ts:123`](apps/sim/lib/billing/webhooks/invoices.ts:123) | Get failure message |

**Code Example:**
```typescript
const charge = await stripe.charges.retrieve(chargeId)
const customerId = typeof charge.customer === 'string' 
  ? charge.customer 
  : charge.customer?.id
const failureMessage = charge.failure_message
```

---

### 8. Billing Portal API

| Method | File | Purpose |
|--------|------|---------|
| `stripe.billingPortal.sessions.create(params)` | [`webhooks/invoices.ts:43`](apps/sim/lib/billing/webhooks/invoices.ts:43) | Create billing portal URL |
| `stripe.billingPortal.sessions.create(params)` | [`app/api/billing/portal/route.ts:69`](apps/sim/app/api/billing/portal/route.ts:69) | Create customer billing portal |

**Code Example:**
```typescript
const portal = await stripe.billingPortal.sessions.create({
  customer: stripeCustomerId,
  return_url: `${baseUrl}/workspace?billing=updated`,
})
return portal.url
```

---

## Stripe Event Types (Webhooks)

### Events Handled in `auth.ts`

| Event Type | Handler Function | Purpose |
|------------|-----------------|---------|
| `invoice.payment_succeeded` | `handleInvoicePaymentSucceeded()` | Process successful payments |
| `invoice.payment_failed` | `handleInvoicePaymentFailed()` | Handle failed payments |
| `invoice.finalized` | `handleInvoiceFinalized()` | Process finalized invoices |
| `customer.subscription.created` | `handleManualEnterpriseSubscription()` | Create enterprise subscriptions |
| `charge.dispute.created` | `handleChargeDispute()` | Process new disputes |
| `charge.dispute.closed` | `handleDisputeClosed()` | Handle dispute resolution |

**Code Example:**
```typescript
switch (event.type) {
  case 'invoice.payment_succeeded':
    await handleInvoicePaymentSucceeded(event)
    break
  case 'invoice.payment_failed':
    await handleInvoicePaymentFailed(event)
    break
  // ... other cases
}
```

---

## @better-auth/stripe Plugin

### Plugin Configuration

The app uses `@better-auth/stripe` plugin (version `1.3.12`) for authentication integration.

```typescript
import { stripe } from '@better-auth/stripe'

stripe({
  stripeClient,
  stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
  createCustomerOnSignUp: true,
  
  onCustomerCreate: async ({ stripeCustomer, user }) => {
    // Log customer creation
  },
  
  subscription: {
    enabled: true,
    plans: getPlans(),
    authorizeReference: async ({ user, referenceId }) => { ... },
    getCheckoutSessionParams: async ({ plan, subscription }) => { ... },
    onSubscriptionComplete: async ({ subscription }) => { ... },
    onSubscriptionUpdate: async ({ event, subscription }) => { ... },
    onSubscriptionDeleted: async ({ subscription }) => { ... },
  },
  
  onEvent: async (event) => { ... },
})
```

### Client-Side Import

```typescript
import { stripeClient } from '@better-auth/stripe/client'

stripeClient({
  subscription: true,
})
```

---

## Automation Tools (tools/stripe/)

### Tools for User Workflows

These are **NOT** used for Sim's internal billing. They allow users to integrate their own Stripe accounts in automation workflows.

| Category | Tools | File |
|----------|-------|------|
| **Payment Intents** | create, retrieve, update, confirm, capture, cancel, list, search | `tools/stripe/create_payment_intent.ts` etc. |
| **Customers** | create, retrieve, update, delete, list, search | `tools/stripe/create_customer.ts` etc. |
| **Subscriptions** | create, retrieve, update, cancel, resume, list, search | `tools/stripe/create_subscription.ts` etc. |
| **Invoices** | create, retrieve, update, delete, finalize, pay, void, send, list, search | `tools/stripe/create_invoice.ts` etc. |
| **Charges** | create, retrieve, update, capture, list, search | `tools/stripe/create_charge.ts` etc. |
| **Products** | create, retrieve, update, delete, list, search | `tools/stripe/create_product.ts` etc. |
| **Prices** | create, retrieve, update, list, search | `tools/stripe/create_price.ts` etc. |
| **Events** | retrieve, list | `tools/stripe/retrieve_event.ts` etc. |

### Tool API Pattern

Each tool follows this pattern:
```typescript
export const stripeCreatePaymentIntentTool: ToolConfig<Params, Response> = {
  id: 'stripe_create_payment_intent',
  name: 'Stripe Create Payment Intent',
  description: 'Creates a payment intent in Stripe',
  request: {
    url: () => 'https://api.stripe.com/v1/payment_intents',
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
    }),
    body: (params) => ({ ...params }),
  },
}
```

---

## Complete API Summary Table

| API | Methods Used | Count |
|-----|--------------|-------|
| **customers** | retrieve | 4 |
| **subscriptions** | retrieve, update, cancel | 14 |
| **invoices** | create, finalizeInvoice, pay | 12 |
| **invoiceItems** | create | 4 |
| **paymentMethods** | retrieve | 2 |
| **paymentIntents** | retrieve | 1 |
| **charges** | retrieve | 2 |
| **billingPortal.sessions** | create | 2 |
| **Total API Calls** | | **41** |

---

## Stripe Objects Used

| Object | Properties Accessed |
|--------|---------------------|
| `Stripe.Subscription` | `id`, `customer`, `default_payment_method`, `items.data[].quantity`, `collection_method`, `status`, `cancel_at_period_end`, `current_period_start`, `current_period_end` |
| `Stripe.Invoice` | `id`, `customer`, `status`, `amount_due`, `default_payment_method`, `parent.subscription_details.subscription`, `metadata`, `payment_intent` |
| `Stripe.Customer` | `id`, `deleted`, `invoice_settings.default_payment_method` |
| `Stripe.Charge` | `id`, `customer`, `failure_message` |
| `Stripe.PaymentMethod` | `id`, `card.last4`, `card.brand` |
| `Stripe.PaymentIntent` | `id`, `last_payment_error.message` |
| `Stripe.Event` | `id`, `type`, `data.object` |

---

## Environment Variables Required

```env
STRIPE_SECRET_KEY=sk_test_xxxxx         # Or sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx    # Or pk_live_xxxxx (frontend)
```

---

## Migration Mapping: Stripe → Razorpay

| Stripe API | Razorpay Equivalent | Notes |
|------------|---------------------|-------|
| `customers.retrieve` | `customers.fetch` | Similar |
| `subscriptions.retrieve` | `subscriptions.fetch` | Similar |
| `subscriptions.update` | `subscriptions.update` | Different params |
| `subscriptions.cancel` | `subscriptions.cancel` | Similar |
| `invoices.create` | `invoices.create` | Different structure |
| `invoices.finalizeInvoice` | N/A | Razorpay auto-finalizes |
| `invoices.pay` | N/A | Use orders instead |
| `invoiceItems.create` | `invoices.create` with items | Integrated in Razorpay |
| `paymentMethods.retrieve` | N/A | Use tokens in Razorpay |
| `paymentIntents.retrieve` | `orders.fetch` | Different concept |
| `charges.retrieve` | `payments.fetch` | Similar |
| `billingPortal.sessions.create` | N/A | Build custom portal |
