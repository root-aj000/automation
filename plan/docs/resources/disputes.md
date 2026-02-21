# Disputes API

> **Source:** [`resources/disputes.js`](../../resources/disputes.js)

The Disputes API provides methods for managing payment disputes in Razorpay. Disputes occur when a customer contests a charge with their bank or card network.

## API Base

- **Base URL:** `/disputes`

## Methods

### `razorpay.disputes.fetch(disputeId, callback)`

Retrieves details of a specific dispute.

| Parameter | Type | Description |
|-----------|------|-------------|
| `disputeId` | `String` | The ID of the dispute to fetch |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the dispute object

**API Call:** `GET /disputes/{disputeId}`

---

### `razorpay.disputes.all(params, callback)`

Retrieves all disputes with pagination support.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Query parameters (optional) |
| `params.count` | `Number` | Number of records to fetch (default: `10`) |
| `params.skip` | `Number` | Number of records to skip (default: `0`) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to an array of dispute objects

**API Call:** `GET /disputes`

**Notes:** Default pagination: 10 records, starting from 0

---

### `razorpay.disputes.accept(disputeId, callback)`

Accepts a dispute, acknowledging its validity.

| Parameter | Type | Description |
|-----------|------|-------------|
| `disputeId` | `String` | The ID of the dispute to accept |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the updated dispute object

**API Call:** `POST /disputes/{disputeId}/accept`

---

### `razorpay.disputes.contest(disputeId, params, callback)`

Contests a dispute by providing evidence against it.

| Parameter | Type | Description |
|-----------|------|-------------|
| `disputeId` | `String` | The ID of the dispute to contest |
| `params` | `Object` | Contest parameters including evidence |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the updated dispute object

**API Call:** `PATCH /disputes/{disputeId}/contest`

---

## API Reference Summary

| Method | HTTP Method | Endpoint | Required Parameters |
|--------|-------------|----------|---------------------|
| `fetch` | GET | `/disputes/{disputeId}` | `disputeId` |
| `all` | GET | `/disputes` | None |
| `accept` | POST | `/disputes/{disputeId}/accept` | `disputeId` |
| `contest` | PATCH | `/disputes/{disputeId}/contest` | `disputeId`, `params` |

## Related Documentation

- [Razorpay Disputes API Documentation](https://razorpay.com/docs/api/disputes/)
