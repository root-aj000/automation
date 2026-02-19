# Stripe Integration File Inventory

This document provides a comprehensive inventory of all Stripe-related files in the Sim application.

---

## Summary Statistics

| Category | File Count |
|----------|------------|
| Core Billing Files | 10 |
| Stripe Tools | 44 |
| Webhook Handlers | 4 |
| Trigger Files | 2 |
| Block Files | 1 |
| Auth Integration | 2 |
| API Routes | 4 |
| **Total** | **67+** |

---

## Core Billing Files

### [`apps/sim/lib/billing/stripe-client.ts`](apps/sim/lib/billing/stripe-client.ts)

**Purpose:** Stripe client singleton initialization and management

**Key Functions:**
- `getStripeClient()` - Returns the Stripe client instance or null
- `requireStripeClient()` - Returns the client or throws an error
- `hasValidStripeCredentials()` - Checks if credentials are configured

**Functionality:**
- Initializes the Stripe SDK with API credentials
- Implements lazy initialization pattern
- Handles graceful degradation when Stripe is not configured

---

### [`apps/sim/lib/billing/threshold-billing.ts`](apps/sim/lib/billing/threshold-billing.ts)

**Purpose:** Usage-based billing for overage charges

**Key Functions:**
- `checkAndBillOverageThreshold(userId)` - Bills individual users for overage
- `checkAndBillOrganizationOverageThreshold(orgId)` - Bills organizations for overage
- `createAndFinalizeOverageInvoice()` - Creates and pays overage invoices

**Functionality:**
- Calculates overage (usage beyond plan limits)
- Applies credits to reduce billing amount
- Creates invoices when overage reaches threshold
- Handles both individual and team billing

---

### [`apps/sim/lib/billing/credits/purchase.ts`](apps/sim/lib/billing/credits/purchase.ts)

**Purpose:** Credit purchase functionality

**Key Functions:**
- `purchaseCredits(params)` - Handles credit purchases
- `setUsageLimitForCredits()` - Updates usage limits based on credits

**Functionality:**
- Creates invoices for credit purchases
- Immediately pays using saved payment methods
- Updates user credit balance
- Sets usage limits based on purchased credits

---

### [`apps/sim/lib/billing/core/billing.ts`](apps/sim/lib/billing/core/billing.ts)

**Purpose:** Core billing calculations and utilities

**Key Functions:**
- `calculateSubscriptionOverage()` - Calculates usage overage
- `getPlanPricing()` - Returns pricing for plans
- `getDefaultUsageLimit()` - Returns default limits for plans

**Functionality:**
- Billing calculations for all plan types
- Usage limit determination
- Overage cost calculations

---

### [`apps/sim/lib/billing/core/subscription.ts`](apps/sim/lib/billing/core/subscription.ts)

**Purpose:** Subscription management utilities

**Key Functions:**
- `getHighestPrioritySubscription()` - Gets user's active subscription
- Subscription priority logic (Enterprise > Team > Pro > Free)

---

### [`apps/sim/lib/billing/organizations/membership.ts`](apps/sim/lib/billing/organizations/membership.ts)

**Purpose:** Team subscription and membership management

**Key Functions:**
- `addUserToOrganization()` - Adds members to teams
- `removeUserFromOrganization()` - Removes members from teams
- `restoreUserProSubscription()` - Restores Pro subscription when leaving team

**Functionality:**
- Seat management for team plans
- Pro subscription handling when joining/leaving teams
- Stripe subscription updates for seat changes

---

### [`apps/sim/lib/billing/validation/seat-management.ts`](apps/sim/lib/billing/validation/seat-management.ts)

**Purpose:** Seat validation and synchronization

**Key Functions:**
- `validateSeatAvailability()` - Checks if seats are available
- `syncSeatsFromStripeQuantity()` - Syncs seat count from Stripe

---

### [`apps/sim/lib/billing/constants.ts`](apps/sim/lib/billing/constants.ts)

**Purpose:** Billing constants and defaults

**Contains:**
- `DEFAULT_OVERAGE_THRESHOLD` - Minimum overage before billing
- Other billing-related constants

---

### [`apps/sim/lib/billing/types/index.ts`](apps/sim/lib/billing/types/index.ts)

**Purpose:** TypeScript type definitions for billing

**Contains:**
- Subscription type definitions
- Billing-related interfaces

---

### [`apps/sim/lib/billing/client/types.ts`](apps/sim/lib/billing/client/types.ts)

**Purpose:** Client-side billing type definitions

---

## Webhook Handler Files

### [`apps/sim/lib/billing/webhooks/invoices.ts`](apps/sim/lib/billing/webhooks/invoices.ts) (856 lines)

**Purpose:** Invoice webhook event handlers

**Key Functions:**
- `handleInvoicePaymentSucceeded(event)` - Processes successful payments
- `handleInvoicePaymentFailed(event)` - Handles failed payments
- `handleInvoiceFinalized(event)` - Processes finalized invoices

**Functionality:**
- Credit purchase success handling
- Payment failure email notifications
- Overage invoice creation
- Billing portal URL generation

---

### [`apps/sim/lib/billing/webhooks/disputes.ts`](apps/sim/lib/billing/webhooks/disputes.ts)

**Purpose:** Dispute webhook event handlers

**Key Functions:**
- `handleChargeDispute(event)` - Processes new disputes
- `handleDisputeClosed(event)` - Handles dispute resolution

**Functionality:**
- Retrieves customer information from disputes
- Identifies affected users/subscriptions
- Logs dispute events for tracking

---

### [`apps/sim/lib/billing/webhooks/enterprise.ts`](apps/sim/lib/billing/webhooks/enterprise.ts)

**Purpose:** Enterprise subscription handling

**Key Functions:**
- `handleManualEnterpriseSubscription(event)` - Creates enterprise subscriptions

**Functionality:**
- Creates enterprise subscription records from Stripe events
- Sends welcome emails for new enterprise customers
- Handles enterprise-specific metadata

---

### [`apps/sim/lib/billing/webhooks/subscription.ts`](apps/sim/lib/billing/webhooks/subscription.ts)

**Purpose:** Subscription lifecycle handlers

**Key Functions:**
- `handleSubscriptionCreated(subscription)` - New subscription setup
- `handleSubscriptionDeleted(subscription)` - Subscription cancellation handling

**Functionality:**
- Final overage billing on cancellation
- Subscription status updates
- Pro subscription restoration

---

## Auth Integration Files

### [`apps/sim/lib/auth/auth.ts`](apps/sim/lib/auth/auth.ts)

**Purpose:** Main authentication configuration with Stripe plugin

**Stripe Integration:**
- Stripe plugin configuration (lines 2018-2216)
- `createCustomerOnSignUp: true` - Auto-creates Stripe customers
- Subscription callbacks: `onSubscriptionComplete`, `onSubscriptionUpdate`, `onSubscriptionDeleted`
- Webhook event routing via `onEvent`

**Key Configurations:**
- Checkout session parameters for different plans
- Team plan seat configuration
- Webhook event handling switch statement

---

### [`apps/sim/lib/auth/auth-client.ts`](apps/sim/lib/auth/auth-client.ts)

**Purpose:** Client-side authentication with Stripe

**Key Imports:**
- `stripeClient` from `@better-auth/stripe/client`

**Functionality:**
- Enables subscription management on the client side
- Provides access to billing portal functionality

---

## Stripe Tools Directory

**Location:** `apps/sim/tools/stripe/`

These files wrap Stripe API operations for use in workflows. Each file exports a tool configuration.

### Payment Intent Tools

| File | Purpose |
|------|---------|
| [`create_payment_intent.ts`](apps/sim/tools/stripe/create_payment_intent.ts) | Create payment intents |
| [`retrieve_payment_intent.ts`](apps/sim/tools/stripe/retrieve_payment_intent.ts) | Retrieve payment intents |
| [`update_payment_intent.ts`](apps/sim/tools/stripe/update_payment_intent.ts) | Update payment intents |
| [`confirm_payment_intent.ts`](apps/sim/tools/stripe/confirm_payment_intent.ts) | Confirm payment intents |
| [`capture_payment_intent.ts`](apps/sim/tools/stripe/capture_payment_intent.ts) | Capture payment intents |
| [`cancel_payment_intent.ts`](apps/sim/tools/stripe/cancel_payment_intent.ts) | Cancel payment intents |
| [`list_payment_intents.ts`](apps/sim/tools/stripe/list_payment_intents.ts) | List payment intents |
| [`search_payment_intents.ts`](apps/sim/tools/stripe/search_payment_intents.ts) | Search payment intents |

### Customer Tools

| File | Purpose |
|------|---------|
| [`create_customer.ts`](apps/sim/tools/stripe/create_customer.ts) | Create customers |
| [`retrieve_customer.ts`](apps/sim/tools/stripe/retrieve_customer.ts) | Retrieve customers |
| [`update_customer.ts`](apps/sim/tools/stripe/update_customer.ts) | Update customers |
| [`delete_customer.ts`](apps/sim/tools/stripe/delete_customer.ts) | Delete customers |
| [`list_customers.ts`](apps/sim/tools/stripe/list_customers.ts) | List customers |
| [`search_customers.ts`](apps/sim/tools/stripe/search_customers.ts) | Search customers |

### Subscription Tools

| File | Purpose |
|------|---------|
| [`create_subscription.ts`](apps/sim/tools/stripe/create_subscription.ts) | Create subscriptions |
| [`retrieve_subscription.ts`](apps/sim/tools/stripe/retrieve_subscription.ts) | Retrieve subscriptions |
| [`update_subscription.ts`](apps/sim/tools/stripe/update_subscription.ts) | Update subscriptions |
| [`cancel_subscription.ts`](apps/sim/tools/stripe/cancel_subscription.ts) | Cancel subscriptions |
| [`resume_subscription.ts`](apps/sim/tools/stripe/resume_subscription.ts) | Resume subscriptions |
| [`list_subscriptions.ts`](apps/sim/tools/stripe/list_subscriptions.ts) | List subscriptions |
| [`search_subscriptions.ts`](apps/sim/tools/stripe/search_subscriptions.ts) | Search subscriptions |

### Invoice Tools

| File | Purpose |
|------|---------|
| [`create_invoice.ts`](apps/sim/tools/stripe/create_invoice.ts) | Create invoices |
| [`retrieve_invoice.ts`](apps/sim/tools/stripe/retrieve_invoice.ts) | Retrieve invoices |
| [`update_invoice.ts`](apps/sim/tools/stripe/update_invoice.ts) | Update invoices |
| [`delete_invoice.ts`](apps/sim/tools/stripe/delete_invoice.ts) | Delete invoices |
| [`finalize_invoice.ts`](apps/sim/tools/stripe/finalize_invoice.ts) | Finalize invoices |
| [`pay_invoice.ts`](apps/sim/tools/stripe/pay_invoice.ts) | Pay invoices |
| [`void_invoice.ts`](apps/sim/tools/stripe/void_invoice.ts) | Void invoices |
| [`send_invoice.ts`](apps/sim/tools/stripe/send_invoice.ts) | Send invoices |
| [`list_invoices.ts`](apps/sim/tools/stripe/list_invoices.ts) | List invoices |
| [`search_invoices.ts`](apps/sim/tools/stripe/search_invoices.ts) | Search invoices |

### Charge Tools

| File | Purpose |
|------|---------|
| [`create_charge.ts`](apps/sim/tools/stripe/create_charge.ts) | Create charges |
| [`retrieve_charge.ts`](apps/sim/tools/stripe/retrieve_charge.ts) | Retrieve charges |
| [`update_charge.ts`](apps/sim/tools/stripe/update_charge.ts) | Update charges |
| [`capture_charge.ts`](apps/sim/tools/stripe/capture_charge.ts) | Capture charges |
| [`list_charges.ts`](apps/sim/tools/stripe/list_charges.ts) | List charges |
| [`search_charges.ts`](apps/sim/tools/stripe/search_charges.ts) | Search charges |

### Product & Price Tools

| File | Purpose |
|------|---------|
| [`create_product.ts`](apps/sim/tools/stripe/create_product.ts) | Create products |
| [`retrieve_product.ts`](apps/sim/tools/stripe/retrieve_product.ts) | Retrieve products |
| [`update_product.ts`](apps/sim/tools/stripe/update_product.ts) | Update products |
| [`delete_product.ts`](apps/sim/tools/stripe/delete_product.ts) | Delete products |
| [`list_products.ts`](apps/sim/tools/stripe/list_products.ts) | List products |
| [`search_products.ts`](apps/sim/tools/stripe/search_products.ts) | Search products |
| [`create_price.ts`](apps/sim/tools/stripe/create_price.ts) | Create prices |
| [`retrieve_price.ts`](apps/sim/tools/stripe/retrieve_price.ts) | Retrieve prices |
| [`update_price.ts`](apps/sim/tools/stripe/update_price.ts) | Update prices |
| [`list_prices.ts`](apps/sim/tools/stripe/list_prices.ts) | List prices |
| [`search_prices.ts`](apps/sim/tools/stripe/search_prices.ts) | Search prices |

### Event Tools

| File | Purpose |
|------|---------|
| [`retrieve_event.ts`](apps/sim/tools/stripe/retrieve_event.ts) | Retrieve events |
| [`list_events.ts`](apps/sim/tools/stripe/list_events.ts) | List events |

### Supporting Files

| File | Purpose |
|------|---------|
| [`index.ts`](apps/sim/tools/stripe/index.ts) | Exports all Stripe tools |
| [`types.ts`](apps/sim/tools/stripe/types.ts) | TypeScript types for tools |

---

## Trigger Files

### [`apps/sim/triggers/stripe/webhook.ts`](apps/sim/triggers/stripe/webhook.ts)

**Purpose:** Stripe webhook trigger configuration

**Functionality:**
- Defines the Stripe webhook trigger for workflows
- Configures webhook endpoint
- Maps webhook events to workflow triggers

### [`apps/sim/triggers/stripe/index.ts`](apps/sim/triggers/stripe/index.ts)

**Purpose:** Exports Stripe triggers

---

## Block Files

### [`apps/sim/blocks/blocks/stripe.ts`](apps/sim/blocks/blocks/stripe.ts)

**Purpose:** Stripe block for workflow builder

**Functionality:**
- Provides a visual block for Stripe operations in the workflow builder
- Exposes all Stripe tools as selectable operations
- Handles authentication and parameter input

---

## API Routes

### [`apps/sim/app/api/webhooks/trigger/[path]/route.ts`](apps/sim/app/api/webhooks/trigger/[path]/route.ts)

**Purpose:** Webhook endpoint for Stripe events

**Stripe Integration:**
- Receives Stripe webhooks at dynamic paths
- Routes to appropriate webhook handlers

### [`apps/sim/app/api/v1/admin/subscriptions/[id]/route.ts`](apps/sim/app/api/v1/admin/subscriptions/[id]/route.ts)

**Purpose:** Admin API for subscription management

**Stripe Operations:**
- Cancel subscriptions via Stripe API
- Schedule cancellations at period end

### [`apps/sim/app/api/v1/admin/organizations/[id]/members/route.ts`](apps/sim/app/api/v1/admin/organizations/[id]/members/route.ts)

**Purpose:** Admin API for organization member management

**Stripe Operations:**
- Sync Pro subscription cancellations with Stripe
- Handle billing actions when adding/removing members

### [`apps/sim/app/api/v1/admin/users/[id]/billing/route.ts`](apps/sim/app/api/v1/admin/users/[id]/billing/route.ts)

**Purpose:** Admin API for user billing information

**Returns:**
- User's Stripe customer ID
- Billing-related user data

---

## Registry Files

### [`apps/sim/tools/registry.ts`](apps/sim/tools/registry.ts)

**Purpose:** Central registry for all tools

**Stripe Integration:**
- Imports all Stripe tools (lines 1159-1210)
- Registers them in the tool registry (lines 2373-2422)

### [`apps/sim/triggers/registry.ts`](apps/sim/triggers/registry.ts)

**Purpose:** Central registry for all triggers

**Stripe Integration:**
- Imports Stripe webhook trigger
- Registers it in the trigger registry

### [`apps/sim/blocks/registry.ts`](apps/sim/blocks/registry.ts)

**Purpose:** Central registry for all blocks

**Stripe Integration:**
- Imports StripeBlock
- Registers it in the block registry

---

## Database Schema

### [`packages/db/schema.ts`](packages/db/schema.ts)

**Purpose:** Database schema definitions

**Stripe-Related Fields:**

**User Table:**
- `stripeCustomerId` - Stripe customer ID for individual users

**Subscription Table:**
- `stripeCustomerId` - Stripe customer ID
- `stripeSubscriptionId` - Stripe subscription ID
- `status` - Subscription status
- `periodStart` / `periodEnd` - Billing period dates
- `cancelAtPeriodEnd` - Cancellation scheduled
- `seats` - Number of seats (for team plans)

---

## Package Dependencies

### [`apps/sim/package.json`](apps/sim/package.json)

**Stripe-Related Dependencies:**
```json
{
  "@better-auth/stripe": "1.3.12",
  "stripe": "18.5.0"
}
```

---

## File Dependencies Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FILE DEPENDENCY HIERARCHY                            │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌──────────────┐
                              │   auth.ts    │
                              │ (Main Auth)  │
                              └──────┬───────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
                    ▼                ▼                ▼
           ┌────────────────┐ ┌──────────────┐ ┌──────────────┐
           │ stripe-client  │ │   webhooks/  │ │ subscription │
           │    .ts         │ │  (handlers)  │ │    .ts       │
           └────────┬───────┘ └──────────────┘ └──────────────┘
                    │
                    │
    ┌───────────────┼───────────────┬───────────────┐
    │               │               │               │
    ▼               ▼               ▼               ▼
┌─────────┐  ┌───────────┐  ┌───────────┐  ┌───────────────┐
│ credits │  │ threshold │  │   core/   │  │ organizations │
│ /purchase│  │ -billing  │  │  billing  │  │  /membership  │
└─────────┘  └───────────┘  └───────────┘  └───────────────┘
    │               │               │               │
    └───────────────┴───────────────┴───────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   Database   │
                    │  (packages/db)│
                    └──────────────┘
```

---

## Notes for Migration

When migrating from Stripe to another payment provider, focus on these files in order:

1. **Core Client** - `stripe-client.ts` → Create new provider client
2. **Auth Integration** - `auth.ts` → Replace Stripe plugin
3. **Webhook Handlers** - `webhooks/*.ts` → Implement new provider's webhook format
4. **Billing Logic** - `threshold-billing.ts`, `credits/purchase.ts` → Adapt to new API
5. **Database Schema** - Add new provider's IDs, consider keeping Stripe IDs for transition
6. **Tools** - `tools/stripe/*` → Create new provider tools or remove
7. **API Routes** - Update any Stripe-specific API calls
