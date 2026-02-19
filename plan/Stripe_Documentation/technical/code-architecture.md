# Stripe Integration Code Architecture

This document provides a high-level technical overview of how the Stripe payment integration is structured in the Sim application.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ARCHITECTURE OVERVIEW                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend UI   │────▶│    API Routes   │────▶│  Stripe Client  │
│   (Web App)     │     │   (Backend)     │     │   (External)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │                         │
                               │                         │
                               ▼                         ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │    Database     │     │  Webhook        │
                        │   (PostgreSQL)  │     │  Handlers       │
                        └─────────────────┘     └─────────────────┘
```

---

## Directory Structure

```
apps/sim/
├── lib/
│   ├── billing/
│   │   ├── stripe-client.ts          # Stripe client singleton
│   │   ├── constants.ts              # Billing constants
│   │   ├── threshold-billing.ts      # Overage billing logic
│   │   │
│   │   ├── core/
│   │   │   ├── billing.ts            # Core billing calculations
│   │   │   └── subscription.ts       # Subscription management
│   │   │
│   │   ├── credits/
│   │   │   └── purchase.ts           # Credit purchase flow
│   │   │
│   │   ├── webhooks/
│   │   │   ├── invoices.ts           # Invoice webhook handlers
│   │   │   ├── disputes.ts           # Dispute webhook handlers
│   │   │   └── enterprise.ts         # Enterprise subscription handling
│   │   │
│   │   └── organizations/
│   │       └── membership.ts         # Team subscription management
│   │
│   └── auth/
│       └── auth.ts                   # Auth + Stripe plugin config
│
├── tools/
│   └── stripe/                       # Stripe API tool wrappers
│       ├── create-customer.ts
│       ├── create-subscription.ts
│       ├── create-invoice.ts
│       └── ... (40+ tool files)
│
├── triggers/
│   └── stripe/
│       └── webhook.ts                # Stripe webhook trigger
│
└── blocks/
    └── blocks/
        └── stripe.ts                 # Stripe block for workflows
```

---

## Core Components

### 1. Stripe Client (`stripe-client.ts`)

**Purpose:** Provides a singleton instance of the Stripe client.

**Key Functions:**
- `getStripeClient()` - Returns the Stripe client instance or null
- `requireStripeClient()` - Returns the client or throws an error
- `hasValidStripeCredentials()` - Checks if credentials are configured

**Design Pattern:** Lazy initialization singleton

```
┌─────────────────────────────────────────────────────────────┐
│                    STRIPE CLIENT FLOW                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Application Start                                         │
│         │                                                   │
│         ▼                                                   │
│   ┌─────────────┐                                          │
│   │ getInstance │◀──── First call creates instance         │
│   └──────┬──────┘                                          │
│          │                                                  │
│          ▼                                                  │
│   ┌─────────────┐    ┌─────────────┐                       │
│   │ Check ENV   │───▶│ Return null │ if missing            │
│   │ variables   │    │ (disabled)  │                       │
│   └──────┬──────┘    └─────────────┘                       │
│          │ valid                                            │
│          ▼                                                  │
│   ┌─────────────┐                                          │
│   │ Create &    │                                          │
│   │ cache client│                                          │
│   └──────┬──────┘                                          │
│          │                                                  │
│          ▼                                                  │
│   ┌─────────────┐                                          │
│   │ Return      │◀──── Subsequent calls return cached      │
│   │ Stripe SDK  │      instance                             │
│   └─────────────┘                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2. Webhook Handlers

**Location:** `lib/billing/webhooks/`

**Purpose:** Process real-time notifications from Stripe about payment events.

**Key Handlers:**

| File | Handler Functions | Events Handled |
|------|-------------------|----------------|
| `invoices.ts` | `handleInvoicePaymentSucceeded`<br>`handleInvoicePaymentFailed`<br>`handleInvoiceFinalized` | `invoice.payment_succeeded`<br>`invoice.payment_failed`<br>`invoice.finalized` |
| `disputes.ts` | `handleChargeDispute`<br>`handleDisputeClosed` | `charge.dispute.created`<br>`charge.dispute.closed` |
| `enterprise.ts` | `handleManualEnterpriseSubscription` | `customer.subscription.created` |

### 3. Credit Purchase (`credits/purchase.ts`)

**Purpose:** Handle one-time credit purchases.

**Key Function:** `purchaseCredits()`

**Flow:**
1. Validate user and payment method
2. Create invoice in Stripe
3. Pay invoice immediately
4. Update user's credit balance
5. Set usage limits based on credits

### 4. Threshold Billing (`threshold-billing.ts`)

**Purpose:** Bill users for usage overages when they reach a minimum threshold.

**Key Functions:**
- `checkAndBillOverageThreshold()` - For individual users
- `checkAndBillOrganizationOverageThreshold()` - For teams

**How it works:**
```
┌─────────────────────────────────────────────────────────────┐
│                 THRESHOLD BILLING LOGIC                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   1. Calculate current overage                              │
│      (usage - plan limit)                                   │
│                                                             │
│   2. Subtract already-billed overage                        │
│      (to avoid double-billing)                              │
│                                                             │
│   3. Compare to threshold ($10 default)                     │
│      │                                                      │
│      ├── Below threshold → Wait, accumulate                 │
│      │                                                      │
│      └── Above threshold → Proceed to bill                  │
│                                                             │
│   4. Apply available credits                                │
│      (reduce amount to bill)                                │
│                                                             │
│   5. Create and finalize invoice in Stripe                  │
│                                                             │
│   6. Auto-pay using saved payment method                    │
│                                                             │
│   7. Update billing records                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Core Tables

#### `subscription` Table

Stores subscription information linked to users or organizations.

| Column | Type | Description |
|--------|------|-------------|
| `id` | text | Primary key |
| `plan` | text | Plan name (free, pro, team, enterprise) |
| `referenceId` | text | User ID or Organization ID |
| `stripeCustomerId` | text | Stripe customer ID |
| `stripeSubscriptionId` | text | Stripe subscription ID |
| `status` | text | Subscription status |
| `periodStart` | timestamp | Billing period start |
| `periodEnd` | timestamp | Billing period end |
| `cancelAtPeriodEnd` | boolean | Scheduled for cancellation |
| `seats` | integer | Number of seats (team plans) |
| `metadata` | json | Additional metadata |

#### `user` Table

Includes Stripe customer ID for billing.

| Column | Type | Description |
|--------|------|-------------|
| `...` | ... | Other user fields |
| `stripeCustomerId` | text | Stripe customer ID |

---

## Auth Integration

The Stripe plugin is integrated into the authentication system via `@better-auth/stripe`.

**Configuration in `auth.ts`:**

```typescript
stripe({
  stripeClient,
  stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
  createCustomerOnSignUp: true,
  
  // Customer creation callback
  onCustomerCreate: async ({ stripeCustomer, user }) => {
    // Log customer creation
  },
  
  // Subscription configuration
  subscription: {
    enabled: true,
    plans: getPlans(),
    
    // Callbacks for subscription events
    onSubscriptionComplete: async ({ subscription }) => { ... },
    onSubscriptionUpdate: async ({ event, subscription }) => { ... },
    onSubscriptionDeleted: async ({ subscription }) => { ... },
  },
  
  // Additional webhook events
  onEvent: async (event) => {
    // Handle other Stripe events
  },
})
```

---

## Stripe Tools

**Location:** `apps/sim/tools/stripe/`

The application includes 40+ tool files that wrap Stripe API operations for use in workflows.

**Categories:**
- **Customer operations**: create, retrieve, update, delete
- **Subscription operations**: create, retrieve, update, cancel
- **Invoice operations**: create, retrieve, pay, void
- **Payment operations**: create payment intent, capture, refund
- **Product/Price operations**: CRUD operations
- **Event operations**: list and retrieve events

---

## Webhook Processing Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      WEBHOOK PROCESSING FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────┘

   Stripe                  API Route               Handler              Database
     │                         │                      │                    │
     │  1. POST webhook        │                      │                    │
     │────────────────────────▶│                      │                    │
     │                         │                      │                    │
     │                         │  2. Verify signature │                    │
     │                         │─────────────────────▶│                    │
     │                         │                      │                    │
     │                         │  3. Parse event      │                    │
     │                         │─────────────────────▶│                    │
     │                         │                      │                    │
     │                         │                      │  4. Route to       │
     │                         │                      │     handler        │
     │                         │                      │                    │
     │                         │                      │  5. Process event  │
     │                         │                      │───────────────────▶│
     │                         │                      │                    │
     │                         │                      │  6. Update records │
     │                         │                      │◀───────────────────│
     │                         │                      │                    │
     │                         │  7. Success response │                    │
     │                         │◀─────────────────────│                    │
     │                         │                      │                    │
     │  8. Acknowledge (200)   │                      │                    │
     │◀────────────────────────│                      │                    │
     │                         │                      │                    │
     ▼                         ▼                      ▼                    ▼
```

---

## Error Handling

### Graceful Degradation

The system is designed to handle Stripe unavailability:

1. **Missing credentials**: System runs without billing features
2. **API failures**: Logged and surfaced to users appropriately
3. **Webhook failures**: Automatic retries by Stripe

### Error Categories

| Category | Handling |
|----------|----------|
| Configuration errors | Logged at startup, features disabled |
| API errors | Returned to user, logged for debugging |
| Webhook errors | Logged, Stripe retries automatically |
| Payment errors | User notified, retry options provided |

---

## Security Considerations

1. **API Keys**: Never exposed to client-side code
2. **Webhook Signatures**: Verified on every request
3. **Customer Data**: Minimal data stored, PII handled by Stripe
4. **PCI Compliance**: Handled by Stripe (no card data touches our servers)

---

## Monitoring & Logging

All Stripe operations log:
- Operation type and parameters
- Success/failure status
- Timing information
- Error details when applicable

Log format: `[ComponentName] Operation description` with contextual data.
