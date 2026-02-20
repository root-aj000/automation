
# Stripe → Razorpay: Complete API Mapping Table

---

## 1. Customers API

| # | Stripe API | Razorpay API | Differences |
|---|-----------|-------------|-------------|
| 1 | `stripe.customers.create(params)` | `razorpay.customers.create(params)` | Razorpay requires `contact` (phone). No `payment_method` param. No `invoice_settings`. Uses `fail_existing` flag to handle duplicates. |
| 2 | `stripe.customers.retrieve(id)` | `razorpay.customers.fetch(id)` | No `deleted` property in Razorpay. No `invoice_settings.default_payment_method`. No `subscriptions` expansion. |
| 3 | `stripe.customers.update(id, params)` | `PUT /v1/customers/{id}` (raw HTTP) | Not available in Razorpay SDK. Must use raw API call. |
| 4 | `stripe.customers.delete(id)` | **N/A — Not supported** | Razorpay customers cannot be deleted. |
| 5 | `stripe.customers.list(params)` | **N/A — Not in SDK** | Razorpay has no customer list endpoint in SDK. Use raw API with `GET /v1/customers`. |
| 6 | `stripe.customers.search(params)` | **N/A — Not supported** | No search API. Filter manually or query your own database. |

---

## 2. Subscriptions API

| # | Stripe API | Razorpay API | Differences |
|---|-----------|-------------|-------------|
| 1 | `stripe.subscriptions.create(params)` | `razorpay.subscriptions.create(params)` | Razorpay uses `plan_id` instead of `items[].price`. Requires `total_count` (max cycles). No `trial_period_days` — use `start_at` for delayed start. No inline `payment_method`. Returns `short_url` for customer auth. |
| 2 | `stripe.subscriptions.retrieve(id)` | `razorpay.subscriptions.fetch(id)` | `customer` → `customer_id` (always string). No `items.data[]` — uses `plan_id` + `quantity`. No `default_payment_method`. Different status values (`active`, `halted`, `paused` vs Stripe's `past_due`, `incomplete`). No `cancel_at_period_end` field. `current_period_start/end` → `current_start/end` (unix timestamps). |
| 3 | `stripe.subscriptions.update(id, params)` | `razorpay.subscriptions.update(id, params)` | Can only update `plan_id`, `quantity`, `offer_id`, `remaining_count`, `schedule_change_at`. **Cannot** set `cancel_at_period_end` — must use `cancel(id, true)`. **Cannot** update payment method. **Cannot** add/remove items. No proration — changes apply at `now` or `cycle_end`. |
| 4 | `stripe.subscriptions.update(id, { cancel_at_period_end: true })` | `razorpay.subscriptions.cancel(id, true)` | Stripe uses update with flag. Razorpay uses cancel with boolean. `true` = cancel at cycle end. |
| 5 | `stripe.subscriptions.update(id, { cancel_at_period_end: false })` | **N/A — Not supported** | Cannot un-cancel in Razorpay. Must create a new subscription. |
| 6 | `stripe.subscriptions.cancel(id, { prorate: true })` | `razorpay.subscriptions.cancel(id, false)` | `false` = immediate cancellation. No proration — calculate and refund manually. |
| 7 | `stripe.subscriptions.list(params)` | `razorpay.subscriptions.all(params)` | Uses `count`/`skip` instead of `limit`/`starting_after`. Filter by `plan_id` only. No `status` filter in SDK. |
| 8 | `stripe.subscriptions.search(params)` | **N/A — Not supported** | No search. Filter via `all()` or your database. |
| 9 | `stripe.subscriptions.resume(id)` | `razorpay.subscriptions.resume(id, params)` | Razorpay requires `resume_initiated_by` param (`customer` or `plan`). Only works on paused subscriptions, not cancelled. |
| 10 | N/A | `razorpay.subscriptions.pause(id, params)` | Razorpay-specific. Pauses subscription. Requires `pause_initiated_by`. No Stripe equivalent (Stripe uses update to pause billing). |
| 11 | N/A | `razorpay.subscriptions.pendingUpdate(id)` | Razorpay-specific. Fetch scheduled changes. |
| 12 | N/A | `razorpay.subscriptions.cancelScheduledChanges(id)` | Razorpay-specific. Cancel pending update. |

---

## 3. Invoices API

| # | Stripe API | Razorpay API | Differences |
|---|-----------|-------------|-------------|
| 1 | `stripe.invoices.create(params)` | `razorpay.invoices.create(params)` | Razorpay includes `line_items[]` inline (no separate invoiceItems call). Uses `type: 'invoice'` or `'link'`. `draft: 1` replaces `auto_advance: false`. No `collection_method`. No `default_payment_method`. Returns `short_url` for customer payment. |
| 2 | `stripe.invoices.retrieve(id)` | `razorpay.invoices.fetch(id)` | `customer` → `customer_id`. `parent.subscription_details.subscription` → `subscription_id`. `payment_intent` → `payment_id`. `amount_due` in paise not cents. Different status values (`issued` vs `open`). |
| 3 | `stripe.invoices.update(id, params)` | `razorpay.invoices.edit(id, params)` | Only draft invoices can be edited. Method name is `edit` not `update`. |
| 4 | `stripe.invoices.delete(id)` | `razorpay.invoices.delete(id)` | Both only allow deleting draft invoices. Similar behavior. |
| 5 | `stripe.invoices.finalizeInvoice(id)` | `razorpay.invoices.issue(id)` | Method name difference: `finalizeInvoice` → `issue`. Both transition from draft to actionable state. Razorpay activates `short_url` for payment. |
| 6 | `stripe.invoices.pay(id, { payment_method })` | **N/A — No direct equivalent** | Razorpay invoices are paid by customer via `short_url`. For server-initiated charge: create Order → charge token via `/v1/payments/create/recurring`. |
| 7 | `stripe.invoices.sendInvoice(id)` | `razorpay.invoices.notifyBy(id, medium)` | Razorpay takes `medium` param: `'sms'` or `'email'`. Must call separately for each medium. |
| 8 | `stripe.invoices.voidInvoice(id)` | `razorpay.invoices.cancel(id)` | Stripe "voids", Razorpay "cancels". Same effect — invoice becomes unpayable. |
| 9 | `stripe.invoices.list(params)` | `razorpay.invoices.all(params)` | Uses `count`/`skip` not `limit`/`starting_after`. Filter by `type`, `customer_id`. |
| 10 | `stripe.invoices.search(params)` | **N/A — Not supported** | No search endpoint. |

---

## 4. Invoice Items API

| # | Stripe API | Razorpay API | Differences |
|---|-----------|-------------|-------------|
| 1 | `stripe.invoiceItems.create(params)` | Inline `line_items[]` in `razorpay.invoices.create()` | **No separate API.** Line items are part of invoice create/edit payload. Each item needs `name`, `amount`, `currency`, `quantity`. |
| 2 | `stripe.invoiceItems.retrieve(id)` | Access via `invoice.line_items[i]` | No standalone fetch. Included in invoice response. |
| 3 | `stripe.invoiceItems.update(id, params)` | `razorpay.invoices.edit(id, { line_items })` | Update items by editing the parent invoice. Include item `id` to update, omit to add new. |
| 4 | `stripe.invoiceItems.delete(id)` | `razorpay.invoices.edit(id, { line_items })` | Remove by editing invoice and excluding the item. |
| 5 | `stripe.invoiceItems.list(params)` | Access via `invoice.line_items[]` | No separate list. Always embedded in invoice. |

---

## 5. Payment Methods API → Tokens API

| # | Stripe API | Razorpay API | Differences |
|---|-----------|-------------|-------------|
| 1 | `stripe.paymentMethods.create(params)` | Created automatically via Checkout with `recurring: true` | Cannot create tokens via API directly. Customer must go through Checkout or e-mandate flow. |
| 2 | `stripe.paymentMethods.retrieve(id)` | `razorpay.customers.fetchTokens(customerId)` | No standalone fetch by PM ID. Must fetch all tokens for customer, then filter. For card details on a payment, use `razorpay.payments.fetch(paymentId).card`. |
| 3 | `stripe.paymentMethods.update(id, params)` | **N/A — Not supported** | Cannot update tokens. Create new one instead. |
| 4 | `stripe.paymentMethods.attach(id, { customer })` | Automatic during recurring auth | Tokens auto-attach to customer during Checkout. |
| 5 | `stripe.paymentMethods.detach(id)` | `razorpay.customers.deleteToken(customerId, tokenId)` | Must provide both customer ID and token ID. |
| 6 | `stripe.paymentMethods.list({ customer })` | `razorpay.customers.fetchTokens(customerId)` | Same concept. Returns `items[]` array with card details nested. |
| 7 | Accessing `paymentMethod.card.last4` | `token.card.last4` or `payment.card.last4` | Same field name. Razorpay uses `network` instead of `brand` (`'Visa'` vs `'visa'`). Razorpay uses `type` (`'credit'`/`'debit'`) where Stripe uses `funding`. |

---

## 6. Payment Intents API → Orders + Payments API

| # | Stripe API | Razorpay API | Differences |
|---|-----------|-------------|-------------|
| 1 | `stripe.paymentIntents.create(params)` | `razorpay.orders.create(params)` | Razorpay splits intent and execution. Order = intent. Payment = execution. Order has no `payment_method` — method selected at Checkout. Uses `receipt` instead of `metadata` for tracking. |
| 2 | `stripe.paymentIntents.retrieve(id)` | `razorpay.orders.fetch(id)` + `razorpay.payments.fetch(id)` | Order for status. Payment for error details. `last_payment_error.message` → `payment.error_description`. |
| 3 | `stripe.paymentIntents.update(id, params)` | **N/A — Orders are immutable** | Cannot update Razorpay orders after creation. Create new one. |
| 4 | `stripe.paymentIntents.confirm(id, params)` | Handled by Checkout SDK on frontend | No server-side confirm. Frontend Checkout handles auth. |
| 5 | `stripe.paymentIntents.capture(id)` | `razorpay.payments.capture(paymentId, amount, currency)` | Razorpay requires `amount` and `currency` params for capture. Stripe captures full amount by default. |
| 6 | `stripe.paymentIntents.cancel(id)` | **N/A — No equivalent** | Orders cannot be cancelled. They expire after 30 min if unpaid. Authorized payments can be refunded. |
| 7 | `stripe.paymentIntents.list(params)` | `razorpay.orders.all(params)` | Uses `count`/`skip`. Filter by `authorized`/`receipt`. |
| 8 | `stripe.paymentIntents.search(params)` | **N/A — Not supported** | No search. |

---

## 7. Charges API → Payments API

| # | Stripe API | Razorpay API | Differences |
|---|-----------|-------------|-------------|
| 1 | `stripe.charges.create(params)` | `razorpay.orders.create()` + Checkout | Cannot create charges directly. Use order → checkout flow. For recurring: `POST /v1/payments/create/recurring`. |
| 2 | `stripe.charges.retrieve(id)` | `razorpay.payments.fetch(id)` | `customer` → `customer_id` (always string). `failure_message` → `error_description`. `failure_code` → `error_code`. Additional fields: `error_source`, `error_step`, `error_reason`. |
| 3 | `stripe.charges.update(id, params)` | **N/A — Payments are immutable** | Cannot update payment metadata after creation. |
| 4 | `stripe.charges.capture(id)` | `razorpay.payments.capture(id, amount, currency)` | Must pass `amount` and `currency`. |
| 5 | `stripe.charges.list(params)` | `razorpay.payments.all(params)` | Uses `count`/`skip`. |
| 6 | `stripe.charges.search(params)` | **N/A — Not supported** | No search. |

---

## 8. Products API → Items API

| # | Stripe API | Razorpay API | Differences |
|---|-----------|-------------|-------------|
| 1 | `stripe.products.create(params)` | `razorpay.items.create(params)` | Razorpay items include `amount` and `currency` (Stripe products don't have price). Used as catalog items for invoices and plans. |
| 2 | `stripe.products.retrieve(id)` | `razorpay.items.fetch(id)` | Similar. |
| 3 | `stripe.products.update(id, params)` | `razorpay.items.edit(id, params)` | Method name `edit` not `update`. |
| 4 | `stripe.products.delete(id)` | `razorpay.items.delete(id)` | Similar. |
| 5 | `stripe.products.list(params)` | `razorpay.items.all(params)` | Uses `count`/`skip`. |
| 6 | `stripe.products.search(params)` | **N/A — Not supported** | No search. |

---

## 9. Prices API → Plans API

| # | Stripe API | Razorpay API | Differences |
|---|-----------|-------------|-------------|
| 1 | `stripe.prices.create(params)` | `razorpay.plans.create(params)` | Razorpay plans include the item/product inline. Uses `period` (`daily`/`weekly`/`monthly`/`yearly`) + `interval` instead of `recurring.interval` + `recurring.interval_count`. Item `amount` is on the plan, not separate. |
| 2 | `stripe.prices.retrieve(id)` | `razorpay.plans.fetch(id)` | Similar. |
| 3 | `stripe.prices.update(id, params)` | **N/A — Plans are immutable** | Cannot update Razorpay plans. Create new one. |
| 4 | `stripe.prices.list(params)` | `razorpay.plans.all(params)` | Uses `count`/`skip`. |
| 5 | `stripe.prices.search(params)` | **N/A — Not supported** | No search. |

---

## 10. Billing Portal API

| # | Stripe API | Razorpay API | Differences |
|---|-----------|-------------|-------------|
| 1 | `stripe.billingPortal.sessions.create(params)` | **N/A — Not available** | Must build custom billing management UI. Show subscriptions, invoices, payment methods, and cancellation options yourself. |
| 2 | `stripe.billingPortal.configurations.create(params)` | **N/A — Not available** | No portal configuration needed since there's no portal. |

---

## 11. Refunds API

| # | Stripe API | Razorpay API | Differences |
|---|-----------|-------------|-------------|
| 1 | `stripe.refunds.create(params)` | `razorpay.payments.refund(paymentId, params)` | Razorpay refund is a method on payments, not separate resource. Supports `speed: 'normal'` or `'optimum'` (instant). |
| 2 | `stripe.refunds.retrieve(id)` | `razorpay.refunds.fetch(refundId)` | Similar. Alternate: `razorpay.payments.fetchRefund(paymentId, refundId)`. |
| 3 | `stripe.refunds.update(id, params)` | `razorpay.refunds.edit(refundId, params)` | Can only update `notes`. |
| 4 | `stripe.refunds.list(params)` | `razorpay.refunds.all(params)` | Alternate: `razorpay.payments.fetchMultipleRefund(paymentId, params)` for payment-specific refunds. |

---

## 12. Events / Webhooks

| # | Stripe API | Razorpay API | Differences |
|---|-----------|-------------|-------------|
| 1 | `stripe.events.retrieve(id)` | **N/A — Not available** | Razorpay has no events retrieval API. Webhooks are fire-and-forget. Store events in your database on receipt. |
| 2 | `stripe.events.list(params)` | **N/A — Not available** | No event listing. |
| 3 | `stripe.webhooks.constructEvent(body, sig, secret)` | Manual HMAC-SHA256 verification | Stripe has SDK method. Razorpay requires manual: `crypto.createHmac('sha256', secret).update(body).digest('hex')` and compare with `x-razorpay-signature` header. |

---

## 13. Webhook Event Types

| # | Stripe Event | Razorpay Event | Differences |
|---|-------------|---------------|-------------|
| 1 | `invoice.payment_succeeded` | `payment.captured` / `invoice.paid` | Razorpay splits by entity type. `payment.captured` for all payments. `invoice.paid` specifically for invoice payments. |
| 2 | `invoice.payment_failed` | `payment.failed` / `invoice.expired` | `payment.failed` for immediate failure. `invoice.expired` when invoice passes expiry without payment. |
| 3 | `invoice.finalized` | **N/A — No equivalent** | No event when invoice is issued. Track via API response from `invoices.issue()`. |
| 4 | `customer.subscription.created` | `subscription.authenticated` / `subscription.activated` | `authenticated` = mandate registered. `activated` = first payment successful. |
| 5 | `customer.subscription.updated` | `subscription.updated` | Similar. |
| 6 | `customer.subscription.deleted` | `subscription.cancelled` / `subscription.completed` | `cancelled` = manual cancellation. `completed` = all cycles done. |
| 7 | `charge.dispute.created` | `payment.dispute.created` | `charge` → `payment` in event name. Payload structure differs. |
| 8 | `charge.dispute.closed` | `payment.dispute.won` / `payment.dispute.lost` / `payment.dispute.closed` | Razorpay splits into 3 outcome-specific events. |
| 9 | `customer.created` | **N/A — No event** | Razorpay doesn't fire webhook on customer creation. |
| 10 | `payment_intent.succeeded` | `payment.captured` | Same concept. |
| 11 | `payment_intent.payment_failed` | `payment.failed` | Same concept. |
| 12 | `payment_method.attached` | `token.confirmed` | Token = saved payment method. |
| 13 | N/A | `subscription.charged` | Razorpay-specific. Fires on each recurring charge success. |
| 14 | N/A | `subscription.halted` | Razorpay-specific. Subscription paused due to payment failure. |
| 15 | N/A | `subscription.paused` | Razorpay-specific. Manual pause. |
| 16 | N/A | `subscription.resumed` | Razorpay-specific. Resumed from pause. |
| 17 | N/A | `payment.authorized` | Razorpay-specific. Payment authorized but not yet captured. |
| 18 | N/A | `order.paid` | Razorpay-specific. Order fully paid. |
| 19 | N/A | `refund.processed` / `refund.failed` | Razorpay-specific events. Stripe uses `charge.refunded` / `refund.failed`. |
| 20 | N/A | `token.rejected` / `token.paused` / `token.cancelled` | Razorpay-specific token lifecycle events. |

---

## 14. Stripe Objects → Razorpay Objects Field Mapping

| # | Stripe Field | Razorpay Field | Differences |
|---|-------------|---------------|-------------|
| 1 | `object.id` (`sub_xxx`, `in_xxx`) | `object.id` (`sub_xxx`, `inv_xxx`) | Same pattern, different prefixes. |
| 2 | `object.metadata` | `object.notes` | Same concept. `metadata` → `notes`. Both key-value string pairs. Razorpay max 15 keys. |
| 3 | `subscription.customer` (string or object) | `subscription.customer_id` (always string) | No expansion in Razorpay. Always string ID. |
| 4 | `subscription.items.data[0].quantity` | `subscription.quantity` | Flat field, no items array. |
| 5 | `subscription.items.data[0].price.id` | `subscription.plan_id` | Flat field. |
| 6 | `subscription.cancel_at_period_end` | **N/A — No field** | Check `subscription.status === 'cancelled'` + `ended_at` is in future. |
| 7 | `subscription.current_period_start` | `subscription.current_start` | Same concept, shorter name. Unix timestamp. |
| 8 | `subscription.current_period_end` | `subscription.current_end` | Same concept. |
| 9 | `subscription.default_payment_method` | **N/A — No field** | Payment method determined at subscription auth, not stored as editable field. |
| 10 | `subscription.collection_method` | **N/A — No field** | Always auto-charge in Razorpay subscriptions. |
| 11 | `invoice.amount_due` (cents) | `invoice.amount_due` (paise) | Same name, different currency unit. 1 USD cent ≠ 1 INR paisa. |
| 12 | `invoice.status` (`draft`, `open`, `paid`, `void`) | `invoice.status` (`draft`, `issued`, `paid`, `cancelled`, `expired`) | `open` → `issued`. `void` → `cancelled`. Razorpay adds `expired`. |
| 13 | `invoice.payment_intent` | `invoice.payment_id` + `invoice.order_id` | Split into two fields. |
| 14 | `invoice.parent.subscription_details.subscription` | `invoice.subscription_id` | Flat field in Razorpay. |
| 15 | `customer.invoice_settings.default_payment_method` | **N/A — No field** | Fetch tokens separately. |
| 16 | `customer.deleted` | **N/A — No field** | Customers cannot be deleted. |
| 17 | `charge.failure_message` | `payment.error_description` | Different field name. |
| 18 | `charge.failure_code` | `payment.error_code` | Different field name. |
| 19 | `paymentMethod.card.brand` | `token.card.network` / `payment.card.network` | `brand` → `network`. Values: `'visa'` → `'Visa'` (capitalized). |
| 20 | `paymentMethod.card.funding` | `token.card.type` / `payment.card.type` | `funding` → `type`. `'credit'`/`'debit'`/`'prepaid'`. |
| 21 | `paymentIntent.last_payment_error.message` | `payment.error_description` | Flat field on payment object. |
| 22 | `event.type` | `event.event` | Field name `type` → `event`. |
| 23 | `event.data.object` | `event.payload.{entity}.entity` | Nested differently. e.g., `event.payload.payment.entity`. |
| 24 | Amount in **cents** (USD default) | Amount in **paise** (INR default) | `$5.00 = 500` → `₹500.00 = 50000`. |

---

## 15. SDK Methods Availability Summary

| # | API Category | Stripe SDK | Razorpay SDK | Gap |
|---|-------------|-----------|-------------|-----|
| 1 | Customers - CRUD | ✅ Full | ⚠️ Create + Fetch only | No update/delete/list in SDK |
| 2 | Subscriptions - CRUD | ✅ Full | ✅ Full | No un-cancel. No proration. |
| 3 | Invoices - CRUD | ✅ Full | ✅ Full | No `pay()`. Use orders. |
| 4 | Invoice Items | ✅ Separate API | ❌ Inline only | Embedded in invoice |
| 5 | Payment Methods | ✅ Full | ⚠️ Via Tokens | No direct create. Checkout only. |
| 6 | Payment Intents | ✅ Full | ⚠️ Via Orders | No confirm/cancel on server |
| 7 | Charges | ✅ Full | ✅ As Payments | Same concept, different name |
| 8 | Products | ✅ Full | ✅ As Items | Items include amount |
| 9 | Prices | ✅ Full | ⚠️ As Plans | Plans are immutable |
| 10 | Billing Portal | ✅ Hosted | ❌ None | Must build custom |
| 11 | Refunds | ✅ Separate | ⚠️ On Payments | Method on payment object |
| 12 | Events | ✅ Retrieve + List | ❌ None | Webhooks only |
| 13 | Webhook Verify | ✅ SDK method | ❌ Manual HMAC | Write own verification |
| 14 | Search APIs | ✅ On most resources | ❌ None | No search on any resource |
| 15 | Idempotency | ✅ Header support | ❌ None | Implement in app layer |
| 16 | Multi-currency | ✅ Native | ⚠️ Limited | INR primary |

---

## 16. Environment Variables

| # | Stripe Variable | Razorpay Variable | Differences |
|---|----------------|-------------------|-------------|
| 1 | `STRIPE_SECRET_KEY` (`sk_test_xxx` / `sk_live_xxx`) | `RAZORPAY_KEY_ID` (`rzp_test_xxx` / `rzp_live_xxx`) + `RAZORPAY_KEY_SECRET` | Stripe = 1 key. Razorpay = key pair (ID + Secret). |
| 2 | `STRIPE_PUBLISHABLE_KEY` (`pk_test_xxx`) | `RAZORPAY_KEY_ID` (same as above) | Razorpay uses same Key ID on frontend. Secret stays server-side. |
| 3 | `STRIPE_WEBHOOK_SECRET` (`whsec_xxx`) | `RAZORPAY_WEBHOOK_SECRET` | Set manually in Razorpay Dashboard → Webhooks. |