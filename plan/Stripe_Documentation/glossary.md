# Glossary of Payment & Billing Terms

This glossary explains common terms used in the payment and billing system in simple, non-technical language.

---

## A

### API (Application Programming Interface)
A way for different software systems to talk to each other. In our case, it's how Sim communicates with Stripe to process payments.

### Authentication
The process of verifying who you are. When you log in to Sim, you're authenticating yourself.

### Authorization
The process of checking if you have permission to do something. For example, checking if your subscription allows access to a certain feature.

---

## B

### Billing Cycle
The period between billing dates. For monthly subscriptions, the billing cycle is one month. For yearly subscriptions, it's one year.

### Billing Portal
A secure page hosted by Stripe where customers can:
- View their payment history
- Update their payment method
- Download invoices
- Cancel their subscription

---

## C

### Charge
The actual transaction where money is taken from your account. A charge can succeed, fail, or be disputed.

### Checkout Session
A temporary, secure page hosted by Stripe where you enter your payment details. This page is designed to protect your sensitive information.

### Credit Balance
An amount of money in your account that can be used to pay for services. Credits can be purchased in advance or applied as refunds.

### Customer (Stripe Customer)
A record in Stripe that represents you as a paying customer. It stores your email, payment methods, and billing information (but NOT your full credit card number).

---

## D

### Dispute (Chargeback)
When a customer contacts their bank to reverse a charge they don't recognize or believe is fraudulent. This triggers an investigation process.

### Downgrade
Changing from a higher-tier plan to a lower-tier plan. For example, moving from Pro to Free.

---

## E

### Enterprise Plan
A custom pricing plan for large organizations. It typically includes dedicated support, custom features, and volume-based pricing.

---

## F

### Free Plan
The basic tier of service that costs nothing and includes limited features.

---

## I

### Invoice
A document that shows what you're being charged for. In Stripe, invoices can be:
- **Draft**: Being prepared
- **Open**: Ready to be paid
- **Paid**: Successfully paid
- **Void**: Cancelled
- **Uncollectible**: Cannot be collected

### Invoice Item
A single line item on an invoice. For example, "Pro Plan - Monthly" or "5,000 Credits".

---

## M

### Member
A person who belongs to a team/organization. Each member uses one "seat" in the team.

### Metadata
Extra information attached to records. For example, a subscription might have metadata like "promo_code: SUMMER2024".

---

## O

### Overage
Extra usage beyond what your plan includes. For example, if your plan includes 1,000 API calls and you make 1,200, the extra 200 is "overage."

### Organization
A group entity that can have multiple members (teams). Organizations are created when someone subscribes to a Team plan.

---

## P

### Payment Method
How you pay - typically a credit card, debit card, or bank account. Stripe stores references to your payment methods securely.

### Payment Intent
A Stripe object that represents a single payment attempt. It tracks the payment from initiation to completion or failure.

### Period (Billing Period)
The time range covered by a subscription. For example, January 1-31 for a monthly subscription.

### Plan
A subscription tier with specific features and limits. Our plans include Free, Pro, Team, and Enterprise.

### Proration
Adjusting charges based on partial usage. If you add a team member halfway through the month, you're only charged for half a month.

---

## R

### Recurring Payment
A payment that happens automatically on a schedule, like a monthly subscription.

### Reference ID
A unique identifier used to link a subscription to either a user (for individual plans) or an organization (for team plans).

### Refund
Money returned to a customer. Refunds can be full or partial.

---

## S

### Seat
A slot for one team member in a Team subscription. If you have 5 seats, you can have up to 5 team members.

### Subscription
A recurring payment arrangement. Subscriptions automatically renew at the end of each billing period unless cancelled.

### Stripe
The third-party payment processor we use. Think of Stripe as a digital cashier that handles all payment transactions securely.

---

## T

### Threshold Billing
A billing method where you're only charged when your overage reaches a minimum amount. This prevents many small charges.

### Trial
A free period to try a paid plan before being charged. Not all plans offer trials.

---

## U

### Upgrade
Changing from a lower-tier plan to a higher-tier plan. For example, moving from Free to Pro.

### Usage Limit
The maximum amount of a resource (API calls, storage, etc.) included in your plan. Exceeding this may result in overage charges.

---

## W

### Webhook
An automatic message sent from Stripe to Sim when something happens. For example, when a payment succeeds, Stripe sends a webhook to notify Sim.

---

## Common Acronyms

| Acronym | Full Term | Meaning |
|---------|-----------|---------|
| API | Application Programming Interface | How software systems communicate |
| CVV | Card Verification Value | The 3-4 digit security code on a card |
| PM | Payment Method | How you pay (card, bank account) |
| SCA | Strong Customer Authentication | European security requirements for online payments |
| SSO | Single Sign-On | Logging in with accounts like Google or Microsoft |
| 3DS | 3D Secure | Extra verification step for online card payments |

---

## Charge Statuses Explained

When you make a payment, it goes through several states:

```
┌─────────────┐
│   Pending   │  ← Payment is being processed
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Succeeded  │  ← Payment completed successfully
└─────────────┘

       OR
       
┌─────────────┐
│   Failed    │  ← Payment could not be completed
└─────────────┘

       OR (after success)
       
┌─────────────┐
│  Disputed   │  ← Customer challenged the charge
└─────────────┘
```

---

## Subscription Statuses Explained

| Status | What It Means |
|--------|---------------|
| **active** | Subscription is current and paid |
| **past_due** | Payment failed, retrying |
| **canceled** | Subscription has been terminated |
| **incomplete** | First payment failed |
| **trialing** | In free trial period |
| **unpaid** | Payment failed and no more retries |

---

## Need More Terms?

If you encounter a term not listed here:
1. Check Stripe's official documentation at https://stripe.com/docs
2. Contact our support team for clarification
