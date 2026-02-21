# Transfers API

> **Source:** [`resources/transfers.js`](../../resources/transfers.js)

The Transfers API provides methods for managing transfers in Razorpay. Transfers allow you to split payments and transfer funds to linked accounts.

## Methods

### `razorpay.transfers.all(params, callback)`

Retrieves all transfers with query options and pagination.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Query parameters (optional) |
| `params.from` | `Date` | Filter transfers from this date |
| `params.to` | `Date` | Filter transfers until this date |
| `params.count` | `Number` | Number of records to fetch (default: `10`) |
| `params.skip` | `Number` | Number of records to skip (default: `0`) |
| `params.payment_id` | `String` | Filter transfers by payment ID |
| `params.recipient_settlement_id` | `String` | Filter by recipient settlement ID |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to an array of transfer objects

**API Call:** 
- `GET /transfers` (default)
- `GET /payments/{payment_id}/transfers` (if `payment_id` is provided)

**Notes:**
- Date parameters (`from`, `to`) are automatically normalized using `normalizeDate()` utility
- Default pagination: 10 records, starting from 0

---

### `razorpay.transfers.fetch(transferId, params, callback)`

Retrieves details of a specific transfer.

| Parameter | Type | Description |
|-----------|------|-------------|
| `transferId` | `String` | The ID of the transfer to fetch (**Required**) |
| `params` | `Object` | Query parameters (optional) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the transfer object

**Throws:** `Error('transfer_id is mandatory')` if `transferId` is not provided

**API Call:** `GET /transfers/{transferId}`

---

### `razorpay.transfers.create(params, callback)`

Creates a direct transfer to a linked account.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Transfer creation parameters |
| `params.account_number` | `String` | Your account number |
| `params.fund_account_id` | `String` | Fund account ID of the recipient |
| `params.amount` | `Number` | Amount to transfer in smallest currency unit |
| `params.currency` | `String` | Currency code (default: `INR`) |
| `params.mode` | `String` | Transfer mode (`NEFT`, `RTGS`, `IMPS`, `UPI`) |
| `params.purpose` | `String` | Purpose of transfer (`payout`, `refund`, etc.) |
| `params.notes` | `Object` | Key-value pairs for notes |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the created transfer object

**API Call:** `POST /transfers`

---

### `razorpay.transfers.edit(transferId, params, callback)`

Updates transfer details (e.g., notes).

| Parameter | Type | Description |
|-----------|------|-------------|
| `transferId` | `String` | The ID of the transfer to edit |
| `params` | `Object` | Parameters to update |
| `params.notes` | `Object` | Key-value pairs for notes |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the updated transfer object

**API Call:** `PATCH /transfers/{transferId}`

---

### `razorpay.transfers.reverse(transferId, params, callback)`

Reverses a transfer.

| Parameter | Type | Description |
|-----------|------|-------------|
| `transferId` | `String` | The ID of the transfer to reverse (**Required**) |
| `params` | `Object` | Reversal parameters |
| `params.amount` | `Number` | Amount to reverse (optional, reverses full amount if not specified) |
| `params.notes` | `Object` | Key-value pairs for notes |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the reversal object

**Throws:** `Error('transfer_id is mandatory')` if `transferId` is not provided

**API Call:** `POST /transfers/{transferId}/reversals`

---

### `razorpay.transfers.fetchSettlements(callback)`

Retrieves transfers with expanded recipient settlement information.

| Parameter | Type | Description |
|-----------|------|-------------|
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to transfers with settlement details

**API Call:** `GET /transfers?expand[]=recipient_settlement`

---

## API Reference Summary

| Method | HTTP Method | Endpoint | Required Parameters |
|--------|-------------|----------|---------------------|
| `all` | GET | `/transfers` or `/payments/{payment_id}/transfers` | None |
| `fetch` | GET | `/transfers/{transferId}` | `transferId` |
| `create` | POST | `/transfers` | `params` |
| `edit` | PATCH | `/transfers/{transferId}` | `transferId`, `params` |
| `reverse` | POST | `/transfers/{transferId}/reversals` | `transferId` |
| `fetchSettlements` | GET | `/transfers?expand[]=recipient_settlement` | None |

## Related Documentation

- [Razorpay Transfers API Documentation](https://razorpay.com/docs/api/transfers/)
- [Razorpay Route API Documentation](https://razorpay.com/docs/route/)
