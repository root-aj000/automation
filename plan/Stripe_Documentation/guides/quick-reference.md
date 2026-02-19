# Quick Reference Cards - Billing System

This document provides one-page cheat sheets for common billing tasks, API endpoints, and commands.

---

## 🚀 Quick Start Commands

```bash
# Start development server
bun run dev

# Start Stripe webhook forwarding
stripe listen --forward-to localhost:3000/api/auth/stripe/webhook

# Trigger test webhook
stripe trigger invoice.payment_succeeded

# View Stripe logs
stripe logs tail
```

---

## 📋 Environment Variables

```bash
# Required
STRIPE_SECRET_KEY=sk_test_xxx          # Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_xxx        # Webhook signing secret

# Price IDs
STRIPE_FREE_PRICE_ID=                  # Free tier (usually empty)
STRIPE_PRO_PRICE_ID=price_xxx          # Pro tier
STRIPE_TEAM_PRICE_ID=price_xxx         # Team tier (per seat)
STRIPE_ENTERPRISE_PRICE_ID=price_xxx   # Enterprise tier

# Tier Limits (in dollars)
FREE_TIER_COST_LIMIT=20
PRO_TIER_COST_LIMIT=20
TEAM_TIER_COST_LIMIT=40
ENTERPRISE_TIER_COST_LIMIT=200

# Storage Limits (in GB)
FREE_STORAGE_LIMIT_GB=5
PRO_STORAGE_LIMIT_GB=50
TEAM_STORAGE_LIMIT_GB=500
```

---

## 💳 Test Card Numbers

| Card Number | Result |
|-------------|--------|
| `4242 4242 4242 4242` | ✅ Success |
| `5555 5555 5555 4444` | ✅ Success |
| `4000 0000 0000 0002` | ❌ Decline |
| `4000 0000 0000 9995` | ❌ Insufficient funds |
| `4000 0000 0000 0069` | ❌ Expired card |

**Any future expiry date, any CVC**

---

## 🔌 API Endpoints

### Billing Portal

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/billing/portal` | Create billing portal session |

**Request:**
```json
{
  "context": "user",           // or "organization"
  "organizationId": "org_xxx", // required if context=organization
  "returnUrl": "https://..."   // optional
}
```

**Response:**
```json
{
  "url": "https://billing.stripe.com/..."
}
```

### Credits

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/billing/credits/balance` | Get credit balance |
| `POST` | `/api/billing/credits/purchase` | Purchase credits |

**Purchase Request:**
```json
{
  "amountDollars": 50  // Min: $10, Max: $1000
}
```

### Organization

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/organizations/{id}/billing` | Get billing data |
| `POST` | `/api/organizations/{id}/usage-limit` | Update usage limit |
| `GET` | `/api/organizations/{id}/seats` | Get seat info |

---

## 📊 Database Tables

### Key Tables

| Table | Purpose |
|-------|---------|
| `user` | User data, `stripe_customer_id` |
| `subscription` | Subscription records |
| `user_stats` | Usage, limits, credits, blocking |
| `organization` | Team data, `credit_balance`, `org_usage_limit` |
| `member` | Team membership |

### Important Columns

**subscription table:**
```
id, referenceId, stripeCustomerId, stripeSubscriptionId,
plan, status, seats, periodStart, periodEnd, cancelAtPeriodEnd
```

**user_stats table:**
```
userId, currentPeriodCost, currentUsageLimit,
creditBalance, billingBlocked, billingBlockedReason
```

---

## 🔄 Webhook Events

| Event | Handler | Action |
|-------|---------|--------|
| `invoice.payment_succeeded` | `handleInvoicePaymentSucceeded` | Unblock user, reset usage |
| `invoice.payment_failed` | `handleInvoicePaymentFailed` | Block user, send email |
| `invoice.finalized` | `handleInvoiceFinalized` | Calculate overage, create invoice |
| `charge.dispute.created` | `onEvent` | Block user |
| `charge.dispute.closed` | `onEvent` | Unblock if won |
| `customer.subscription.deleted` | `onSubscriptionDeleted` | Cleanup |

### Trigger Commands

```bash
stripe trigger invoice.payment_succeeded
stripe trigger invoice.payment_failed
stripe trigger invoice.finalized
stripe trigger customer.subscription.deleted
stripe trigger charge.dispute.created
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `lib/billing/stripe-client.ts` | Stripe SDK initialization |
| `lib/billing/plans.ts` | Plan configuration |
| `lib/billing/webhooks/invoices.ts` | Webhook handlers |
| `lib/billing/credits/balance.ts` | Credit balance management |
| `lib/billing/credits/purchase.ts` | Credit purchasing |
| `lib/billing/core/organization.ts` | Team billing logic |
| `lib/billing/threshold-billing.ts` | Overage billing |
| `lib/auth/auth.ts` | Better Auth + Stripe plugin |

---

## 🗄️ Quick SQL Queries

### Check Subscription Status

```sql
SELECT plan, status, seats, period_end
FROM subscription
WHERE reference_id = 'user_or_org_id';
```

### Check Blocked Users

```sql
SELECT u.email, us.billing_blocked_reason
FROM user_stats us
JOIN "user" u ON u.id = us.user_id
WHERE us.billing_blocked = true;
```

### Check Credit Balance

```sql
-- User
SELECT credit_balance FROM user_stats WHERE user_id = 'xxx';

-- Organization
SELECT credit_balance FROM organization WHERE id = 'xxx';
```

### Check Usage vs Limit

```sql
SELECT 
  current_period_cost as usage,
  current_usage_limit as limit,
  ROUND((current_period_cost::decimal / current_usage_limit::decimal) * 100, 2) as percent_used
FROM user_stats
WHERE user_id = 'xxx';
```

---

## 🎯 Common Tasks

### Unblock User (Payment Failed)

```sql
UPDATE user_stats
SET billing_blocked = false, billing_blocked_reason = null
WHERE user_id = 'xxx' AND billing_blocked_reason = 'payment_failed';
```

### Add Credits Manually

```sql
-- User
UPDATE user_stats
SET credit_balance = credit_balance::decimal + 50
WHERE user_id = 'xxx';

-- Organization
UPDATE organization
SET credit_balance = credit_balance::decimal + 50
WHERE id = 'xxx';
```

### Check Webhook Secret

```bash
# Get from Stripe CLI output when running:
stripe listen --forward-to localhost:3000/api/auth/stripe/webhook

# Output includes:
# Your webhook signing secret is whsec_xxx
```

---

## 📊 Plan Comparison

| Feature | Free | Pro | Team | Enterprise |
|---------|------|-----|------|------------|
| **Price** | $0 | $20/mo | $40/seat/mo | Custom |
| **Usage Limit** | $5 | $50 | $100/seat | Custom |
| **Storage** | 5 GB | 50 GB | 500 GB pooled | Unlimited |
| **Credits** | ❌ | ✅ | ✅ (Admin) | ❌ |
| **Team** | ❌ | ❌ | ✅ | ✅ |
| **SSO** | ❌ | ❌ | ❌ | ✅ |

---

## 🔍 Debug Checklist

When billing fails, check:

1. [ ] `STRIPE_SECRET_KEY` in `.env` (starts with `sk_test_`)
2. [ ] `STRIPE_WEBHOOK_SECRET` matches CLI output
3. [ ] Stripe CLI running (`stripe listen ...`)
4. [ ] User has `stripe_customer_id` in database
5. [ ] Subscription record exists with `status = 'active'`
6. [ ] Price IDs configured in `.env`
7. [ ] Server logs for errors
8. [ ] Stripe Dashboard for payment status

---

## 📞 Support Resources

- **Stripe Dashboard:** https://dashboard.stripe.com/
- **Stripe CLI:** https://stripe.com/docs/stripe-cli
- **Stripe API Docs:** https://stripe.com/docs/api
- **Test Cards:** https://stripe.com/docs/testing

---

## 🏷️ Status Codes

### Subscription Status

| Status | Meaning |
|--------|---------|
| `active` | Paid and current |
| `canceled` | Cancelled, no access |
| `past_due` | Payment failed, retrying |
| `unpaid` | Payment failed, blocked |
| `incomplete` | Checkout incomplete |

### Block Reasons

| Reason | Can Self-Resolve |
|--------|------------------|
| `payment_failed` | ✅ Via billing portal |
| `dispute` | ❌ Must resolve dispute |

---

## 📝 Code Snippets

### Get User's Subscription

```typescript
import { getHighestPrioritySubscription } from '@/lib/billing/core/subscription'

const subscription = await getHighestPrioritySubscription(userId)
// Returns: { plan, status, seats, stripeSubscriptionId, ... }
```

### Check Plan Type

```typescript
import { checkProPlan, checkTeamPlan, checkEnterprisePlan } from '@/lib/billing/subscriptions/utils'

const isPro = checkProPlan(subscription)      // plan='pro' && status='active'
const isTeam = checkTeamPlan(subscription)    // plan='team' && status='active'
const isEnterprise = checkEnterprisePlan(subscription) // plan='enterprise' && status='active'
```

### Get Credit Balance

```typescript
import { getCreditBalance } from '@/lib/billing/credits/balance'

const { balance, entityType, entityId } = await getCreditBalance(userId)
```

### Check Billing Permission

```typescript
import { isOrgAdmin } from '@/lib/billing/credits/balance'

const canManage = await isOrgAdmin(userId, organizationId)
// Returns true for owner or admin role
```

---

## 🔗 Quick Links

| Documentation | File |
|---------------|------|
| Developer Onboarding | [`guides/developer-onboarding.md`](guides/developer-onboarding.md) |
| Billing State Machine | [`guides/billing-state-machine.md`](guides/billing-state-machine.md) |
| Webhook Deep Dive | [`guides/webhook-deep-dive.md`](guides/webhook-deep-dive.md) |
| Credit System | [`guides/credit-system.md`](guides/credit-system.md) |
| Team Billing | [`guides/team-billing.md`](guides/team-billing.md) |
| Testing & Debugging | [`guides/testing-debugging.md`](guides/testing-debugging.md) |
| Migration Guide | [`migration-guide.md`](migration-guide.md) |
| API Reference | [`technical/stripe-api-reference.md`](technical/stripe-api-reference.md) |
| Database Schema | [`technical/database-schema.md`](technical/database-schema.md) |
