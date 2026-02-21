# Orders API

> **Source:** [`resources/orders.js`](../../resources/orders.js)

The Orders API provides methods for managing orders in Razorpay. Orders are the fundamental entity for creating payments and can be linked to transfers and fulfillments.

## Methods

### `razorpay.orders.all(params, callback)`

Retrieves all orders with query options and pagination.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Query parameters (optional) |
| `params.from` | `Date` | Filter orders from this date |
| `params.to` | `Date` | Filter orders until this date |
| `params.count` | `Number` | Number of records to fetch (default: `10`) |
| `params.skip` | `Number` | Number of records to skip (default: `0`) |
| `params.authorized` | `Boolean` | Filter for authorized orders |
| `params.receipt` | `String` | Filter by receipt ID |
| `params["expand[]"]` | `String` | Expand related entities (e.g., `transfers`) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to an array of order objects

**API Call:** `GET /orders`

**Notes:**
- Date parameters (`from`, `to`) are automatically normalized using `normalizeDate()` utility
- Default pagination: 10 records, starting from 0
- Supports expansion of related entities via `expand[]` parameter

---

### `razorpay.orders.fetch(orderId, callback)`

Retrieves details of a specific order.

| Parameter | Type | Description |
|-----------|------|-------------|
| `orderId` | `String` | The ID of the order to fetch (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the order object

**Throws:** `Error('order_id is mandatory')` if `orderId` is not provided

**API Call:** `GET /orders/{orderId}`

---

### `razorpay.orders.create(params, callback)`

Creates a new order.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Order creation parameters |
| `params.amount` | `Number` | Order amount in smallest currency unit (**Required**) |
| `params.currency` | `String` | Currency code (default: `INR`) |
| `params.receipt` | `String` | Receipt ID for the order |
| `params.notes` | `Object` | Key-value pairs for notes |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the created order object

**API Call:** `POST /orders`

---

### `razorpay.orders.edit(orderId, params, callback)`

Updates an existing order's details.

| Parameter | Type | Description |
|-----------|------|-------------|
| `orderId` | `String` | The ID of the order to edit (**Required**) |
| `params` | `Object` | Parameters to update |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the updated order object

**Throws:** `Error('order_id is mandatory')` if `orderId` is not provided

**API Call:** `PATCH /orders/{orderId}`

---

### `razorpay.orders.fetchPayments(orderId, callback)`

Retrieves all payments for a specific order.

| Parameter | Type | Description |
|-----------|------|-------------|
| `orderId` | `String` | The ID of the order (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to an array of payment objects

**Throws:** `Error('order_id is mandatory')` if `orderId` is not provided

**API Call:** `GET /orders/{orderId}/payments`

---

### `razorpay.orders.fetchTransferOrder(orderId, callback)`

Retrieves order details with expanded transfer information.

| Parameter | Type | Description |
|-----------|------|-------------|
| `orderId` | `String` | The ID of the order (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the order object with expanded transfers

**Throws:** `Error('order_id is mandatory')` if `orderId` is not provided

**API Call:** `GET /orders/{orderId}/?expand[]=transfers&status`

---

### `razorpay.orders.viewRtoReview(orderId, callback)`

Views the RTO (Return to Origin) review for an order.

| Parameter | Type | Description |
|-----------|------|-------------|
| `orderId` | `String` | The ID of the order |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the RTO review details

**API Call:** `POST /orders/{orderId}/rto_review`

---

### `razorpay.orders.editFulfillment(orderId, params, callback)`

Updates fulfillment details for an order.

| Parameter | Type | Description |
|-----------|------|-------------|
| `orderId` | `String` | The ID of the order |
| `params` | `Object` | Fulfillment parameters |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the updated fulfillment details

**API Call:** `POST /orders/{orderId}/fulfillment`

---

## API Reference Summary

| Method | HTTP Method | Endpoint | Required Parameters |
|--------|-------------|----------|---------------------|
| `all` | GET | `/orders` | None |
| `fetch` | GET | `/orders/{orderId}` | `orderId` |
| `create` | POST | `/orders` | `params.amount` |
| `edit` | PATCH | `/orders/{orderId}` | `orderId`, `params` |
| `fetchPayments` | GET | `/orders/{orderId}/payments` | `orderId` |
| `fetchTransferOrder` | GET | `/orders/{orderId}/?expand[]=transfers&status` | `orderId` |
| `viewRtoReview` | POST | `/orders/{orderId}/rto_review` | `orderId` |
| `editFulfillment` | POST | `/orders/{orderId}/fulfillment` | `orderId`, `params` |

## Related Documentation

- [Razorpay Orders API Documentation](https://razorpay.com/docs/api/orders/)
