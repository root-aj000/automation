# Invoices API

> **Source:** [`resources/invoices.js`](../../resources/invoices.js)

The Invoices API provides methods for managing invoices in Razorpay. The invoice entity is used for both Payment Links and Invoices. Some methods are only meaningful for Invoices and calling them for Payment Links will result in a Bad Request error.

## API Base

- **Base URL:** `/invoices`

## Methods

### `razorpay.invoices.create(params, callback)`

Creates an invoice of any type (invoice, link, ecod).

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Invoice creation parameters |
| `params.type` | `String` | Type of invoice (`invoice`, `link`, `ecod`) |
| `params.amount` | `Number` | Invoice amount in smallest currency unit |
| `params.currency` | `String` | Currency code (default: `INR`) |
| `params.description` | `String` | Invoice description |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the created invoice object

**API Call:** `POST /invoices`

---

### `razorpay.invoices.edit(invoiceId, params, callback)`

Updates an existing invoice with new attributes.

| Parameter | Type | Description |
|-----------|------|-------------|
| `invoiceId` | `String` | The ID of the invoice to edit (**Required**) |
| `params` | `Object` | Parameters to update |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the updated invoice object

**Throws:** `Promise.reject("Invoice ID is mandatory")` if `invoiceId` is not provided

**API Call:** `PATCH /invoices/{invoiceId}`

---

### `razorpay.invoices.issue(invoiceId, callback)`

Issues a drafted invoice.

| Parameter | Type | Description |
|-----------|------|-------------|
| `invoiceId` | `String` | The ID of the invoice to issue (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the issued invoice object

**Throws:** `Promise.reject("Invoice ID is mandatory")` if `invoiceId` is not provided

**API Call:** `POST /invoices/{invoiceId}/issue`

---

### `razorpay.invoices.delete(invoiceId, callback)`

Deletes a drafted invoice.

| Parameter | Type | Description |
|-----------|------|-------------|
| `invoiceId` | `String` | The ID of the invoice to delete (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves when the invoice is deleted

**Throws:** `Promise.reject("Invoice ID is mandatory")` if `invoiceId` is not provided

**API Call:** `DELETE /invoices/{invoiceId}`

---

### `razorpay.invoices.cancel(invoiceId, callback)`

Cancels an issued invoice.

| Parameter | Type | Description |
|-----------|------|-------------|
| `invoiceId` | `String` | The ID of the invoice to cancel (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the cancelled invoice object

**Throws:** `Promise.reject("Invoice ID is mandatory")` if `invoiceId` is not provided

**API Call:** `POST /invoices/{invoiceId}/cancel`

---

### `razorpay.invoices.fetch(invoiceId, callback)`

Retrieves details of a specific invoice.

| Parameter | Type | Description |
|-----------|------|-------------|
| `invoiceId` | `String` | The ID of the invoice to fetch (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the invoice object

**Throws:** `Promise.reject("Invoice ID is mandatory")` if `invoiceId` is not provided

**API Call:** `GET /invoices/{invoiceId}`

---

### `razorpay.invoices.all(params, callback)`

Retrieves multiple invoices with query options and pagination.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Query parameters (optional) |
| `params.from` | `Date` | Filter invoices from this date |
| `params.to` | `Date` | Filter invoices until this date |
| `params.count` | `Number` | Number of records to fetch (default: `10`) |
| `params.skip` | `Number` | Number of records to skip (default: `0`) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to an array of invoice objects

**API Call:** `GET /invoices`

**Notes:**
- Date parameters (`from`, `to`) are automatically normalized using `normalizeDate()` utility
- Default pagination: 10 records, starting from 0

---

### `razorpay.invoices.notifyBy(invoiceId, medium, callback)`

Sends or re-sends an invoice notification via the specified medium.

| Parameter | Type | Description |
|-----------|------|-------------|
| `invoiceId` | `String` | The ID of the invoice (**Required**) |
| `medium` | `String` | The notification medium (`email` or `sms`) (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the notification response

**Throws:** 
- `Promise.reject("Invoice ID is mandatory")` if `invoiceId` is not provided
- `Promise.reject("medium is required")` if `medium` is not provided

**API Call:** `POST /invoices/{invoiceId}/notify_by/{medium}`

---

## API Reference Summary

| Method | HTTP Method | Endpoint | Required Parameters |
|--------|-------------|----------|---------------------|
| `create` | POST | `/invoices` | `params` |
| `edit` | PATCH | `/invoices/{invoiceId}` | `invoiceId`, `params` |
| `issue` | POST | `/invoices/{invoiceId}/issue` | `invoiceId` |
| `delete` | DELETE | `/invoices/{invoiceId}` | `invoiceId` |
| `cancel` | POST | `/invoices/{invoiceId}/cancel` | `invoiceId` |
| `fetch` | GET | `/invoices/{invoiceId}` | `invoiceId` |
| `all` | GET | `/invoices` | None |
| `notifyBy` | POST | `/invoices/{invoiceId}/notify_by/{medium}` | `invoiceId`, `medium` |

## Related Documentation

- [Razorpay Invoices API Documentation](https://razorpay.com/docs/invoices/)
