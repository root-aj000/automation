# Stripe Payment Gateway Documentation

## Overview

This documentation provides a comprehensive guide to the Stripe payment gateway integration within the Sim application. It is designed for non-technical readers who want to understand how payments work in the system.

## Important: Two Stripe Integrations

The Sim application has **TWO separate Stripe integrations**:

| Integration | Purpose | Files |
|-------------|---------|-------|
| **Main Billing** | Sim's internal subscription management | `lib/billing/` |
| **Automation Tools** | User workflows with Stripe operations | `tools/stripe/`, `blocks/blocks/stripe.ts` |

**For migration purposes, focus on `lib/billing/` (Main Billing).** The automation tools are optional and can be kept or replaced independently.

## Table of Contents

1. [What is Stripe?](#what-is-stripe)
2. [How Our Payment System Works](#how-our-payment-system-works)
3. [Payment Plans](#payment-plans)
4. [Transaction Flow](#transaction-flow)
5. [Key Features](#key-features)
6. [Documentation Files](#documentation-files)
7. [Migration Guide](#migration-guide)

---

## What is Stripe?

Stripe is a third-party payment processing service that handles online transactions securely. Think of it as a digital cashier that processes credit card payments, manages subscriptions, and handles refunds - all while keeping sensitive financial data secure.

**Key Benefits:**
- 🔒 **Security**: Stripe handles all sensitive payment data, so we never store credit card numbers
- 💳 **Multiple Payment Methods**: Supports credit cards, debit cards, and other payment methods
- 🔄 **Recurring Billing**: Automatically charges customers on a schedule for subscriptions
- 🌍 **Global Support**: Works with currencies and payment methods from around the world

---

## How Our Payment System Works

### The Big Picture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Customer  │────▶│     Sim     │────▶│   Stripe    │
│  (You)      │     │ Application │     │   (Bank)    │
└─────────────┘     └─────────────┘     └─────────────┘
                           │                   │
                           │                   │
                           ▼                   ▼
                    ┌─────────────────────────────┐
                    │      Database Records        │
                    │  (Transaction History)       │
                    └─────────────────────────────┘
```

When you make a payment:

1. **You** click "Subscribe" or "Buy Credits" in the Sim application
2. **Sim** sends a secure request to Stripe to process the payment
3. **Stripe** communicates with your bank to authorize and complete the transaction
4. **Stripe** sends a confirmation back to Sim
5. **Sim** updates your account with the new subscription or credits

---

## Payment Plans

Our system supports several subscription tiers:

| Plan | Best For | Key Features |
|------|----------|--------------|
| **Free** | New users | Basic features, limited usage |
| **Pro** | Individual professionals | More usage, advanced features |
| **Team** | Small teams | Collaboration features, multiple seats |
| **Enterprise** | Large organizations | Custom pricing, dedicated support |

### What are "Seats"?

In a Team plan, a "seat" represents one team member. When you purchase a Team subscription, you specify how many seats (team members) you need. Each seat gives one person access to the team's shared resources.

---

## Transaction Flow

For detailed visual representations of how different payment scenarios work, see:

- [Payment Lifecycle Flowcharts](./flowcharts/payment-lifecycle.md) - Visual diagrams of payment processes
- [Subscription Management](./flowcharts/subscription-management.md) - How subscriptions are created, updated, and cancelled

---

## Key Features

### 1. Subscription Management
- Automatic monthly/yearly billing
- Plan upgrades and downgrades
- Grace period for failed payments

### 2. Credit Purchases
- Buy credits for pay-as-you-go usage
- Credits apply to overage charges automatically

### 3. Usage-Based Billing (Overage)
- If you exceed your plan limits, you're billed for the extra usage
- Threshold billing ensures you're charged when overage reaches a minimum amount

### 4. Team & Enterprise Features
- Add/remove team members (seats)
- Centralized billing for organizations
- Usage tracking across team members

### 5. Webhook Processing
- Real-time updates from Stripe about payment status
- Automatic handling of payment successes and failures

---

## Documentation Files

### For Everyone
- [Payment Lifecycle Flowcharts](./flowcharts/payment-lifecycle.md) - Visual guides to understand payment processes
- [Glossary of Terms](./glossary.md) - Common payment and billing terms explained

### For Administrators
- [Configuration Guide](./configuration.md) - How Stripe is set up in the system
- [Troubleshooting Guide](./troubleshooting.md) - Common issues and solutions

### Technical Reference
- [Code Architecture Overview](./technical/code-architecture.md) - High-level technical documentation
- [Database Schema](./technical/database-schema.md) - How payment data is stored
- [File Inventory](./technical/file-inventory.md) - Complete list of all Stripe-related files
- [Stripe API Reference](./technical/stripe-api-reference.md) - **Complete list of all Stripe functions, classes, and APIs used**

---

## Migration Guide

Planning to replace Stripe with another payment gateway? See:

- **[Migration Guide](./migration-guide.md)** - Comprehensive guide for migrating to Razorpay, Paytm, or PhonePe
  - Payment gateway comparison
  - Step-by-step migration plan
  - Code examples for Razorpay integration
  - Timeline and testing checklist

### Quick Migration Summary

| Gateway | Ease of Migration | Features Match | Recommendation |
|---------|-------------------|----------------|----------------|
| **Razorpay** | ⭐⭐⭐⭐⭐ Best | ⭐⭐⭐⭐ Good | **Recommended** for Indian market |
| **Paytm** | ⭐⭐⭐ Moderate | ⭐⭐ Limited | If Paytm wallet integration needed |
| **PhonePe** | ⭐⭐⭐ Moderate | ⭐⭐ Limited | If UPI focus needed |

**Estimated migration time: 3-5 weeks**

---

## Need Help?

If you have questions about payments or billing:
- Check our [Troubleshooting Guide](./troubleshooting.md)
- Contact support through the application
- Review your billing history in the account settings
