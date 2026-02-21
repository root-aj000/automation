# Settlements API

> **Source:** [`resources/settlements.js`](../../resources/settlements.js)

The Settlements API provides methods for managing settlements in Razorpay. Settlements are the process of transferring funds from Razorpay to the merchant's bank account.

## API Base

- **Base URL:** `/settlements`

## Methods

### `razorpay.settlements.createOndemandSettlement(params, callback)`

Creates an on-demand settlement request.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Settlement parameters |
| `params.amount` | `Number` | Settlement amount (optional, settles full amount if not specified) |
| `params.notes` | `Object` | Key-value pairs for notes |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the settlement object

**API Call:** `POST /settlements/ondemand`

---

### `razorpay.settlements.all(params, callback)`

Retrieves all settlements with query options and pagination.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Query parameters (optional) |
| `params.from` | `Date` | Filter settlements from this date |
| `params.to` | `Date` | Filter settlements until this date |
| `params.count` | `Number` | Number of records to fetch |
| `params.skip` | `Number` | Number of records to skip |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to an array of settlement objects

**API Call:** `GET /settlements`

---

### `razorpay.settlements.fetch(settlementId, callback)`

Retrieves details of a specific settlement.

| Parameter | Type | Description |
|-----------|------|-------------|
| `settlementId` | `String` | The ID of the settlement to fetch (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the settlement object

**Throws:** `Promise.reject("settlement Id is mandatroy")` if `settlementId` is not provided

**API Call:** `GET /settlements/{settlementId}`

---

### On-Demand Settlements

#### `razorpay.settlements.fetchOndemandSettlementById(settlementId, params, callback)`

Fetches an on-demand settlement by ID.

| Parameter | Type | Description |
|-----------|------|-------------|
| `settlementId` | `String` | The ID of the on-demand settlement (**Required**) |
| `params` | `Object` | Query parameters (optional) |
| `params["expand[]"]` | `String` | Expand related entities |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the on-demand settlement object

**Throws:** `Promise.reject("settlment Id is mandatroy")` if `settlementId` is not provided

**API Call:** `GET /settlements/ondemand/{settlementId}`

---

#### `razorpay.settlements.fetchAllOndemandSettlement(params, callback)`

Retrieves all on-demand settlements.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Query parameters (optional) |
| `params.from` | `Date` | Filter settlements from this date |
| `params.to` | `Date` | Filter settlements until this date |
| `params.count` | `Number` | Number of records to fetch |
| `params.skip` | `Number` | Number of records to skip |
| `params["expand[]"]` | `String` | Expand related entities |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to an array of on-demand settlement objects

**API Call:** `GET /settlements/ondemand`

---

### Settlement Reports

#### `razorpay.settlements.reports(params, callback)`

Retrieves settlement reports for recon (reconciliation).

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Query parameters (optional) |
| `params.day` | `String` | Day for the report |
| `params.count` | `Number` | Number of records to fetch |
| `params.skip` | `Number` | Number of records to skip |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to settlement report data

**API Call:** `GET /settlements/recon/combined`

---

## API Reference Summary

| Method | HTTP Method | Endpoint | Required Parameters |
|--------|-------------|----------|---------------------|
| `createOndemandSettlement` | POST | `/settlements/ondemand` | None |
| `all` | GET | `/settlements` | None |
| `fetch` | GET | `/settlements/{settlementId}` | `settlementId` |
| `fetchOndemandSettlementById` | GET | `/settlements/ondemand/{settlementId}` | `settlementId` |
| `fetchAllOndemandSettlement` | GET | `/settlements/ondemand` | None |
| `reports` | GET | `/settlements/recon/combined` | None |

## Related Documentation

- [Razorpay Settlements API Documentation](https://razorpay.com/docs/api/settlements/)
