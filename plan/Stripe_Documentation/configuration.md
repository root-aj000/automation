# Stripe Configuration Guide

This document explains how the Stripe payment gateway is configured in the Sim application. It is intended for administrators and technical staff.

---

## Overview

The Stripe integration requires several configuration settings to function properly. These are stored as environment variables and loaded when the application starts.

---

## Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `STRIPE_SECRET_KEY` | Stripe API secret key for server-side operations | `sk_live_...` or `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Secret to verify webhook signatures | `whsec_...` |
| `STRIPE_PUBLISHABLE_KEY` | Public key for client-side operations | `pk_live_...` or `pk_test_...` |

---

## Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OVERAGE_THRESHOLD_DOLLARS` | Minimum overage amount before billing | `10` |
| `BILLING_ENABLED` | Enable/disable billing features | `true` |

---

## Stripe Client Initialization

The Stripe client is initialized as a singleton to ensure only one instance exists throughout the application lifecycle.

**Key Principles:**
1. **Lazy Initialization**: The client is created only when first needed
2. **Null Safety**: If credentials are missing, the system gracefully handles the absence
3. **Error Handling**: Clear error messages when Stripe is required but not configured

---

## Webhook Configuration

Stripe webhooks notify the application about payment events in real-time.

### Supported Webhook Events

| Event Type | Handler | Purpose |
|------------|---------|---------|
| `invoice.payment_succeeded` | `handleInvoicePaymentSucceeded` | Process successful payments |
| `invoice.payment_failed` | `handleInvoicePaymentFailed` | Handle failed payments |
| `invoice.finalized` | `handleInvoiceFinalized` | Process finalized invoices |
| `customer.subscription.created` | `handleManualEnterpriseSubscription` | Handle enterprise subscriptions |
| `charge.dispute.created` | `handleChargeDispute` | Process new disputes |
| `charge.dispute.closed` | `handleDisputeClosed` | Handle dispute resolution |

### Setting Up Webhooks in Stripe Dashboard

1. Go to Developers → Webhooks in your Stripe Dashboard
2. Click "Add endpoint"
3. Enter your endpoint URL: `https://your-domain.com/api/stripe/webhook`
4. Select the events listed above
5. Copy the signing secret to your `STRIPE_WEBHOOK_SECRET` environment variable

---

## Subscription Plans Configuration

Subscription plans are defined in the system and include:

### Plan Structure

```
┌─────────────────────────────────────────────────────────────┐
│                      PLAN STRUCTURE                          │
├─────────────────────────────────────────────────────────────┤
│  name: string          - Plan identifier (free, pro, team)  │
│  priceId: string       - Stripe Price ID                    │
│  monthlyPriceId: string - Monthly billing price ID          │
│  yearlyPriceId: string - Yearly billing price ID            │
│  features: string[]    - List of plan features              │
│  limits: object        - Usage limits for the plan          │
└─────────────────────────────────────────────────────────────┘
```

### Plan Types

| Plan | Billing Model | Special Features |
|------|---------------|------------------|
| Free | None | Limited usage, basic features |
| Pro | Individual subscription | Higher limits, advanced features |
| Team | Seat-based subscription | Organization, collaboration |
| Enterprise | Custom | Negotiated pricing, custom limits |

---

## Customer Creation

When billing is enabled, a Stripe customer is automatically created when a user signs up.

**Process:**
1. User completes registration
2. System creates a Stripe customer record
3. Customer ID is stored in the database
4. User can immediately add payment methods

---

## Checkout Session Configuration

When a user initiates a subscription purchase:

### Standard Plans (Pro)
```
- Allow promotion codes: Yes
- Payment method types: Card
```

### Team Plans
```
- Allow promotion codes: Yes
- Line items: Seat-based pricing
- Adjustable quantity: Yes
- Minimum seats: 1
- Maximum seats: 50
```

---

## Security Considerations

### API Key Security
- **Never** expose the secret key in client-side code
- Rotate keys periodically through Stripe Dashboard
- Use restricted keys for specific operations when possible

### Webhook Security
- Always verify webhook signatures using the signing secret
- Reject any webhook with an invalid signature
- Log all webhook events for audit purposes

### Data Handling
- Never store full credit card numbers
- Use Stripe's tokenization for payment methods
- Comply with PCI DSS requirements (handled by Stripe)

---

## Testing Configuration

### Test Mode vs Live Mode

| Aspect | Test Mode | Live Mode |
|--------|-----------|-----------|
| API Keys | Start with `sk_test_` | Start with `sk_live_` |
| Real Charges | No | Yes |
| Test Cards | Work | Don't work |
| Webhooks | Test endpoints | Production endpoints |

### Useful Test Card Numbers

| Card Number | Result |
|-------------|--------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Decline |
| `4000 0000 0000 9995` | Insufficient funds |
| `4000 0000 0000 0069` | Expired card |

(Use any future expiry date and any 3-digit CVC)

---

## Troubleshooting

### Common Issues

1. **"Stripe client is not available"**
   - Check `STRIPE_SECRET_KEY` is set correctly
   - Verify the key is valid in Stripe Dashboard

2. **Webhooks not received**
   - Verify endpoint URL is accessible from internet
   - Check webhook secret matches
   - Ensure events are selected in Stripe Dashboard

3. **Payment fails silently**
   - Check Stripe Dashboard for error details
   - Verify customer has a valid payment method

---

## Monitoring & Logging

All Stripe operations are logged with:
- Timestamp
- Operation type
- Customer/subscription ID
- Success/failure status
- Error details (if applicable)

Monitor these logs to identify issues early.
