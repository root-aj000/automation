# Webhook Handler Deep Dive

This document provides a comprehensive breakdown of all Stripe webhook handlers, their triggers, and the complete flow of data processing.

## Table of Contents

1. [Overview](#overview)
2. [Webhook Event Types](#webhook-event-types)
3. [Webhook Flow Diagram](#webhook-flow-diagram)
4. [Handler Breakdown](#handler-breakdown)
5. [Code Reference](#code-reference)
6. [Adding New Webhook Handlers](#adding-new-webhook-handlers)
7. [Testing Webhooks Locally](#testing-webhooks-locally)

---

## Overview

Stripe webhooks are HTTP callbacks that notify your application when events happen in your Stripe account. The billing system processes these webhooks to keep the database in sync with Stripe's state.

### Key Concepts

- **Event**: A webhook payload sent by Stripe when something happens
- **Handler**: A function that processes a specific webhook event type
- **Signature Verification**: Security check to ensure the webhook is genuinely from Stripe

### Webhook Endpoint

Webhooks are received by the Better Auth Stripe plugin, which routes events to specific handlers.

**Configuration:** [`apps/sim/lib/auth/auth.ts:2022-2215`](apps/sim/lib/auth/auth.ts:2022)

```typescript
stripe({
  stripeClient,
  stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET || '',
  createCustomerOnSignUp: true,
  
  // Event handlers
  onCustomerCreate: async ({ stripeCustomer, user }) => { ... },
  onSubscriptionComplete: async ({ subscription, stripeSubscription }) => { ... },
  onSubscriptionUpdate: async ({ subscription, stripeSubscription }) => { ... },
  onSubscriptionDeleted: async ({ subscription, stripeSubscription }) => { ... },
  onEvent: async (event: Stripe.Event) => { ... },
})
```

---

## Webhook Event Types

### Events Handled by the System

| Event Type | Handler | Purpose |
|------------|---------|---------|
| `invoice.payment_succeeded` | `handleInvoicePaymentSucceeded` | Mark payment complete, unblock users |
| `invoice.payment_failed` | `handleInvoicePaymentFailed` | Block users, send failure emails |
| `invoice.finalized` | `handleInvoiceFinalized` | Calculate and bill overages |
| `customer.subscription.created` | Better Auth | Create subscription record |
| `customer.subscription.updated` | Better Auth | Update subscription record |
| `customer.subscription.deleted` | `onSubscriptionDeleted` | Handle cancellation |
| `checkout.session.completed` | Better Auth | Complete checkout flow |
| `charge.dispute.created` | `onEvent` | Block user for dispute |
| `charge.dispute.closed` | `onEvent` | Unblock user if dispute won |

---

## Webhook Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STRIPE WEBHOOK FLOW                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────┐                                      ┌─────────────────┐ │
│   │   Stripe    │                                      │   Better Auth   │ │
│   │   Event     │                                      │   Stripe Plugin │ │
│   │   Triggered │                                      │                 │ │
│   └──────┬──────┘                                      └────────┬────────┘ │
│          │                                                      │          │
│          │  POST /api/auth/stripe/webhook                      │          │
│          │  (with signature header)                             │          │
│          │─────────────────────────────────────────────────────▶│          │
│          │                                                      │          │
│          │                                                      │          │
│          │                     ┌────────────────┐               │          │
│          │                     │   Verify       │               │          │
│          │                     │   Signature    │               │          │
│          │                     │   (whsecret)   │               │          │
│          │                     └───────┬────────┘               │          │
│          │                             │                        │          │
│          │                             ▼                        │          │
│          │                     ┌────────────────┐               │          │
│          │                     │   Parse        │               │          │
│          │                     │   Event Type   │               │          │
│          │                     └───────┬────────┘               │          │
│          │                             │                        │          │
│          │            ┌────────────────┼────────────────┐      │          │
│          │            │                │                │      │          │
│          │            ▼                ▼                ▼      │          │
│          │   ┌─────────────┐   ┌─────────────┐   ┌──────────┐  │          │
│          │   │   Built-in  │   │   Custom    │   │   onEvent│  │          │
│          │   │   Handlers  │   │   Handlers  │   │   Handler│  │          │
│          │   │             │   │             │   │          │  │          │
│          │   │ • checkout  │   │ • invoice.*│   │ • dispute│  │          │
│          │   │ • customer  │   │             │   │          │  │          │
│          │   │ • subscription│  │             │   │          │  │          │
│          │   └─────────────┘   └─────────────┘   └──────────┘  │          │
│          │                                                      │          │
│          │                     ┌────────────────┐               │          │
│          │                     │   Update       │               │          │
│          │                     │   Database     │               │          │
│          │                     │   & Send       │               │          │
│          │                     │   Emails       │               │          │
│          │                     └───────┬────────┘               │          │
│          │                             │                        │          │
│          │                             ▼                        │          │
│          │                     ┌────────────────┐               │          │
│          │                     │   Return 200   │               │          │
│          │                     │   (or 4xx/5xx) │               │          │
│          │                     └───────┬────────┘               │          │
│          │                             │                        │          │
│          │◀────────────────────────────┘                        │          │
│          │                                                      │          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Handler Breakdown

### 1. Invoice Payment Succeeded

**Event:** `invoice.payment_succeeded`

**File:** [`apps/sim/lib/billing/webhooks/invoices.ts:453-543`](apps/sim/lib/billing/webhooks/invoices.ts:453)

**Triggered When:**
- Subscription payment succeeds
- Overage invoice payment succeeds
- Credit purchase payment succeeds

**Flow:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INVOICE PAYMENT SUCCEEDED                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐                                                        │
│  │   Webhook       │                                                        │
│  │   Received      │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐     No      ┌─────────────────┐                       │
│  │   Credit        │────────────▶│   Skip          │                       │
│  │   Purchase?     │             │   (handled by   │                       │
│  └────────┬────────┘             │   separate)     │                       │
│           │ Yes                  └─────────────────┘                       │
│           ▼                                                                 │
│  ┌─────────────────┐                                                        │
│  │   Add Credits   │                                                        │
│  │   to Balance    │                                                        │
│  │   Update Limit  │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐     No      ┌─────────────────┐                       │
│  │   Subscription  │────────────▶│   Return        │                       │
│  │   Found?        │             │                 │                       │
│  └────────┬────────┘             └─────────────────┘                       │
│           │ Yes                                                             │
│           ▼                                                                 │
│  ┌─────────────────┐                                                        │
│  │   Check if      │                                                        │
│  │   User Was      │                                                        │
│  │   Blocked       │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐     No      ┌─────────────────┐                       │
│  │   Was Blocked?  │────────────▶│   Done          │                       │
│  └────────┬────────┘             └─────────────────┘                       │
│           │ Yes                                                             │
│           ▼                                                                 │
│  ┌─────────────────┐                                                        │
│  │   Unblock User  │                                                        │
│  │   Reset Usage   │                                                        │
│  │   Stats         │                                                        │
│  └─────────────────┘                                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key Code:**
```typescript
export async function handleInvoicePaymentSucceeded(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice

  // Handle credit purchase invoices
  if (invoice.metadata?.type === 'credit_purchase') {
    await handleCreditPurchaseSuccess(invoice)
    return
  }

  // Handle subscription invoices
  const stripeSubscriptionId = /* extract from invoice */
  const sub = /* get from database */

  // Unblock users who were blocked for payment_failed
  if (wasBlocked) {
    await db.update(userStats).set({
      billingBlocked: false,
      billingBlockedReason: null
    })
    await resetUsageForSubscription(sub)
  }
}
```

---

### 2. Invoice Payment Failed

**Event:** `invoice.payment_failed`

**File:** [`apps/sim/lib/billing/webhooks/invoices.ts:549-677`](apps/sim/lib/billing/webhooks/invoices.ts:549)

**Triggered When:**
- Subscription payment fails
- Overage invoice payment fails

**Flow:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INVOICE PAYMENT FAILED                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐                                                        │
│  │   Webhook       │                                                        │
│  │   Received      │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐                                                        │
│  │   Extract       │                                                        │
│  │   Invoice Info  │                                                        │
│  │   (amount,      │                                                        │
│  │   attempt count)│                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐                                                        │
│  │   Find          │                                                        │
│  │   Subscription  │                                                        │
│  │   in Database   │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      BLOCK USERS                                     │   │
│  │                                                                      │   │
│  │   ┌─────────────────┐        ┌─────────────────┐                   │   │
│  │   │   Team/Enterprise        │   Individual    │                   │   │
│  │   │   Plan          │        │   Plan          │                   │   │
│  │   │                 │        │                 │                   │   │
│  │   │   Block ALL     │        │   Block the     │                   │   │
│  │   │   members       │        │   single user   │                   │   │
│  │   └─────────────────┘        └─────────────────┘                   │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐     No      ┌─────────────────┐                       │
│  │   First         │────────────▶│   Skip Email    │                       │
│  │   Attempt?      │             │   (already sent)│                       │
│  └────────┬────────┘             └─────────────────┘                       │
│           │ Yes                                                             │
│           ▼                                                                 │
│  ┌─────────────────┐                                                        │
│  │   Send Payment  │                                                        │
│  │   Failure Email │                                                        │
│  │   (with billing │                                                        │
│  │   portal link)  │                                                        │
│  └─────────────────┘                                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key Code:**
```typescript
export async function handleInvoicePaymentFailed(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice
  const attemptCount = invoice.attempt_count ?? 1

  // Block users after first payment failure
  if (attemptCount >= 1) {
    const sub = /* get subscription from database */

    if (sub.plan === 'team' || sub.plan === 'enterprise') {
      // Block all team members
      await db.update(userStats)
        .set({ billingBlocked: true, billingBlockedReason: 'payment_failed' })
        .where(inArray(userStats.userId, memberIds))
    } else {
      // Block individual user
      await db.update(userStats)
        .set({ billingBlocked: true, billingBlockedReason: 'payment_failed' })
        .where(eq(userStats.userId, sub.referenceId))
    }

    // Send email only on FIRST failure (not retries)
    if (attemptCount === 1) {
      await sendPaymentFailureEmails(sub, invoice, customerId)
    }
  }
}
```

---

### 3. Invoice Finalized (Overage Billing)

**Event:** `invoice.finalized`

**File:** [`apps/sim/lib/billing/webhooks/invoices.ts:683-855`](apps/sim/lib/billing/webhooks/invoices.ts:683)

**Triggered When:**
- Subscription period ends
- Stripe finalizes the renewal invoice

**Flow:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INVOICE FINALIZED (OVERAGE BILLING)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐                                                        │
│  │   Invoice       │                                                        │
│  │   Finalized     │                                                        │
│  │   (subscription │                                                        │
│  │   cycle)        │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐     No      ┌─────────────────┐                       │
│  │   Subscription  │────────────▶│   Skip          │                       │
│  │   Cycle?        │             │                 │                       │
│  └────────┬────────┘             └─────────────────┘                       │
│           │ Yes                                                             │
│           ▼                                                                 │
│  ┌─────────────────┐     Yes     ┌─────────────────┐                       │
│  │   Enterprise    │────────────▶│   Reset Usage   │                       │
│  │   Plan?         │             │   Only          │                       │
│  └────────┬────────┘             └─────────────────┘                       │
│           │ No                                                              │
│           ▼                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      CALCULATE OVERAGE                               │   │
│  │                                                                      │   │
│  │   Total Overage = currentPeriodCost - usageLimit                    │   │
│  │   Remaining Overage = Total Overage - Billed Overage                │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐     Yes     ┌─────────────────┐                       │
│  │   Credit        │────────────▶│   Apply Credits │                       │
│  │   Balance > 0?  │             │   to Reduce     │                       │
│  └────────┬────────┘             │   Overage       │                       │
│           │ No                   └────────┬────────┘                       │
│           │                               │                                │
│           └───────────────────────────────┘                                │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐     No      ┌─────────────────┐                       │
│  │   Remaining     │────────────▶│   Reset Usage   │                       │
│  │   Overage > 0?  │             │   Stats         │                       │
│  └────────┬────────┘             └─────────────────┘                       │
│           │ Yes                                                             │
│           ▼                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      CREATE OVERAGE INVOICE                          │   │
│  │                                                                      │   │
│  │   1. Create draft invoice                                           │   │
│  │   2. Add invoice item (overage amount)                              │   │
│  │   3. Finalize invoice (triggers autopay)                            │   │
│  │   4. If automatic payment fails, invoice becomes 'open'             │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐                                                        │
│  │   Reset Usage   │                                                        │
│  │   Stats for     │                                                        │
│  │   New Period    │                                                        │
│  └─────────────────┘                                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key Code:**
```typescript
export async function handleInvoiceFinalized(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice

  // Only process subscription cycle invoices
  if (invoice.billing_reason !== 'subscription_cycle') return

  const sub = /* get subscription */

  // Enterprise has no overages
  if (sub.plan === 'enterprise') {
    await resetUsageForSubscription(sub)
    return
  }

  // Calculate remaining overage
  const totalOverage = await calculateSubscriptionOverage(sub)
  const billedOverage = await getBilledOverageForSubscription(sub)
  let remainingOverage = Math.max(0, totalOverage - billedOverage)

  // Apply credits
  if (creditBalance > 0) {
    creditsApplied = Math.min(creditBalance, remainingOverage)
    await removeCredits(entityType, entityId, creditsApplied)
    remainingOverage -= creditsApplied
  }

  // Create overage invoice
  if (remainingOverage > 0) {
    const overageInvoice = await stripe.invoices.create({
      customer: customerId,
      metadata: { type: 'overage_billing' }
    })
    await stripe.invoiceItems.create({
      customer: customerId,
      invoice: overageInvoice.id,
      amount: Math.round(remainingOverage * 100),
      description: `Usage Based Overage – ${billingPeriod}`
    })
    await stripe.invoices.finalizeInvoice(overageInvoice.id)
  }

  // Reset usage for new period
  await resetUsageForSubscription(sub)
}
```

---

### 4. Dispute Handlers

**Events:** `charge.dispute.created`, `charge.dispute.closed`

**File:** [`apps/sim/lib/auth/auth.ts:2191-2200`](apps/sim/lib/auth/auth.ts:2191)

**Triggered When:**
- Customer files a chargeback (`dispute.created`)
- Dispute is resolved (`dispute.closed`)

**Flow:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DISPUTE HANDLING                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐                                                        │
│  │   Dispute       │                                                        │
│  │   Created       │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      BLOCK USER                                      │   │
│  │                                                                      │   │
│  │   billingBlocked = true                                             │   │
│  │   billingBlockedReason = 'dispute'                                  │   │
│  │                                                                      │   │
│  │   Note: User cannot unblock via billing portal                      │   │
│  │   Must resolve dispute first                                        │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐                                                        │
│  │   Dispute       │                                                        │
│  │   Closed        │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐     No      ┌─────────────────┐                       │
│  │   Won?          │────────────▶│   Remain        │                       │
│  │                 │             │   Blocked       │                       │
│  └────────┬────────┘             └─────────────────┘                       │
│           │ Yes                                                             │
│           ▼                                                                 │
│  ┌─────────────────┐                                                        │
│  │   Unblock User  │                                                        │
│  │   (reason =     │                                                        │
│  │   null)         │                                                        │
│  └─────────────────┘                                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key Code:**
```typescript
// In auth.ts onEvent handler
case 'charge.dispute.created': {
  // Block user immediately for disputes
  await db.update(userStats)
    .set({ billingBlocked: true, billingBlockedReason: 'dispute' })
    .where(eq(userStats.userId, sub.referenceId))
  break
}
case 'charge.dispute.closed': {
  const dispute = event.data.object as Stripe.Dispute
  if (dispute.status === 'won') {
    // Unblock only if dispute was won
    await db.update(userStats)
      .set({ billingBlocked: false, billingBlockedReason: null })
      .where(eq(userStats.userId, sub.referenceId))
  }
  break
}
```

---

## Code Reference

### Main Webhook Handler File

**File:** [`apps/sim/lib/billing/webhooks/invoices.ts`](apps/sim/lib/billing/webhooks/invoices.ts)

### Functions

| Function | Lines | Purpose |
|----------|-------|---------|
| `createBillingPortalUrl` | 39-53 | Generate Stripe billing portal URL |
| `getPaymentMethodDetails` | 58-138 | Extract card last 4 and failure reason |
| `sendPaymentFailureEmails` | 144-231 | Send payment failure notifications |
| `getBilledOverageForSubscription` | 238-274 | Get previously billed overage amount |
| `resetUsageForSubscription` | 276-342 | Reset usage stats for new billing period |
| `handleCreditPurchaseSuccess` | 347-447 | Process credit purchase payment |
| `handleInvoicePaymentSucceeded` | 453-543 | Handle successful payments |
| `handleInvoicePaymentFailed` | 549-677 | Handle failed payments |
| `handleInvoiceFinalized` | 683-855 | Calculate and bill overages |

---

## Adding New Webhook Handlers

### Step 1: Define the Handler

Create a new async function in the appropriate file:

```typescript
// In lib/billing/webhooks/invoices.ts or a new file

export async function handleNewEventType(event: Stripe.Event) {
  try {
    const object = event.data.object as Stripe.SomeType
    
    // 1. Extract relevant data
    const relevantId = object.id
    
    // 2. Query database
    const record = await db.select()
      .from(table)
      .where(eq(table.id, relevantId))
      .limit(1)
    
    if (record.length === 0) {
      logger.warn('Record not found for webhook', { eventId: event.id })
      return
    }
    
    // 3. Process the event
    await db.update(table)
      .set({ field: 'new_value' })
      .where(eq(table.id, relevantId))
    
    logger.info('Processed webhook event', { 
      eventType: event.type, 
      objectId: object.id 
    })
    
  } catch (error) {
    logger.error('Failed to handle webhook', { 
      eventId: event.id, 
      error 
    })
    throw error // Re-throw to signal webhook failure
  }
}
```

### Step 2: Register the Handler

Add the handler to the Better Auth Stripe plugin configuration:

```typescript
// In lib/auth/auth.ts

onEvent: async (event: Stripe.Event) => {
  switch (event.type) {
    case 'invoice.payment_succeeded':
      await handleInvoicePaymentSucceeded(event)
      break
    case 'invoice.payment_failed':
      await handleInvoicePaymentFailed(event)
      break
    case 'invoice.finalized':
      await handleInvoiceFinalized(event)
      break
    // Add your new handler here
    case 'your.new.event.type':
      await handleNewEventType(event)
      break
    default:
      logger.debug('Unhandled webhook event', { type: event.type })
  }
}
```

### Step 3: Test the Handler

```bash
# Trigger the webhook locally
stripe trigger your.new.event.type

# Or use a custom payload
stripe events resend evt_123 --webhook-endpoint whsec_xxx
```

---

## Testing Webhooks Locally

### Using Stripe CLI

```bash
# 1. Start webhook forwarding
stripe listen --forward-to localhost:3000/api/auth/stripe/webhook

# 2. In another terminal, trigger events
stripe trigger invoice.payment_succeeded
stripe trigger invoice.payment_failed
stripe trigger invoice.finalized

# 3. View logs
stripe logs tail
```

### Test Card Numbers for Payment Failures

| Card Number | Result |
|-------------|--------|
| `4000 0000 0000 0002` | Generic decline |
| `4000 0000 0000 3220` | 3D Secure required |
| `4000 0000 0000 9995` | Insufficient funds |

### Debugging Tips

1. **Check webhook signature**: Ensure `STRIPE_WEBHOOK_SECRET` matches the CLI output
2. **View raw payload**: Use `stripe events retrieve evt_xxx` to see the full event
3. **Check server logs**: Look for `StripeInvoiceWebhooks` log entries
4. **Database state**: Verify subscription and userStats tables are updated

---

## Summary Table

| Event | Blocks User | Unblocks User | Sends Email | Creates Invoice |
|-------|-------------|---------------|-------------|-----------------|
| `invoice.payment_succeeded` | No | Yes (if blocked) | Credit purchase | No |
| `invoice.payment_failed` | Yes | No | Yes (first attempt) | No |
| `invoice.finalized` | No | No | No | Yes (overage) |
| `charge.dispute.created` | Yes | No | No | No |
| `charge.dispute.closed` | No | Yes (if won) | No | No |

---

## Related Documentation

- [Billing State Machine](./billing-state-machine.md)
- [Developer Onboarding Guide](./developer-onboarding.md)
- [Credit System Documentation](./credit-system.md)
