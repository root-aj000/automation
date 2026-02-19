# Database Schema for Stripe Integration

This document explains how Stripe-related data is stored in the database.

---

## Overview

The database uses PostgreSQL with Drizzle ORM. Stripe-related data is primarily stored in two tables: `user` and `subscription`.

---

## User Table

The `user` table stores individual user information including their Stripe customer ID.

### Stripe-Related Columns

| Column | Type | Description |
|--------|------|-------------|
| `stripe_customer_id` | text | The Stripe customer ID for this user |

### How It's Used

```
┌─────────────────────────────────────────────────────────────┐
│                    USER TABLE FLOW                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   1. User signs up                                          │
│           │                                                 │
│           ▼                                                 │
│   2. Stripe plugin creates customer in Stripe                │
│           │                                                 │
│           ▼                                                 │
│   3. Stripe customer ID stored in user.stripe_customer_id  │
│           │                                                 │
│           ▼                                                 │
│   4. Used for:                                              │
│      - Processing payments                                  │
│      - Retrieving payment methods                           │
│      - Managing subscriptions                               │
│      - Billing portal access                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Subscription Table

The `subscription` table stores subscription information for both individual users and organizations.

### Schema Definition

```typescript
export const subscription = pgTable('subscription', {
  id: text('id').primaryKey(),
  plan: text('plan').notNull(),
  referenceId: text('reference_id').notNull(),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  status: text('status'),
  periodStart: timestamp('period_start'),
  periodEnd: timestamp('period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end'),
  seats: integer('seats'),
  trialStart: timestamp('trial_start'),
  trialEnd: timestamp('trial_end'),
  metadata: json('metadata'),
})
```

### Column Details

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | text | No | Unique identifier (UUID) |
| `plan` | text | No | Plan name: `free`, `pro`, `team`, `enterprise` |
| `referenceId` | text | No | User ID (for Pro) or Organization ID (for Team/Enterprise) |
| `stripeCustomerId` | text | Yes | Stripe customer ID |
| `stripeSubscriptionId` | text | Yes | Stripe subscription ID |
| `status` | text | Yes | Subscription status: `active`, `canceled`, `past_due`, etc. |
| `periodStart` | timestamp | Yes | Billing period start date |
| `periodEnd` | timestamp | Yes | Billing period end date |
| `cancelAtPeriodEnd` | boolean | Yes | Whether subscription will cancel at period end |
| `seats` | integer | Yes | Number of seats (Team plans) |
| `trialStart` | timestamp | Yes | Trial period start |
| `trialEnd` | timestamp | Yes | Trial period end |
| `metadata` | json | Yes | Additional data (used for Enterprise plans) |

### Indexes

| Index Name | Columns | Purpose |
|------------|---------|---------|
| `subscription_reference_status_idx` | `referenceId`, `status` | Fast lookup by reference and status |

### Constraints

| Constraint | Description |
|------------|-------------|
| `check_enterprise_metadata` | Ensures enterprise plans have metadata |

---

## Plan Types and Reference IDs

```
┌─────────────────────────────────────────────────────────────┐
│              PLAN TYPES & REFERENCE IDS                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   FREE PLAN                                                 │
│   ─────────                                                 │
│   referenceId: User ID                                      │
│   stripeSubscriptionId: null (no Stripe subscription)       │
│   status: 'active'                                          │
│                                                             │
│   PRO PLAN                                                  │
│   ─────────                                                 │
│   referenceId: User ID                                      │
│   stripeSubscriptionId: Stripe subscription ID              │
│   status: 'active', 'past_due', 'canceled'                  │
│                                                             │
│   TEAM PLAN                                                 │
│   ─────────                                                 │
│   referenceId: Organization ID                              │
│   stripeSubscriptionId: Stripe subscription ID              │
│   seats: Number of team members                             │
│                                                             │
│   ENTERPRISE PLAN                                           │
│   ───────────────                                           │
│   referenceId: Organization ID                              │
│   stripeSubscriptionId: Stripe subscription ID              │
│   metadata: { seats, monthlyPrice, ... }                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Organization Table

The `organization` table stores team/enterprise organization data.

### Stripe-Related Columns

| Column | Type | Description |
|--------|------|-------------|
| `credit_balance` | decimal | Credits available for overage billing |

---

## User Stats Table

The `userStats` table tracks usage and billing information.

### Stripe-Related Columns

| Column | Type | Description |
|--------|------|-------------|
| `credit_balance` | decimal | Available credits for overage |
| `billed_overage_this_period` | decimal | Overage already billed in current period |

---

## Data Relationships

```
┌─────────────────┐       ┌─────────────────┐
│     user        │       │  subscription   │
├─────────────────┤       ├─────────────────┤
│ id              │◀──────│ referenceId     │ (for Pro plans)
│ stripeCustomerId│       │ stripeCustomerId│
│ ...             │       │ stripeSubscriptionId
└─────────────────┘       │ status          │
                          │ ...             │
                          └─────────────────┘
                                 ▲
                                 │
                          ┌──────┴──────────┐
                          │  organization   │
                          ├─────────────────┤
                          │ id              │◀──── subscription.referenceId (for Team plans)
                          │ credit_balance  │
                          │ ...             │
                          └─────────────────┘
```

---

## Status Values

### Subscription Status

| Status | Description |
|--------|-------------|
| `active` | Subscription is current and paid |
| `past_due` | Payment failed, retry in progress |
| `canceled` | Subscription has been terminated |
| `incomplete` | Initial payment failed |
| `trialing` | In free trial period |
| `unpaid` | Payment failed, no more retries |

---

## Migration History

Stripe-related columns were added in various migrations:

| Migration | Changes |
|-----------|---------|
| `0030_happy_joseph.sql` | Added `stripe_customer_id` to user table, `stripe_customer_id`, `stripe_subscription_id`, `status` to subscription table |
| Later migrations | Added indexes, constraints, and additional columns |

---

## Common Queries

### Find User by Stripe Customer ID

```typescript
const user = await db
  .select()
  .from(user)
  .where(eq(user.stripeCustomerId, customerId))
  .limit(1)
```

### Find Subscription by Stripe Subscription ID

```typescript
const subscription = await db
  .select()
  .from(subscription)
  .where(eq(subscription.stripeSubscriptionId, stripeSubscriptionId))
  .limit(1)
```

### Get User's Active Subscriptions

```typescript
const subscriptions = await db
  .select()
  .from(subscription)
  .where(and(
    eq(subscription.referenceId, userId),
    eq(subscription.status, 'active')
  ))
```

### Get Organization's Team Subscription

```typescript
const teamSub = await db
  .select()
  .from(subscription)
  .where(and(
    eq(subscription.referenceId, organizationId),
    eq(subscription.plan, 'team')
  ))
  .limit(1)
```

---

## Notes for Migration

When migrating to a new payment provider:

1. **Add new columns** for the new provider's IDs (e.g., `razorpay_customer_id`)
2. **Keep Stripe columns** during transition for existing subscriptions
3. **Create migration scripts** to sync data between providers
4. **Update indexes** to support new lookup patterns
5. **Consider data archival** for historical Stripe records
