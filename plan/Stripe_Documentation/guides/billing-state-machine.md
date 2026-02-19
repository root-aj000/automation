# Billing State Machine Documentation

This document describes all possible states a subscription can be in, the transitions between states, and the code paths that trigger each transition.

## Table of Contents

1. [Overview](#overview)
2. [Subscription States](#subscription-states)
3. [State Transitions](#state-transitions)
4. [Plan Types](#plan-types)
5. [State Diagrams](#state-diagrams)
6. [Code Reference](#code-reference)
7. [Database Schema](#database-schema)

---

## Overview

The billing system uses a state machine to track subscription status. Each subscription can be in one of several states, and transitions between states are triggered by Stripe webhooks, user actions, or system events.

### Key Concepts

- **Plan**: The subscription tier (free, pro, team, enterprise)
- **Status**: The current state of the subscription (active, canceled, past_due, etc.)
- **Reference ID**: The ID that identifies who owns the subscription (user ID or organization ID)

---

## Subscription States

### Status Values

| Status | Description | User Access |
|--------|-------------|-------------|
| `active` | Subscription is paid and current | Full access |
| `canceled` | Subscription has been canceled | No access (free tier) |
| `past_due` | Payment failed, retry in progress | Limited access |
| `unpaid` | Payment failed, no more retries | Blocked access |
| `incomplete` | Checkout started but not completed | Free tier access |
| `trialing` | In trial period (if applicable) | Full access |
| `null` | No subscription record | Free tier access |

### State Flags

The system derives several boolean flags from the subscription status:

```typescript
// From: apps/sim/lib/billing/client/utils.ts

interface SubscriptionFlags {
  isFree: boolean        // No active paid subscription
  isPro: boolean         // Active Pro subscription
  isTeam: boolean        // Active Team subscription
  isEnterprise: boolean  // Active Enterprise subscription
  isPaid: boolean        // Any active paid subscription
  isBlocked: boolean     // Payment failed or disputed
  isDispute: boolean     // Active chargeback/dispute
}
```

---

## State Transitions

### Transition Diagram

```
                                    ┌──────────────────────────────────────────┐
                                    │                                          │
                                    │                                          ▼
┌─────────────┐              ┌─────────────┐              ┌─────────────────────────┐
│   FREE      │   Upgrade    │   ACTIVE    │   Cancel     │      CANCELED           │
│  (no sub)   │─────────────▶│  (paid)     │─────────────▶│   (period end)          │
└─────────────┘              └──────┬──────┘              └─────────────────────────┘
      ▲                             │                              │
      │                             │ Payment Failed               │ Reactivate
      │                             ▼                              │
      │                      ┌─────────────┐                       │
      │                      │  PAST_DUE   │                       │
      │                      │ (retrying)  │                       │
      │                      └──────┬──────┘                       │
      │                             │                              │
      │                             │ Retry Failed                 │
      │                             ▼                              │
      │                      ┌─────────────┐                       │
      │                      │   UNPAID    │                       │
      └──────────────────────│ (blocked)   │◀──────────────────────┘
                             └─────────────┘
```

### Transition Triggers

| From State | To State | Trigger | Handler |
|------------|----------|---------|---------|
| Free | Active | Checkout completed | `checkout.session.completed` webhook |
| Active | Canceled | User cancels | `customer.subscription.deleted` webhook |
| Active | Past Due | Payment fails | `invoice.payment_failed` webhook |
| Past Due | Active | Payment succeeds | `invoice.payment_succeeded` webhook |
| Past Due | Unpaid | All retries fail | Stripe automatic transition |
| Canceled | Active | Reactivation | New checkout session |
| Canceled | Free | Period ends | System cleanup |

---

## Plan Types

### Plan Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SUBSCRIPTION TIERS                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   FREE           PRO              TEAM              ENTERPRISE              │
│   ────           ───              ────              ──────────              │
│   $0/mo          $20/mo           $40/seat/mo       Custom                  │
│   5 GB storage   50 GB storage    500 GB pooled     Unlimited               │
│   $5 usage       $50 usage        $100/seat usage   $500/seat usage         │
│   1 user         1 user           Multiple seats    Multiple seats          │
│                                                                             │
│   Features:      Features:        Features:         Features:               │
│   - Basic        - Everything     - Everything      - Everything            │
│     workflows      in Free         in Pro            in Team                │
│   - Limited      - Priority       - Team            - Dedicated             │
│     credits         support         collaboration     support              │
│   - Community    - Custom         - Shared          - Custom                │
│     support         usage limits     resources        integrations          │
│                                                     - SLA                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Plan Configuration

**File:** [`apps/sim/lib/billing/plans.ts:19-50`](apps/sim/lib/billing/plans.ts:19)

```typescript
export function getPlans(): BillingPlan[] {
  return [
    {
      name: 'free',
      priceId: env.STRIPE_FREE_PRICE_ID || '',
      limits: {
        cost: getFreeTierLimit(), // Default: $20
      },
    },
    {
      name: 'pro',
      priceId: env.STRIPE_PRO_PRICE_ID || '',
      limits: {
        cost: getProTierLimit(), // Default: $20
      },
    },
    {
      name: 'team',
      priceId: env.STRIPE_TEAM_PRICE_ID || '',
      limits: {
        cost: getTeamTierLimitPerSeat(), // Default: $40
      },
    },
    {
      name: 'enterprise',
      priceId: 'price_dynamic',
      limits: {
        cost: getTeamTierLimitPerSeat(),
      },
    },
  ]
}
```

---

## State Diagrams

### New User Registration Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        NEW USER REGISTRATION                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌───────────┐ │
│  │   User      │     │   Better    │     │   Stripe    │     │  Database │ │
│  │   Signs Up  │────▶│   Auth      │────▶│   Customer  │────▶│  Update   │ │
│  │             │     │   Plugin    │     │   Created   │     │           │ │
│  └─────────────┘     └─────────────┘     └─────────────┘     └───────────┘ │
│                                                                             │
│  Result:                                                                    │
│  - user.stripeCustomerId set                                               │
│  - No subscription record created (free tier)                              │
│  - Status: FREE                                                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Upgrade Flow (Free → Pro)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           UPGRADE TO PRO                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐  │
│  │  User   │    │   Frontend  │    │   Backend   │    │     Stripe      │  │
│  │ Clicks  │───▶│   Creates   │───▶│   Returns   │───▶│   Checkout      │  │
│  │ Upgrade │    │   Checkout  │    │   URL       │    │   Session       │  │
│  └─────────┘    └─────────────┘    └─────────────┘    └─────────────────┘  │
│                                                               │             │
│                                                               ▼             │
│                                                        ┌─────────────┐      │
│                                                        │   User      │      │
│                                                        │   Pays      │      │
│                                                        └──────┬──────┘      │
│                                                               │             │
│                                                               ▼             │
│  ┌─────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐  │
│  │ Update  │◀───│   Webhook   │◀───│   Stripe    │◀───│ checkout.session│  │
│  │ Database│    │   Handler   │    │   Sends     │    │   .completed    │  │
│  └─────────┘    └─────────────┘    └─────────────┘    └─────────────────┘  │
│                                                                             │
│  Result:                                                                    │
│  - subscription record created with status='active'                        │
│  - subscription.plan='pro'                                                  │
│  - subscription.stripeSubscriptionId set                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Payment Failure Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PAYMENT FAILURE                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                    │
│  │   Invoice   │     │   Stripe    │     │   Webhook   │                    │
│  │   Payment   │────▶│   Sends     │────▶│   Handler   │                    │
│  │   Fails     │     │   Event     │     │   Processes │                    │
│  └─────────────┘     └─────────────┘     └──────┬──────┘                    │
│                                                  │                          │
│                    ┌─────────────────────────────┼─────────────────────┐    │
│                    │                             │                     │    │
│                    ▼                             ▼                     ▼    │
│           ┌─────────────┐              ┌─────────────┐        ┌───────────┐ │
│           │   Update    │              │   Send      │        │   Log     │ │
│           │   Status    │              │   Email     │        │   Event   │ │
│           │   to Failed │              │   Notification    │   │           │ │
│           └─────────────┘              └─────────────┘        └───────────┘ │
│                                                                             │
│  User Experience:                                                           │
│  - Badge shows "Fix Now"                                                   │
│  - Usage may be limited                                                    │
│  - Email sent with payment link                                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Cancellation Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SUBSCRIPTION CANCELLATION                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                    │
│  │   User      │     │   Billing   │     │   Stripe    │                    │
│  │   Cancels   │────▶│   Portal    │────▶│   Updates   │                    │
│  │   in Portal │     │   Cancel    │     │   Status    │                    │
│  └─────────────┘     └─────────────┘     └──────┬──────┘                    │
│                                                  │                          │
│                                                  ▼                          │
│                                          ┌─────────────┐                    │
│                                          │   Webhook   │                    │
│                                          │   Received  │                    │
│                                          └──────┬──────┘                    │
│                                                  │                          │
│                     ┌────────────────────────────┼────────────────┐         │
│                     │                            │                │         │
│                     ▼                            ▼                ▼         │
│            ┌─────────────┐              ┌─────────────┐   ┌─────────────┐   │
│            │   Bill      │              │   Update    │   │   Reset     │   │
│            │   Overages  │              │   Status    │   │   Usage     │   │
│            │   (if any)  │              │   = canceled│   │   Limits    │   │
│            └─────────────┘              └─────────────┘   └─────────────┘   │
│                                                                             │
│  Result:                                                                    │
│  - subscription.status = 'canceled'                                        │
│  - cancelAtPeriodEnd = true (if canceling at period end)                   │
│  - User retains access until period end                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Code Reference

### Checking Subscription Status

**File:** [`apps/sim/lib/billing/subscriptions/utils.ts:38-80`](apps/sim/lib/billing/subscriptions/utils.ts:38)

```typescript
// Check if user has Enterprise plan
export function checkEnterprisePlan(subscription: any): boolean {
  return subscription?.plan === 'enterprise' && subscription?.status === 'active'
}

// Check if user has Pro plan
export function checkProPlan(subscription: any): boolean {
  return subscription?.plan === 'pro' && subscription?.status === 'active'
}

// Check if user has Team plan
export function checkTeamPlan(subscription: any): boolean {
  return subscription?.plan === 'team' && subscription?.status === 'active'
}
```

### Getting Subscription from Database

**File:** [`apps/sim/lib/billing/core/subscription.ts:28-50`](apps/sim/lib/billing/core/subscription.ts:28)

```typescript
// Get user's active subscription
export async function getSubscription(userId: string) {
  const result = await db
    .select()
    .from(subscription)
    .where(and(eq(subscription.referenceId, userId), eq(subscription.status, 'active')))
    .limit(1)
  
  return result[0] || null
}

// Get subscriptions for multiple organizations
export async function getOrganizationSubscriptions(orgIds: string[]) {
  return db
    .select()
    .from(subscription)
    .where(and(inArray(subscription.referenceId, orgIds), eq(subscription.status, 'active')))
}
```

### Subscription Status Flags

**File:** [`apps/sim/lib/billing/client/utils.ts:20-40`](apps/sim/lib/billing/client/utils.ts:20)

```typescript
/**
 * Get subscription status flags from subscription data
 */
export function getSubscriptionFlags(subscriptionData: any) {
  return {
    isFree: !subscriptionData || subscriptionData.plan === 'free',
    isPro: subscriptionData?.plan === 'pro' && subscriptionData?.status === 'active',
    isTeam: subscriptionData?.plan === 'team' && subscriptionData?.status === 'active',
    isEnterprise: subscriptionData?.plan === 'enterprise' && subscriptionData?.status === 'active',
    isPaid: subscriptionData?.status === 'active' && 
            ['pro', 'team', 'enterprise'].includes(subscriptionData?.plan),
    status: subscriptionData?.status ?? null,
    plan: subscriptionData?.plan ?? 'free',
  }
}
```

### Webhook Status Updates

**File:** [`apps/sim/lib/auth/auth.ts:2086-2215`](apps/sim/lib/auth/auth.ts:2086)

```typescript
// On subscription complete (checkout success)
onSubscriptionComplete: async ({ subscription, stripeSubscription }) => {
  logger.info('Subscription completed', {
    subscriptionId: subscription.id,
    status: subscription.status,
    plan: subscription.plan,
  })
  // Status is automatically set to 'active' by better-auth plugin
},

// On subscription update
onSubscriptionUpdate: async ({ subscription, stripeSubscription }) => {
  logger.info('Subscription updated', {
    subscriptionId: subscription.id,
    status: subscription.status,
    plan: subscription.plan,
  })
},

// On subscription deleted
onSubscriptionDeleted: async ({ subscription, stripeSubscription }) => {
  logger.info('Subscription deleted', {
    subscriptionId: subscription.id,
  })
  // Note: better-auth's Stripe plugin already updates status to 'canceled'
  // Additional cleanup handled in webhook handler
},
```

---

## Database Schema

### Subscription Table

**File:** [`packages/db/schema.ts:723-750`](packages/db/schema.ts:723)

```typescript
export const subscription = pgTable('subscription', {
  id: serial('id').primaryKey(),
  
  // Who owns this subscription (user ID or organization ID)
  referenceId: varchar('reference_id', { length: 255 }).notNull(),
  
  // Stripe identifiers
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  
  // Subscription details
  plan: varchar('plan', { length: 50 }).notNull(), // 'free', 'pro', 'team', 'enterprise'
  status: varchar('status', { length: 50 }),       // 'active', 'canceled', 'past_due', etc.
  seats: integer('seats'),                         // For team plans
  
  // Billing period
  periodStart: timestamp('period_start'),
  periodEnd: timestamp('period_end'),
  
  // Usage tracking
  usageLimit: varchar('usage_limit', { length: 255 }),
  
  // Cancellation
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  
  // Metadata
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
```

### User Table (Stripe Fields)

**File:** [`packages/db/schema.ts:67-98`](packages/db/schema.ts:67)

```typescript
export const user = pgTable('user', {
  id: varchar('id', { length: 255 }).primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  
  // Stripe customer ID for individual billing
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  
  // ... other fields
})
```

---

## Common State Queries

### Check if User Has Active Subscription

```typescript
// Method 1: Check subscription table
const hasActiveSubscription = async (userId: string) => {
  const sub = await db
    .select()
    .from(subscription)
    .where(and(
      eq(subscription.referenceId, userId),
      eq(subscription.status, 'active')
    ))
    .limit(1)
  
  return sub.length > 0
}

// Method 2: Check plan-specific
const hasProSubscription = (subscription: any) => {
  return subscription?.plan === 'pro' && subscription?.status === 'active'
}
```

### Check if User is Blocked

```typescript
const isUserBlocked = (subscription: any) => {
  const blockedStatuses = ['past_due', 'unpaid', 'incomplete']
  return blockedStatuses.includes(subscription?.status)
}
```

### Get Effective Plan

```typescript
const getEffectivePlan = (subscription: any) => {
  if (!subscription || subscription.status !== 'active') {
    return 'free'
  }
  return subscription.plan
}
```

---

## Summary Table

| Current State | Event | New State | Access Level |
|---------------|-------|-----------|--------------|
| Free | Checkout completed | Active | Full (paid) |
| Active | Payment failed | Past Due | Limited |
| Past Due | Payment succeeded | Active | Full (paid) |
| Past Due | All retries failed | Unpaid | Blocked |
| Active | User cancels | Canceled | Until period end |
| Canceled | Period ended | Free | Free tier |
| Canceled | User reactivates | Active | Full (paid) |

---

## Related Documentation

- [Webhook Handler Deep Dive](./webhook-deep-dive.md)
- [Developer Onboarding Guide](./developer-onboarding.md)
- [Credit System Documentation](./credit-system.md)
