# Payment Links API

> **Source:** [`resources/paymentLink.js`](../../resources/paymentLink.js)

The Payment Links API provides methods for managing payment links in Razorpay. Payment links allow you to send payment requests to customers via email or SMS.

## API Base

- **Base URL:** `/payment_links`

## Methods

### `razorpay.paymentLink.create(params, callback)`

Creates a new payment link.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Payment link creation parameters |
| `params.amount` | `Number` | Payment amount in smallest currency unit (**Required**) |
| `params.currency` | `String` | Currency code (default: `INR`) |
| `params.accept_partial` | `Boolean` | Allow partial payments |
| `params.description` | `String` | Payment link description |
| `params.customer` | `Object` | Customer details |
| `params.notify` | `Object` | Notification settings (`email`, `sms`) |
| `params.callback_url` | `String` | Callback URL after payment |
| `params.callback_method` | `String` | Callback HTTP method (`get` or `post`) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the created payment link object

**API Call:** `POST /payment_links`

---

### `razorpay.paymentLink.cancel(paymentLinkId, callback)`

Cancels an issued payment link.

| Parameter | Type | Description |
|-----------|------|-------------|
| `paymentLinkId` | `String` | The ID of the payment link to cancel (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the cancelled payment link object

**Throws:** `Promise.reject("Payment Link ID is mandatory")` if `paymentLinkId` is not provided

**API Call:** `POST /payment_links/{paymentLinkId}/cancel`

---

### `razorpay.paymentLink.fetch(paymentLinkId, callback)`

Retrieves details of a specific payment link.

| Parameter | Type | Description |
|-----------|------|-------------|
| `paymentLinkId` | `String` | The ID of the payment link to fetch (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the payment link object

**Throws:** `Promise.reject("Payment Link ID is mandatory")` if `paymentLinkId` is not provided

**API Call:** `GET /payment_links/{paymentLinkId}`

---

### `razorpay.paymentLink.all(params, callback)`

Retrieves multiple payment links with query options and pagination.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Query parameters (optional) |
| `params.from` | `Date` | Filter payment links from this date |
| `params.to` | `Date` | Filter payment links until this date |
| `params.count` | `Number` | Number of records to fetch (default: `10`) |
| `params.skip` | `Number` | Number of records to skip (default: `0`) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to an array of payment link objects

**API Call:** `GET /payment_links`

**Notes:**
- Date parameters (`from`, `to`) are automatically normalized using `normalizeDate()` utility
- Default pagination: 10 records, starting from 0

---

### `razorpay.paymentLink.edit(paymentLinkId, params, callback)`

Updates an existing payment link's details.

| Parameter | Type | Description |
|-----------|------|-------------|
| `paymentLinkId` | `String` | The ID of the payment link to edit |
| `params` | `Object` | Parameters to update |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the updated payment link object

**API Call:** `PATCH /payment_links/{paymentLinkId}`

---

### `razorpay.paymentLink.notifyBy(paymentLinkId, medium, callback)`

Sends or re-sends a payment link notification via the specified medium.

| Parameter | Type | Description |
|-----------|------|-------------|
| `paymentLinkId` | `String` | The ID of the payment link (**Required**) |
| `medium` | `String` | The notification medium (`email` or `sms`) (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the notification response

**Throws:** 
- `Promise.reject("Payment Link ID is mandatory")` if `paymentLinkId` is not provided
- `Promise.reject("medium is required")` if `medium` is not provided

**API Call:** `POST /payment_links/{paymentLinkId}/notify_by/{medium}`

---

## API Reference Summary

| Method | HTTP Method | Endpoint | Required Parameters |
|--------|-------------|----------|---------------------|
| `create` | POST | `/payment_links` | `params` |
| `cancel` | POST | `/payment_links/{paymentLinkId}/cancel` | `paymentLinkId` |
| `fetch` | GET | `/payment_links/{paymentLinkId}` | `paymentLinkId` |
| `all` | GET | `/payment_links` | None |
| `edit` | PATCH | `/payment_links/{paymentLinkId}` | `paymentLinkId`, `params` |
| `notifyBy` | POST | `/payment_links/{paymentLinkId}/notify_by/{medium}` | `paymentLinkId`, `medium` |

## Related Documentation

- [Razorpay Payment Links API Documentation](https://razorpay.com/docs/payment-links/)
