# Virtual Accounts API

> **Source:** [`resources/virtualAccounts.js`](../../resources/virtualAccounts.js)

The Virtual Accounts API provides methods for managing virtual accounts in Razorpay. Virtual accounts are temporary accounts that can be used to receive payments via bank transfers.

## API Base

- **Base URL:** `/virtual_accounts`

## Methods

### `razorpay.virtualAccounts.all(params, callback)`

Retrieves all virtual accounts with query options and pagination.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Query parameters (optional) |
| `params.from` | `Date` | Filter virtual accounts from this date |
| `params.to` | `Date` | Filter virtual accounts until this date |
| `params.count` | `Number` | Number of records to fetch (default: `10`) |
| `params.skip` | `Number` | Number of records to skip (default: `0`) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to an array of virtual account objects

**API Call:** `GET /virtual_accounts`

**Notes:**
- Date parameters (`from`, `to`) are automatically normalized using `normalizeDate()` utility
- Default pagination: 10 records, starting from 0

---

### `razorpay.virtualAccounts.fetch(virtualAccountId, callback)`

Retrieves details of a specific virtual account.

| Parameter | Type | Description |
|-----------|------|-------------|
| `virtualAccountId` | `String` | The ID of the virtual account to fetch (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the virtual account object

**Throws:** `Promise.reject("virtual_account_id is mandatory")` if `virtualAccountId` is not provided

**API Call:** `GET /virtual_accounts/{virtualAccountId}`

---

### `razorpay.virtualAccounts.create(params, callback)`

Creates a new virtual account.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Virtual account creation parameters |
| `params.receivers` | `Array` | Array of receiver objects |
| `params.description` | `String` | Description for the virtual account |
| `params.notes` | `Object` | Key-value pairs for notes |
| `params.customer_id` | `String` | Customer ID to link the virtual account |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the created virtual account object

**API Call:** `POST /virtual_accounts`

---

### `razorpay.virtualAccounts.close(virtualAccountId, callback)`

Closes a virtual account to stop receiving payments.

| Parameter | Type | Description |
|-----------|------|-------------|
| `virtualAccountId` | `String` | The ID of the virtual account to close (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the closed virtual account object

**Throws:** `Promise.reject("virtual_account_id is mandatory")` if `virtualAccountId` is not provided

**API Call:** `POST /virtual_accounts/{virtualAccountId}/close`

---

### Payments

#### `razorpay.virtualAccounts.fetchPayments(virtualAccountId, callback)`

Retrieves all payments for a specific virtual account.

| Parameter | Type | Description |
|-----------|------|-------------|
| `virtualAccountId` | `String` | The ID of the virtual account (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to an array of payment objects

**Throws:** `Promise.reject("virtual_account_id is mandatory")` if `virtualAccountId` is not provided

**API Call:** `GET /virtual_accounts/{virtualAccountId}/payments`

---

### Receivers

#### `razorpay.virtualAccounts.addReceiver(virtualAccountId, params, callback)`

Adds a receiver to an existing virtual account.

| Parameter | Type | Description |
|-----------|------|-------------|
| `virtualAccountId` | `String` | The ID of the virtual account (**Required**) |
| `params` | `Object` | Receiver parameters |
| `params.type` | `String` | Receiver type (`bank_account`) |
| `params.ifsc` | `String` | Bank IFSC code |
| `params.account_number` | `String` | Bank account number |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the updated virtual account object

**Throws:** `Promise.reject("virtual_account_id is mandatory")` if `virtualAccountId` is not provided

**API Call:** `POST /virtual_accounts/{virtualAccountId}/receivers`

---

### Allowed Payers

#### `razorpay.virtualAccounts.allowedPayer(virtualAccountId, params, callback)`

Adds an allowed payer account to a virtual account.

| Parameter | Type | Description |
|-----------|------|-------------|
| `virtualAccountId` | `String` | The ID of the virtual account (**Required**) |
| `params` | `Object` | Allowed payer parameters |
| `params.type` | `String` | Payer type (`bank_account`) |
| `params.ifsc` | `String` | Bank IFSC code |
| `params.account_number` | `String` | Bank account number |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the updated virtual account object

**Throws:** `Promise.reject("virtual_account_id is mandatory")` if `virtualAccountId` is not provided

**API Call:** `POST /virtual_accounts/{virtualAccountId}/allowed_payers`

---

#### `razorpay.virtualAccounts.deleteAllowedPayer(virtualAccountId, allowedPayerId, callback)`

Deletes an allowed payer from a virtual account.

| Parameter | Type | Description |
|-----------|------|-------------|
| `virtualAccountId` | `String` | The ID of the virtual account (**Required**) |
| `allowedPayerId` | `String` | The ID of the allowed payer to delete (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves when the allowed payer is deleted

**Throws:** 
- `Promise.reject("virtual_account_id is mandatory")` if `virtualAccountId` is not provided
- `Promise.reject("allowed payer id is mandatory")` if `allowedPayerId` is not provided

**API Call:** `DELETE /virtual_accounts/{virtualAccountId}/allowed_payers/{allowedPayerId}`

---

## API Reference Summary

| Method | HTTP Method | Endpoint | Required Parameters |
|--------|-------------|----------|---------------------|
| `all` | GET | `/virtual_accounts` | None |
| `fetch` | GET | `/virtual_accounts/{virtualAccountId}` | `virtualAccountId` |
| `create` | POST | `/virtual_accounts` | `params` |
| `close` | POST | `/virtual_accounts/{virtualAccountId}/close` | `virtualAccountId` |
| `fetchPayments` | GET | `/virtual_accounts/{virtualAccountId}/payments` | `virtualAccountId` |
| `addReceiver` | POST | `/virtual_accounts/{virtualAccountId}/receivers` | `virtualAccountId`, `params` |
| `allowedPayer` | POST | `/virtual_accounts/{virtualAccountId}/allowed_payers` | `virtualAccountId`, `params` |
| `deleteAllowedPayer` | DELETE | `/virtual_accounts/{virtualAccountId}/allowed_payers/{allowedPayerId}` | `virtualAccountId`, `allowedPayerId` |

## Related Documentation

- [Razorpay Virtual Accounts API Documentation](https://razorpay.com/docs/api/virtual-accounts/)
