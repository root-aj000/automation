# Credit System Documentation

This document provides a comprehensive overview of the credit system, including how credits work, purchasing, balance management, and integration with the billing system.

## Table of Contents

1. [Overview](#overview)
2. [How Credits Work](#how-credits-work)
3. [Credit Balance Management](#credit-balance-management)
4. [Purchasing Credits](#purchasing-credits)
5. [Credit Usage & Deduction](#credit-usage--deduction)
6. [Integration with Billing](#integration-with-billing)
7. [Code Reference](#code-reference)
8. [API Endpoints](#api-endpoints)

---

## Overview

The credit system allows users to pre-purchase usage credits that extend their usage limits beyond the base plan amount. Credits act as a prepaid balance that can be used to pay for workflow executions, AI model usage, and other billable operations.

### Key Features

- **Prepaid Balance**: Purchase credits in advance
- **Usage Extension**: Credits extend beyond plan limits
- **Automatic Application**: Applied to overages at billing cycle end
- **Team & Individual**: Works for both personal and team accounts

### Credit Eligibility

| Plan | Can Purchase Credits |
|------|---------------------|
| Free | ❌ No |
| Pro | ✅ Yes |
| Team | ✅ Yes (Admins only) |
| Enterprise | ❌ No (Contact support) |

---

## How Credits Work

### Credit Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CREDIT SYSTEM FLOW                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      CREDIT PURCHASE                                 │   │
│  │                                                                      │   │
│  │   User                Backend              Stripe                    │   │
│  │     │                    │                    │                      │   │
│  │     │ Purchase Credits   │                    │                      │   │
│  │     │ ($10-$1000)        │                    │                      │   │
│  │     │───────────────────▶│                    │                      │   │
│  │     │                    │ Create Invoice     │                      │   │
│  │     │                    │───────────────────▶│                      │   │
│  │     │                    │                    │ Process Payment      │   │
│  │     │                    │                    │                      │   │
│  │     │                    │ Webhook:           │                      │   │
│  │     │                    │ payment_succeeded  │                      │   │
│  │     │                    │◀───────────────────│                      │   │
│  │     │                    │                    │                      │   │
│  │     │                    │ Add Credits        │                      │   │
│  │     │                    │ to Balance         │                      │   │
│  │     │                    │ Update Usage Limit │                      │   │
│  │     │                    │                    │                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      CREDIT USAGE                                    │   │
│  │                                                                      │   │
│  │   Workflow           Billing             Credit Balance             │   │
│  │   Execution          System                  (DB)                   │   │
│  │       │                  │                     │                     │   │
│  │       │ Run Workflow     │                     │                     │   │
│  │       │ (costs $X)       │                     │                     │   │
│  │       │─────────────────▶│                     │                     │   │
│  │       │                  │ Deduct from Balance │                     │   │
│  │       │                  │────────────────────▶│                     │   │
│  │       │                  │                     │                     │   │
│  │       │                  │ Credits Used: $Y    │                     │   │
│  │       │                  │ Overflow: $Z        │                     │   │
│  │       │◀─────────────────│                     │                     │   │
│  │       │                  │                     │                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      BILLING CYCLE END                               │   │
│  │                                                                      │   │
│  │   Invoice            Credit             Overage                     │   │
│  │   Finalized          Balance            Calculation                 │   │
│  │       │                  │                   │                       │   │
│  │       │ Calculate Total  │                   │                       │   │
│  │       │ Overage          │                   │                       │   │
│  │       │─────────────────────────────────────▶│                       │   │
│  │       │                  │                   │                       │   │
│  │       │ Apply Credits    │                   │                       │   │
│  │       │ to Reduce Overage│                   │                       │   │
│  │       │─────────────────▶│                   │                       │   │
│  │       │                  │                   │                       │   │
│  │       │ Remaining        │                   │                       │   │
│  │       │ Overage Billed   │                   │                       │   │
│  │       │                  │                   │                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Credit Value

- **1 Credit = $1 USD** of usage
- Credits are stored as decimal numbers (e.g., 50.00 credits = $50)
- Minimum purchase: $10
- Maximum purchase: $1000

### Where Credits Are Stored

| Entity Type | Storage Location | Column |
|-------------|------------------|--------|
| User (Pro) | `user_stats` table | `credit_balance` |
| Organization (Team) | `organization` table | `credit_balance` |

---

## Credit Balance Management

### Getting Credit Balance

**File:** [`apps/sim/lib/billing/credits/balance.ts:16-44`](apps/sim/lib/billing/credits/balance.ts:16)

```typescript
export interface CreditBalanceInfo {
  balance: number
  entityType: 'user' | 'organization'
  entityId: string
}

export async function getCreditBalance(userId: string): Promise<CreditBalanceInfo> {
  const subscription = await getHighestPrioritySubscription(userId)

  // Team/Enterprise: credits stored on organization
  if (subscription?.plan === 'team' || subscription?.plan === 'enterprise') {
    const orgRows = await db
      .select({ creditBalance: organization.creditBalance })
      .from(organization)
      .where(eq(organization.id, subscription.referenceId))
      .limit(1)

    return {
      balance: orgRows.length > 0 ? toNumber(toDecimal(orgRows[0].creditBalance)) : 0,
      entityType: 'organization',
      entityId: subscription.referenceId,
    }
  }

  // Pro/Free: credits stored on user stats
  const userRows = await db
    .select({ creditBalance: userStats.creditBalance })
    .from(userStats)
    .where(eq(userStats.userId, userId))
    .limit(1)

  return {
    balance: userRows.length > 0 ? toNumber(toDecimal(userRows[0].creditBalance)) : 0,
    entityType: 'user',
    entityId: userId,
  }
}
```

### Adding Credits

**File:** [`apps/sim/lib/billing/credits/balance.ts:46-66`](apps/sim/lib/billing/credits/balance.ts:46)

```typescript
export async function addCredits(
  entityType: 'user' | 'organization',
  entityId: string,
  amount: number
): Promise<void> {
  if (entityType === 'organization') {
    await db
      .update(organization)
      .set({ creditBalance: sql`${organization.creditBalance} + ${amount}` })
      .where(eq(organization.id, entityId))

    logger.info('Added credits to organization', { organizationId: entityId, amount })
  } else {
    await db
      .update(userStats)
      .set({ creditBalance: sql`${userStats.creditBalance} + ${amount}` })
      .where(eq(userStats.userId, entityId))

    logger.info('Added credits to user', { userId: entityId, amount })
  }
}
```

### Removing Credits

**File:** [`apps/sim/lib/billing/credits/balance.ts:68-88`](apps/sim/lib/billing/credits/balance.ts:68)

```typescript
export async function removeCredits(
  entityType: 'user' | 'organization',
  entityId: string,
  amount: number
): Promise<void> {
  if (entityType === 'organization') {
    await db
      .update(organization)
      .set({ creditBalance: sql`GREATEST(0, ${organization.creditBalance} - ${amount})` })
      .where(eq(organization.id, entityId))

    logger.info('Removed credits from organization', { organizationId: entityId, amount })
  } else {
    await db
      .update(userStats)
      .set({ creditBalance: sql`GREATEST(0, ${userStats.creditBalance} - ${amount})` })
      .where(eq(userStats.userId, entityId))

    logger.info('Removed credits from user', { userId: entityId, amount })
  }
}
```

---

## Purchasing Credits

### Purchase Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CREDIT PURCHASE FLOW                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   1. VALIDATION                                                             │
│   ┌─────────────────┐                                                        │
│   │   Check Amount  │  $10 - $1000                                          │
│   │   Check Plan    │  Pro or Team only                                     │
│   │   Check Admin   │  Team: must be admin                                  │
│   └────────┬────────┘                                                        │
│            │                                                                │
│            ▼                                                                │
│   2. GET PAYMENT METHOD                                                     │
│   ┌─────────────────┐                                                        │
│   │   Get Stripe    │  From subscription default                            │
│   │   Customer ID   │  Or customer invoice settings                         │
│   │   Get Payment   │                                                        │
│   │   Method        │                                                        │
│   └────────┬────────┘                                                        │
│            │                                                                │
│            ▼                                                                │
│   3. CREATE INVOICE                                                         │
│   ┌─────────────────┐                                                        │
│   │   Stripe        │  - customer: customerId                              │
│   │   Invoice       │  - collection_method: charge_automatically           │
│   │   Create        │  - metadata: { type: 'credit_purchase' }             │
│   └────────┬────────┘                                                        │
│            │                                                                │
│            ▼                                                                │
│   4. ADD LINE ITEM                                                          │
│   ┌─────────────────┐                                                        │
│   │   Stripe        │  - amount: $X in cents                               │
│   │   Invoice Item  │  - description: 'Prepaid credits ($X)'               │
│   │   Create        │  - metadata: { type, entityType, entityId }          │
│   └────────┬────────┘                                                        │
│            │                                                                │
│            ▼                                                                │
│   5. FINALIZE & PAY                                                         │
│   ┌─────────────────┐                                                        │
│   │   Finalize      │  Invoice status: 'open'                              │
│   │   Invoice       │                                                        │
│   │   Pay Invoice   │  Using default payment method                         │
│   └────────┬────────┘                                                        │
│            │                                                                │
│            ▼                                                                │
│   6. WEBHOOK PROCESSING                                                     │
│   ┌─────────────────┐                                                        │
│   │   Webhook:      │  invoice.payment_succeeded                           │
│   │   Add Credits   │  addCredits(entityType, entityId, amount)            │
│   │   Update Limit  │  setUsageLimitForCredits(...)                        │
│   └─────────────────┘                                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Purchase Function

**File:** [`apps/sim/lib/billing/credits/purchase.ts:105-232`](apps/sim/lib/billing/credits/purchase.ts:105)

```typescript
export async function purchaseCredits(params: PurchaseCreditsParams): Promise<PurchaseResult> {
  const { userId, amountDollars, requestId } = params

  // 1. Validate amount
  if (amountDollars < 10 || amountDollars > 1000) {
    return { success: false, error: 'Amount must be between $10 and $1000' }
  }

  // 2. Check eligibility
  const canPurchase = await canPurchaseCredits(userId)
  if (!canPurchase) {
    return { success: false, error: 'Only Pro and Team users can purchase credits' }
  }

  // 3. Get subscription and determine entity
  const subscription = await getHighestPrioritySubscription(userId)
  
  // 4. For Team: verify admin status
  if (subscription.plan === 'team') {
    const isAdmin = await isOrgAdmin(userId, subscription.referenceId)
    if (!isAdmin) {
      return { success: false, error: 'Only organization owners and admins can purchase credits' }
    }
  }

  // 5. Create and pay invoice via Stripe
  const stripe = requireStripeClient()
  
  // Get payment method from subscription
  const stripeSub = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId)
  const customerId = typeof stripeSub.customer === 'string' ? stripeSub.customer : stripeSub.customer.id
  
  // Create invoice with metadata
  const invoice = await stripe.invoices.create({
    customer: customerId,
    collection_method: 'charge_automatically',
    auto_advance: false,
    description: `Credit purchase - $${amountDollars}`,
    metadata: {
      type: 'credit_purchase',
      entityType,
      entityId,
      amountDollars: amountDollars.toString(),
      purchasedBy: userId,
    },
    default_payment_method: defaultPaymentMethod,
  })

  // Add line item
  await stripe.invoiceItems.create({
    customer: customerId,
    invoice: invoice.id,
    amount: Math.round(amountDollars * 100), // Convert to cents
    currency: 'usd',
    description: `Prepaid credits ($${amountDollars})`,
    metadata: creditMetadata,
  })

  // Finalize and pay
  const finalized = await stripe.invoices.finalizeInvoice(invoice.id)
  if (finalized.status === 'open') {
    await stripe.invoices.pay(finalized.id, {
      payment_method: defaultPaymentMethod,
    })
  }

  // Credits added via webhook after payment confirmation
  return { success: true }
}
```

---

## Credit Usage & Deduction

### Automatic Deduction During Execution

When workflows run, costs are deducted from the credit balance first, then the remaining amount is tracked as billable usage.

**File:** [`apps/sim/lib/billing/credits/balance.ts:149-177`](apps/sim/lib/billing/credits/balance.ts:149)

```typescript
export async function deductFromCredits(userId: string, cost: number): Promise<DeductResult> {
  if (cost <= 0) {
    return { creditsUsed: 0, overflow: 0 }
  }

  const subscription = await getHighestPrioritySubscription(userId)
  const isTeamOrEnterprise = subscription?.plan === 'team' || subscription?.plan === 'enterprise'

  let creditsUsed: number

  if (isTeamOrEnterprise && subscription?.referenceId) {
    // Deduct from organization credits
    creditsUsed = await atomicDeductOrgCredits(subscription.referenceId, cost)
  } else {
    // Deduct from user credits
    creditsUsed = await atomicDeductUserCredits(userId, cost)
  }

  // Calculate overflow (amount not covered by credits)
  const overflow = Math.max(0, cost - creditsUsed)

  return { creditsUsed, overflow }
}
```

### Atomic Deduction

Credits are deducted atomically to prevent race conditions:

```typescript
// Uses PostgreSQL CTE for atomic operation
async function atomicDeductUserCredits(userId: string, cost: number): Promise<number> {
  const result = await db.execute(sql`
    WITH old_balance AS (
      SELECT credit_balance FROM user_stats WHERE user_id = ${userId}
    )
    UPDATE user_stats
    SET credit_balance = CASE
      WHEN credit_balance >= ${cost}::decimal THEN credit_balance - ${cost}::decimal
      ELSE 0
    END
    WHERE user_id = ${userId} AND credit_balance >= 0
    RETURNING
      (SELECT credit_balance FROM old_balance) as old_balance,
      credit_balance as new_balance
  `)

  const oldBalance = toDecimal(result[0].old_balance)
  // Return actual amount deducted (min of balance and cost)
  return oldBalance.lessThan(cost) ? oldBalance : cost
}
```

---

## Integration with Billing

### Usage Limit Calculation

When credits are purchased, the usage limit is automatically increased:

**File:** [`apps/sim/lib/billing/credits/purchase.ts:17-86`](apps/sim/lib/billing/credits/purchase.ts:17)

```typescript
export async function setUsageLimitForCredits(
  entityType: 'user' | 'organization',
  entityId: string,
  plan: string,
  seats: number | null,
  creditBalance: number
): Promise<void> {
  // Get plan base limit
  const { basePrice } = getPlanPricing(plan)
  const planBase = entityType === 'organization' 
    ? Number(basePrice) * (seats || 1) 
    : Number(basePrice)

  // New limit = plan base + credits
  const newLimit = planBase + creditBalance

  // Update usage limit
  if (entityType === 'organization') {
    await db
      .update(organization)
      .set({ orgUsageLimit: newLimit.toString() })
      .where(eq(organization.id, entityId))
  } else {
    await db
      .update(userStats)
      .set({ currentUsageLimit: newLimit.toString() })
      .where(eq(userStats.userId, entityId))
  }
}
```

### Credits Applied to Overage at Billing Cycle End

When an invoice is finalized at the end of a billing cycle, credits are applied to reduce the overage:

**File:** [`apps/sim/lib/billing/webhooks/invoices.ts:727-745`](apps/sim/lib/billing/webhooks/invoices.ts:727)

```typescript
// In handleInvoiceFinalized
let remainingOverage = Math.max(0, totalOverage - billedOverage)

// Apply credits to reduce overage
if (remainingOverage > 0) {
  const { balance: creditBalance } = await getCreditBalance(entityId)

  if (creditBalance > 0) {
    const creditsApplied = Math.min(creditBalance, remainingOverage)
    await removeCredits(entityType, entityId, creditsApplied)
    remainingOverage -= creditsApplied

    logger.info('Applied credits to reduce overage at cycle end', {
      subscriptionId: sub.id,
      creditBalance,
      creditsApplied,
      remainingOverageAfterCredits: remainingOverage,
    })
  }
}

// Bill remaining overage
if (remainingOverage > 0) {
  // Create overage invoice...
}
```

---

## Code Reference

### File Locations

| File | Purpose |
|------|---------|
| [`lib/billing/credits/balance.ts`](apps/sim/lib/billing/credits/balance.ts) | Credit balance management (get, add, remove, deduct) |
| [`lib/billing/credits/purchase.ts`](apps/sim/lib/billing/credits/purchase.ts) | Credit purchasing logic |
| [`lib/billing/webhooks/invoices.ts`](apps/sim/lib/billing/webhooks/invoices.ts) | Webhook handler for credit purchase completion |

### Key Functions

| Function | File | Purpose |
|----------|------|---------|
| `getCreditBalance` | balance.ts:16 | Get user/org credit balance |
| `addCredits` | balance.ts:46 | Add credits to balance |
| `removeCredits` | balance.ts:68 | Remove credits from balance |
| `deductFromCredits` | balance.ts:149 | Deduct usage from credits |
| `canPurchaseCredits` | balance.ts:179 | Check if user can purchase |
| `purchaseCredits` | purchase.ts:105 | Process credit purchase |
| `setUsageLimitForCredits` | purchase.ts:17 | Update usage limit with credits |

---

## API Endpoints

### Purchase Credits Endpoint

**Endpoint:** `POST /api/billing/credits/purchase`

**Request Body:**
```json
{
  "amountDollars": 50
}
```

**Response (Success):**
```json
{
  "success": true
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Only Pro and Team users can purchase credits"
}
```

### Get Credit Balance Endpoint

**Endpoint:** `GET /api/billing/credits/balance`

**Response:**
```json
{
  "balance": 50.00,
  "entityType": "user",
  "entityId": "user_xxx"
}
```

---

## Summary Table

| Operation | Who Can Do It | Amount Range | Effect |
|-----------|---------------|--------------|--------|
| Purchase Credits | Pro users, Team admins | $10 - $1000 | Increases balance & usage limit |
| Use Credits | All paid users | Automatic | Deducted from balance during execution |
| Apply to Overage | Automatic at cycle end | Up to balance | Reduces overage invoice amount |

---

## Related Documentation

- [Billing State Machine](./billing-state-machine.md)
- [Webhook Handler Deep Dive](./webhook-deep-dive.md)
- [Team/Organization Billing](./team-billing.md)
