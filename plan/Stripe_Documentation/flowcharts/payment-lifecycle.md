# Payment Lifecycle Flowcharts

This document provides visual flowcharts explaining how different payment scenarios work in the Sim application.

---

## 1. New Subscription Purchase Flow

This is what happens when a user subscribes to a paid plan (Pro or Team).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        NEW SUBSCRIPTION PURCHASE                             │
└─────────────────────────────────────────────────────────────────────────────┘

     User                    Sim Application              Stripe              Database
       │                           │                         │                   │
       │  1. Click "Subscribe"     │                         │                   │
       │──────────────────────────▶│                         │                   │
       │                           │                         │                   │
       │                           │  2. Create checkout     │                   │
       │                           │     session             │                   │
       │                           │────────────────────────▶│                   │
       │                           │                         │                   │
       │                           │  3. Return checkout URL │                   │
       │                           │◀────────────────────────│                   │
       │                           │                         │                   │
       │  4. Redirect to Stripe    │                         │                   │
       │     checkout page         │                         │                   │
       │◀──────────────────────────│                         │                   │
       │                           │                         │                   │
       │  5. Enter payment details │                         │                   │
       │────────────────────────────────────────────────────▶│                   │
       │                           │                         │                   │
       │                           │                         │  6. Process       │
       │                           │                         │     payment       │
       │                           │                         │     with bank     │
       │                           │                         │                   │
       │  7. Payment confirmation  │                         │                   │
       │◀────────────────────────────────────────────────────│                   │
       │                           │                         │                   │
       │                           │  8. Webhook: Payment    │                   │
       │                           │     successful          │                   │
       │                           │◀────────────────────────│                   │
       │                           │                         │                   │
       │                           │  9. Create subscription │                   │
       │                           │     record              │                   │
       │                           │────────────────────────────────────────────▶│
       │                           │                         │                   │
       │                           │  10. Update user        │                   │
       │                           │      permissions        │                   │
       │                           │────────────────────────────────────────────▶│
       │                           │                         │                   │
       │  11. Welcome email sent   │                         │                   │
       │◀──────────────────────────│                         │                   │
       │                           │                         │                   │
       ▼                           ▼                         ▼                   ▼
```

### Simplified Explanation:

1. **You** click the "Subscribe" button for your chosen plan
2. **Sim** asks Stripe to create a secure checkout page
3. **Stripe** provides a unique checkout URL
4. **You** are redirected to Stripe's secure payment page
5. **You** enter your payment details (credit card, etc.)
6. **Stripe** securely processes the payment with your bank
7. **Stripe** confirms the payment was successful
8. **Stripe** automatically notifies Sim that payment succeeded
9. **Sim** creates a subscription record in the database
10. **Sim** updates your account with the new plan's features
11. **Sim** sends you a welcome email

---

## 2. Credit Purchase Flow

This is what happens when a user buys credits for pay-as-you-go usage.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CREDIT PURCHASE FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

     User                    Sim Application              Stripe              Database
       │                           │                         │                   │
       │  1. Select credit amount  │                         │                   │
       │──────────────────────────▶│                         │                   │
       │                           │                         │                   │
       │                           │  2. Get payment method  │                   │
       │                           │     from customer       │                   │
       │                           │────────────────────────▶│                   │
       │                           │                         │                   │
       │                           │  3. Return payment      │                   │
       │                           │     method details      │                   │
       │                           │◀────────────────────────│                   │
       │                           │                         │                   │
       │                           │  4. Create invoice      │                   │
       │                           │     for credits         │                   │
       │                           │────────────────────────▶│                   │
       │                           │                         │                   │
       │                           │  5. Pay invoice         │                   │
       │                           │     immediately         │                   │
       │                           │────────────────────────▶│                   │
       │                           │                         │                   │
       │                           │                         │  6. Charge        │
       │                           │                         │     card          │
       │                           │                         │                   │
       │                           │  7. Invoice paid        │                   │
       │                           │◀────────────────────────│                   │
       │                           │                         │                   │
       │                           │  8. Add credits to      │                   │
       │                           │     user account        │                   │
       │                           │────────────────────────────────────────────▶│
       │                           │                         │                   │
       │                           │  9. Set usage limit     │                   │
       │                           │     based on credits    │                   │
       │                           │────────────────────────────────────────────▶│
       │                           │                         │                   │
       │  10. Credits added        │                         │                   │
       │     confirmation          │                         │                   │
       │◀──────────────────────────│                         │                   │
       │                           │                         │                   │
       ▼                           ▼                         ▼                   ▼
```

### Simplified Explanation:

1. **You** choose how many credits to buy
2. **Sim** retrieves your saved payment method from Stripe
3. **Sim** creates an invoice for the credit purchase
4. **Sim** immediately pays the invoice using your saved card
5. **Stripe** charges your card
6. **Stripe** confirms the payment succeeded
7. **Sim** adds the credits to your account
8. **Sim** updates your usage limit based on the new credits
9. **You** receive a confirmation that credits were added

---

## 3. Overage Billing Flow (Threshold Billing)

This is what happens when you use more than your plan allows, and the system bills you for the extra usage.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       OVERAGE BILLING FLOW                                   │
└─────────────────────────────────────────────────────────────────────────────┘

                           ┌──────────────────┐
                           │  User's Usage    │
                           │  Exceeds Plan    │
                           └────────┬─────────┘
                                    │
                                    ▼
                     ┌──────────────────────────────┐
                     │  Calculate Overage Amount    │
                     │  (Usage - Plan Limit)        │
                     └────────┬─────────────────────┘
                              │
                              ▼
                     ┌──────────────────────────────┐
                     │  Check Against Threshold     │
                     │  (Minimum $ amount to bill)  │
                     └────────┬─────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
    ┌─────────────────┐             ┌─────────────────┐
    │  Below          │             │  Above          │
    │  Threshold      │             │  Threshold      │
    │  (Wait)         │             │  (Bill Now)     │
    └─────────────────┘             └────────┬────────┘
                                             │
                                             ▼
                              ┌──────────────────────────────┐
                              │  Check for Available Credits │
                              └────────┬─────────────────────┘
                                       │
                       ┌───────────────┴───────────────┐
                       │                               │
                       ▼                               ▼
             ┌─────────────────┐             ┌─────────────────┐
             │  Credits        │             │  No Credits     │
             │  Available      │             │  Available      │
             └────────┬────────┘             └────────┬────────┘
                      │                               │
                      ▼                               │
             ┌─────────────────┐                      │
             │  Apply Credits  │                      │
             │  to Reduce Bill │                      │
             └────────┬────────┘                      │
                      │                               │
                      └───────────────┬───────────────┘
                                      │
                                      ▼
                           ┌──────────────────────────────┐
                           │  Create Overage Invoice      │
                           │  in Stripe                   │
                           └────────┬─────────────────────┘
                                    │
                                    ▼
                           ┌──────────────────────────────┐
                           │  Auto-Pay Invoice            │
                           │  using saved payment method  │
                           └────────┬─────────────────────┘
                                    │
                                    ▼
                           ┌──────────────────────────────┐
                           │  Update Billing Records      │
                           │  in Database                 │
                           └──────────────────────────────┘
```

### Simplified Explanation:

1. The system monitors your usage throughout the billing period
2. When you exceed your plan's limits, it calculates the "overage" (extra usage)
3. The system checks if the overage has reached a minimum threshold (to avoid charging small amounts)
4. If below threshold: The system waits and accumulates more overage
5. If above threshold: The system prepares to bill you
6. Before billing, it checks if you have any credits to apply
7. Credits are used to reduce or eliminate the bill if available
8. An invoice is created in Stripe for any remaining amount
9. The invoice is automatically paid using your saved payment method
10. Your billing records are updated in the database

---

## 4. Subscription Renewal Flow

This is what happens when a subscription renews automatically (monthly or yearly).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      SUBSCRIPTION RENEWAL FLOW                               │
└─────────────────────────────────────────────────────────────────────────────┘

   Stripe (Automatic)           Sim Application              Database
         │                            │                         │
         │  1. Subscription period    │                         │
         │     ends, auto-charge      │                         │
         │───────────────────────────▶│                         │
         │                            │                         │
         │  2. Webhook: Invoice       │                         │
         │     payment_succeeded      │                         │
         │───────────────────────────▶│                         │
         │                            │                         │
         │                            │  3. Update subscription │
         │                            │     period dates        │
         │                            │────────────────────────▶│
         │                            │                         │
         │                            │  4. Reset usage         │
         │                            │     counters            │
         │                            │────────────────────────▶│
         │                            │                         │
         │                            │  5. Send renewal        │
         │                            │     confirmation email  │
         │                            │                         │
         ▼                            ▼                         ▼
```

---

## 5. Payment Failure Flow

This is what happens when a payment fails (insufficient funds, expired card, etc.).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PAYMENT FAILURE FLOW                                   │
└─────────────────────────────────────────────────────────────────────────────┘

   Stripe                       Sim Application              User
     │                               │                         │
     │  1. Payment attempt fails     │                         │
     │──────────────────────────────▶│                         │
     │                               │                         │
     │  2. Webhook: Invoice          │                         │
     │     payment_failed            │                         │
     │──────────────────────────────▶│                         │
     │                               │                         │
     │                               │  3. Get payment         │
     │                               │     method details      │
     │◀──────────────────────────────│                         │
     │                               │                         │
     │  4. Return card info          │                         │
     │     (last 4 digits, brand)    │                         │
     │──────────────────────────────▶│                         │
     │                               │                         │
     │                               │  5. Send payment        │
     │                               │     failure email       │
     │                               │────────────────────────▶│
     │                               │                         │
     │                               │  6. Include billing     │
     │                               │     portal link         │
     │                               │────────────────────────▶│
     │                               │                         │
     ▼                               ▼                         ▼
```

### Simplified Explanation:

1. Stripe attempts to charge your card but the payment fails
2. Stripe notifies Sim about the failed payment
3. Sim retrieves information about your payment method
4. Sim sends you an email about the failed payment including:
   - Which card was attempted (e.g., "Visa ending in 4242")
   - Why it may have failed
   - A link to update your payment method
5. You can click the billing portal link to update your payment details
6. Stripe will automatically retry the payment

---

## 6. Subscription Cancellation Flow

This is what happens when a subscription is cancelled.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SUBSCRIPTION CANCELLATION FLOW                            │
└─────────────────────────────────────────────────────────────────────────────┘

     User                    Sim Application              Stripe              Database
       │                           │                         │                   │
       │  1. Request cancellation  │                         │                   │
       │──────────────────────────▶│                         │                   │
       │                           │                         │                   │
       │                           │  2. Cancel at period    │                   │
       │                           │     end (not immediate)│                   │
       │                           │────────────────────────▶│                   │
       │                           │                         │                   │
       │                           │  3. Mark subscription   │                   │
       │                           │     as "cancel at       │                   │
       │                           │     period end"         │                   │
       │                           │────────────────────────────────────────────▶│
       │                           │                         │                   │
       │  4. Confirmation shown    │                         │                   │
       │     (access until end     │                         │                   │
       │      of period)           │                         │                   │
       │◀──────────────────────────│                         │                   │
       │                           │                         │                   │
       │                           │         ... Period passes ...              │
       │                           │                         │                   │
       │                           │  5. Webhook:            │                   │
       │                           │     Subscription        │                   │
       │                           │     deleted             │                   │
       │                           │◀────────────────────────│                   │
       │                           │                         │                   │
       │                           │  6. Update subscription │                   │
       │                           │     status to "canceled"│                   │
       │                           │────────────────────────────────────────────▶│
       │                           │                         │                   │
       │                           │  7. Downgrade to free   │                   │
       │                           │     plan                │                   │
       │                           │────────────────────────────────────────────▶│
       │                           │                         │                   │
       ▼                           ▼                         ▼                   ▼
```

### Simplified Explanation:

1. **You** request to cancel your subscription
2. **Sim** schedules the cancellation for the end of your current billing period (you keep access until then)
3. **Sim** marks your subscription as "to be cancelled"
4. **You** see a confirmation that you'll have access until the end of the period
5. When the billing period ends, Stripe notifies Sim
6. **Sim** updates your subscription status to "cancelled"
7. **Sim** downgrades your account to the free plan

---

## 7. Team Subscription Flow

This is what happens with team subscriptions (multiple seats).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     TEAM SUBSCRIPTION FLOW                                   │
└─────────────────────────────────────────────────────────────────────────────┘

     Admin                   Sim Application              Stripe              Database
       │                           │                         │                   │
       │  1. Purchase Team plan    │                         │                   │
       │     with N seats          │                         │                   │
       │──────────────────────────▶│                         │                   │
       │                           │                         │                   │
       │                           │  2. Create checkout     │                   │
       │                           │     with seat quantity  │                   │
       │                           │────────────────────────▶│                   │
       │                           │                         │                   │
       │                           │  3. Process payment     │                   │
       │                           │     for N seats         │                   │
       │                           │                         │                   │
       │                           │  4. Webhook: Payment    │                   │
       │                           │     successful          │                   │
       │                           │◀────────────────────────│                   │
       │                           │                         │                   │
       │                           │  5. Create organization │                   │
       │                           │     for team            │                   │
       │                           │────────────────────────────────────────────▶│
       │                           │                         │                   │
       │                           │  6. Add admin as        │                   │
       │                           │     organization owner  │                   │
       │                           │────────────────────────────────────────────▶│
       │                           │                         │                   │
       │  7. Team created,         │                         │                   │
       │     invite members        │                         │                   │
       │◀──────────────────────────│                         │                   │
       │                           │                         │                   │
       │  8. Add team members      │                         │                   │
       │     (up to seat limit)    │                         │                   │
       │──────────────────────────▶│                         │                   │
       │                           │                         │                   │
       │                           │  9. Add members to      │                   │
       │                           │     organization        │                   │
       │                           │────────────────────────────────────────────▶│
       │                           │                         │                   │
       ▼                           ▼                         ▼                   ▼
```

### Seat Management:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     ADDING/REMOVING SEATS                                    │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────────────────────┐
    │                                                                     │
    │   ADD SEAT                          REMOVE SEAT                     │
    │                                                                     │
    │   1. Admin clicks "Add Seat"        1. Admin removes member         │
    │   2. Stripe updates quantity        2. Member removed from org      │
    │   3. Prorated charge created        3. Stripe updates quantity      │
    │   4. New seat available             4. Prorated credit issued       │
    │                                                                     │
    └─────────────────────────────────────────────────────────────────────┘

    Note: Charges and credits are prorated based on time remaining
          in the current billing period.
```

---

## Key Concepts Summary

| Concept | What It Means |
|---------|---------------|
| **Webhook** | An automatic message sent from Stripe to Sim when something happens (like a payment) |
| **Checkout Session** | A secure, temporary page on Stripe's website where users enter payment details |
| **Invoice** | A bill created in Stripe for a specific charge |
| **Subscription** | A recurring payment that happens automatically on a schedule |
| **Seat** | A slot for one team member in a Team plan |
| **Overage** | Extra usage beyond what your plan includes |
| **Threshold** | The minimum amount of overage before you're billed |
| **Proration** | Adjusting charges based on partial time used (when adding/removing seats mid-period) |
