# Testing & Debugging Guide - Billing System

This guide provides comprehensive instructions for testing billing flows locally and debugging common billing issues.

## Table of Contents

1. [Local Testing Setup](#local-testing-setup)
2. [Testing Billing Flows](#testing-billing-flows)
3. [Debugging Tools](#debugging-tools)
4. [Common Issues & Solutions](#common-issues--solutions)
5. [Log Analysis](#log-analysis)
6. [Stripe Dashboard Debugging](#stripe-dashboard-debugging)

---

## Local Testing Setup

### Prerequisites

Before testing billing locally, ensure you have:

1. **Stripe CLI installed and logged in**
   ```bash
   stripe login
   ```

2. **Test mode API keys** in your `.env`:
   ```bash
   STRIPE_SECRET_KEY=sk_test_xxx
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   ```

3. **Development server running**
   ```bash
   bun run dev
   ```

### Starting Webhook Forwarding

In a separate terminal, run:

```bash
stripe listen --forward-to localhost:3000/api/auth/stripe/webhook
```

This will:
- Generate a webhook signing secret (starts with `whsec_`)
- Forward all Stripe webhook events to your local server
- Display events in real-time

**Important:** Update your `.env` with the generated `whsec_` secret.

### Test Mode Indicators

Always verify you're in test mode:
- API keys start with `sk_test_` (not `sk_live_`)
- Stripe Dashboard shows "Test mode" toggle in the top right
- Customer IDs start with `cus_test_` (not actual `cus_`)

---

## Testing Billing Flows

### Test Card Numbers

Use these card numbers with any future expiry date and any CVC:

#### Successful Payments

| Card Number | Brand | Scenario |
|-------------|-------|----------|
| `4242 4242 4242 4242` | Visa | Standard success |
| `5555 5555 5555 4444` | Mastercard | Standard success |
| `4000 0025 0000 3155` | Visa | Requires 3D Secure |
| `4000 0061 0000 0004` | Visa | Non-card payment |

#### Failed Payments

| Card Number | Scenario |
|-------------|----------|
| `4000 0000 0000 0002` | Generic decline |
| `4000 0000 0000 9995` | Insufficient funds |
| `4000 0000 0000 0069` | Expired card |
| `4000 0000 0000 9987` | Lost card |
| `4000 0000 0000 3220` | 3D Secure required |

### Testing Subscription Purchase

```bash
# 1. Start webhook forwarding
stripe listen --forward-to localhost:3000/api/auth/stripe/webhook

# 2. In your app, go to subscription settings
# 3. Click "Upgrade to Pro"
# 4. Use test card: 4242 4242 4242 4242
# 5. Complete checkout

# 6. Verify webhook received
# You should see: checkout.session.completed
#                 customer.subscription.created
```

### Testing Payment Failure

```bash
# 1. Start webhook forwarding
stripe listen --forward-to localhost:3000/api/auth/stripe/webhook

# 2. Use decline card: 4000 0000 0000 0002
# 3. Attempt purchase

# 4. Verify webhook received
# You should see: invoice.payment_failed
```

### Triggering Webhook Events

You can trigger specific webhook events without going through the UI:

```bash
# Payment succeeded
stripe trigger invoice.payment_succeeded

# Payment failed
stripe trigger invoice.payment_failed

# Invoice finalized (for overage billing)
stripe trigger invoice.finalized

# Subscription canceled
stripe trigger customer.subscription.deleted

# Dispute created
stripe trigger charge.dispute.created

# Dispute closed (won)
stripe trigger charge.dispute.closed --add charge_dispute:status=won
```

### Testing Credit Purchase

```bash
# 1. Ensure you have an active Pro or Team subscription
# 2. Use the API or UI to purchase credits

# Via API
curl -X POST http://localhost:3000/api/billing/credits/purchase \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{"amountDollars": 50}'

# 3. Verify webhook: invoice.payment_succeeded with metadata.type = 'credit_purchase'
```

### Testing Team Billing

```bash
# 1. Create an organization
# 2. Upgrade to Team plan
# 3. Invite members

# 4. Trigger payment failure (blocks all members)
stripe trigger invoice.payment_failed

# 5. Check all members are blocked in database
# SELECT * FROM user_stats WHERE billing_blocked = true;

# 6. Trigger payment success (unblocks all members)
stripe trigger invoice.payment_succeeded
```

---

## Debugging Tools

### Stripe CLI Commands

```bash
# View recent events
stripe events list

# Get specific event details
stripe events retrieve evt_xxx

# View recent logs
stripe logs tail

# Search logs
stripe logs search "invoice"

# View a specific customer
stripe customers retrieve cus_xxx

# View a subscription
stripe subscriptions retrieve sub_xxx
```

### Database Queries

Check subscription status:

```sql
-- Get all active subscriptions
SELECT * FROM subscription WHERE status = 'active';

-- Get user's Stripe customer ID
SELECT id, email, stripe_customer_id FROM "user" WHERE id = 'user_xxx';

-- Check blocked users
SELECT us.*, u.email 
FROM user_stats us 
JOIN "user" u ON u.id = us.user_id 
WHERE us.billing_blocked = true;

-- Check credit balances
SELECT us.user_id, us.credit_balance, u.email
FROM user_stats us
JOIN "user" u ON u.id = us.user_id
WHERE us.credit_balance::decimal > 0;

-- Organization usage
SELECT 
  o.id,
  o.name,
  o.org_usage_limit,
  o.credit_balance,
  s.plan,
  s.seats,
  s.status
FROM organization o
JOIN subscription s ON s.reference_id = o.id
WHERE s.status = 'active';
```

### Server Log Analysis

Look for these log prefixes in your server output:

| Logger | Purpose |
|--------|---------|
| `StripeInvoiceWebhooks` | Webhook processing |
| `CreditBalance` | Credit operations |
| `CreditPurchase` | Credit purchase flow |
| `OrganizationBilling` | Team billing |
| `BillingPortal` | Portal session creation |
| `ThresholdBilling` | Overage billing |

---

## Common Issues & Solutions

### Issue: "Stripe client is not available"

**Symptoms:**
- Error: "Stripe client is not available. Set STRIPE_SECRET_KEY..."
- Billing operations fail silently

**Solution:**
```bash
# Check .env file
cat .env | grep STRIPE

# Should see:
# STRIPE_SECRET_KEY=sk_test_xxx

# If missing, add it:
echo 'STRIPE_SECRET_KEY=sk_test_xxx' >> .env

# Restart server
bun run dev
```

---

### Issue: Webhooks not received

**Symptoms:**
- Payments succeed in Stripe but database not updated
- No webhook logs in server output

**Solution:**
```bash
# 1. Verify Stripe CLI is running
stripe listen --forward-to localhost:3000/api/auth/stripe/webhook

# 2. Check webhook secret matches
# In .env:
STRIPE_WEBHOOK_SECRET=whsec_xxx  # Must match CLI output

# 3. Verify endpoint path
# Should be: /api/auth/stripe/webhook (Better Auth plugin)
# NOT: /api/webhooks/stripe

# 4. Test with a trigger
stripe trigger invoice.payment_succeeded

# 5. Check server logs for "StripeInvoiceWebhooks"
```

---

### Issue: "Customer not found" error

**Symptoms:**
- Billing portal fails with 404
- Error: "Stripe customer not found"

**Solution:**
```bash
# 1. Check if user has stripeCustomerId
SELECT id, email, stripe_customer_id FROM "user" WHERE id = 'user_xxx';

# 2. If NULL, check Stripe for customer
stripe customers list --email "user@example.com"

# 3. If customer exists in Stripe but not in DB, update:
UPDATE "user" 
SET stripe_customer_id = 'cus_xxx' 
WHERE id = 'user_xxx';

# 4. If no customer exists, create one:
stripe customers create --email "user@example.com" --name "User Name"
```

---

### Issue: User blocked but payment succeeded

**Symptoms:**
- User shows as blocked (`billingBlocked: true`)
- Payment shows as successful in Stripe

**Solution:**
```bash
# 1. Check the block reason
SELECT billing_blocked_reason FROM user_stats WHERE user_id = 'user_xxx';

# Possible reasons:
# - 'payment_failed' -> Should be unblocked by webhook
# - 'dispute' -> Must be resolved via dispute process

# 2. If 'payment_failed', manually trigger webhook
stripe trigger invoice.payment_succeeded

# 3. If that doesn't work, manually unblock:
UPDATE user_stats 
SET billing_blocked = false, billing_blocked_reason = null 
WHERE user_id = 'user_xxx' 
AND billing_blocked_reason = 'payment_failed';

# WARNING: Do NOT unblock 'dispute' blocks manually
```

---

### Issue: Credits not added after purchase

**Symptoms:**
- Payment succeeded but credit balance unchanged

**Solution:**
```bash
# 1. Find the invoice
stripe invoices list --customer cus_xxx

# 2. Check invoice metadata
stripe invoices retrieve in_xxx

# Should have:
# metadata.type: 'credit_purchase'
# metadata.entityType: 'user' or 'organization'
# metadata.amountDollars: '50'

# 3. If metadata is correct, check webhook logs
# Look for: "Credit purchase completed via webhook"

# 4. Manually trigger if needed
stripe events resend evt_xxx

# 5. Or manually add credits via SQL
UPDATE user_stats 
SET credit_balance = credit_balance::decimal + 50 
WHERE user_id = 'user_xxx';
```

---

### Issue: Overage invoice not created

**Symptoms:**
- Usage exceeds limit but no overage invoice

**Solution:**
```bash
# 1. Check current usage vs limit
SELECT 
  current_period_cost,
  current_usage_limit
FROM user_stats 
WHERE user_id = 'user_xxx';

# 2. Overage only bills at invoice.finalized (period end)
# Not during the billing period

# 3. Check if invoice.finalized webhook was received
stripe events list --type invoice.finalized

# 4. Manually trigger for testing
stripe trigger invoice.finalized

# Note: This will only create overage invoice if:
# - billing_reason is 'subscription_cycle'
# - Usage exceeds the limit
```

---

## Log Analysis

### Server Log Patterns

Look for these patterns in your server logs:

#### Successful Payment
```
[StripeInvoiceWebhooks] Payment succeeded for subscription
[StripeInvoiceWebhooks] Unblocked user due to payment success
```

#### Failed Payment
```
[StripeInvoiceWebhooks] Invoice payment failed
[StripeInvoiceWebhooks] Blocked user due to payment failure
[StripeInvoiceWebhooks] Payment failure email sent
```

#### Credit Purchase
```
[CreditPurchase] Credit purchase invoice created and paid
[StripeInvoiceWebhooks] Credit purchase completed via webhook
[CreditBalance] Added credits to user
```

#### Overage Billing
```
[StripeInvoiceWebhooks] Invoice finalized overage calculation
[StripeInvoiceWebhooks] Applied credits to reduce overage at cycle end
[ThresholdBilling] Overage invoice created
```

### Error Log Patterns

```
[StripeInvoiceWebhooks] Failed to handle invoice payment failed
[BillingPortal] Stripe customer not found for portal session
[CreditPurchase] Failed to purchase credits
```

---

## Stripe Dashboard Debugging

### Useful Dashboard Pages

1. **Customers** → Find customer by email
   - View payment methods
   - View subscriptions
   - View invoices

2. **Subscriptions** → View subscription details
   - Current status
   - Billing cycle
   - Price/quantity

3. **Payments** → View all payment attempts
   - Success/failure status
   - Failure reason
   - Refund history

4. **Webhooks** → View webhook delivery
   - Success/failure rate
   - Response time
   - Retry attempts

### Checking Webhook Delivery

1. Go to **Developers** → **Webhooks**
2. Click on your endpoint
3. View recent deliveries
4. Click on an event to see:
   - Request payload
   - Response status
   - Response body
   - Retry history

### Simulating Webhooks from Dashboard

1. Go to **Developers** → **Webhooks**
2. Click "Send test webhook"
3. Select event type
4. Send to your endpoint

---

## Quick Debug Checklist

When billing isn't working, check in this order:

1. **Environment**
   - [ ] `STRIPE_SECRET_KEY` set and starts with `sk_test_`
   - [ ] `STRIPE_WEBHOOK_SECRET` matches CLI output
   - [ ] Price IDs configured for each plan

2. **Stripe CLI**
   - [ ] `stripe login` successful
   - [ ] `stripe listen` running
   - [ ] Events appearing in CLI output

3. **Server**
   - [ ] Server running on correct port
   - [ ] Logs showing webhook receipt
   - [ ] No errors in server output

4. **Database**
   - [ ] User has `stripeCustomerId`
   - [ ] Subscription record exists
   - [ ] Status is 'active'

5. **Stripe Dashboard**
   - [ ] Customer exists
   - [ ] Subscription exists
   - [ ] Payment method on file

---

## Related Documentation

- [Developer Onboarding Guide](./developer-onboarding.md)
- [Webhook Handler Deep Dive](./webhook-deep-dive.md)
- [Billing State Machine](./billing-state-machine.md)
- [Troubleshooting](../troubleshooting.md)
