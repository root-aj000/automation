# Refunds API

> **Source:** [`resources/refunds.js`](../../resources/refunds.js)

The Refunds API provides methods for managing refunds in Razorpay. Refunds allow you to return money to customers for completed payments.

## Methods

### `razorpay.refunds.all(params, callback)`

Retrieves all refunds with query options and pagination.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Query parameters (optional) |
| `params.from` | `Date` | Filter refunds from this date |
| `params.to` | `Date` | Filter refunds until this date |
| `params.count` | `Number` | Number of records to fetch (default: `10`) |
| `params.skip` | `Number` | Number of records to skip (default: `0`) |
| `params.payment_id` | `String` | Filter refunds by payment ID |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to an array of refund objects

**API Call:** 
- `GET /refunds` (default)
- `GET /payments/{payment_id}/refunds` (if `payment_id` is provided)

**Notes:**
- Date parameters (`from`, `to`) are automatically normalized using `normalizeDate()` utility
- Default pagination: 10 records, starting from 0

---

### `razorpay.refunds.edit(refundId, params, callback)`

Updates refund details (e.g., notes, speed).

| Parameter | Type | Description |
|-----------|------|-------------|
| `refundId` | `String` | The ID of the refund to edit (**Required**) |
| `params` | `Object` | Parameters to update |
| `params.notes` | `Object` | Key-value pairs for notes |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the updated refund object

**Throws:** `Error('refund Id is mandatory')` if `refundId` is not provided

**API Call:** `PATCH /refunds/{refundId}`

---

### `razorpay.refunds.fetch(refundId, params, callback)`

Retrieves details of a specific refund.

| Parameter | Type | Description |
|-----------|------|-------------|
| `refundId` | `String` | The ID of the refund to fetch (**Required**) |
| `params` | `Object` | Query parameters (optional) |
| `params.payment_id` | `String` | Payment ID associated with the refund |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the refund object

**Throws:** `Error('refund_id is mandatory')` if `refundId` is not provided

**API Call:** 
- `GET /refunds/{refundId}` (default)
- `GET /payments/{payment_id}/refunds/{refundId}` (if `payment_id` is provided)

---

## API Reference Summary

| Method | HTTP Method | Endpoint | Required Parameters |
|--------|-------------|----------|---------------------|
| `all` | GET | `/refunds` or `/payments/{payment_id}/refunds` | None |
| `edit` | PATCH | `/refunds/{refundId}` | `refundId`, `params` |
| `fetch` | GET | `/refunds/{refundId}` or `/payments/{payment_id}/refunds/{refundId}` | `refundId` |

## Related Documentation

- [Razorpay Refunds API Documentation](https://razorpay.com/docs/api/refunds/)
