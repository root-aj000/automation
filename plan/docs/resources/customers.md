# Customers API

> **Source:** [`resources/customers.js`](../../resources/customers.js)

The Customers API provides methods for managing customer entities in Razorpay. This includes customer CRUD operations, token management, bank account management, and eligibility checks.

## Methods

### `razorpay.customers.create(params, callback)`

Creates a new customer.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Customer creation parameters |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the created customer object

**API Call:** `POST /customers`

---

### `razorpay.customers.edit(customerId, params, callback)`

Updates an existing customer's details.

| Parameter | Type | Description |
|-----------|------|-------------|
| `customerId` | `String` | The ID of the customer to edit |
| `params` | `Object` | Parameters to update |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the updated customer object

**API Call:** `PUT /customers/{customerId}`

---

### `razorpay.customers.fetch(customerId, callback)`

Retrieves details of a specific customer.

| Parameter | Type | Description |
|-----------|------|-------------|
| `customerId` | `String` | The ID of the customer to fetch |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the customer object

**API Call:** `GET /customers/{customerId}`

---

### `razorpay.customers.all(params, callback)`

Retrieves all customers with pagination support.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Query parameters (optional) |
| `params.count` | `Number` | Number of records to fetch (default: `10`) |
| `params.skip` | `Number` | Number of records to skip (default: `0`) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to an array of customer objects

**API Call:** `GET /customers`

**Notes:** Default pagination: 10 records, starting from 0

---

### Token Management

#### `razorpay.customers.fetchTokens(customerId, callback)`

Fetches all tokens associated with a customer.

| Parameter | Type | Description |
|-----------|------|-------------|
| `customerId` | `String` | The ID of the customer |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to an array of tokens

**API Call:** `GET /customers/{customerId}/tokens`

---

#### `razorpay.customers.fetchToken(customerId, tokenId, callback)`

Fetches a specific token for a customer.

| Parameter | Type | Description |
|-----------|------|-------------|
| `customerId` | `String` | The ID of the customer |
| `tokenId` | `String` | The ID of the token |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the token object

**API Call:** `GET /customers/{customerId}/tokens/{tokenId}`

---

#### `razorpay.customers.deleteToken(customerId, tokenId, callback)`

Deletes a specific token for a customer.

| Parameter | Type | Description |
|-----------|------|-------------|
| `customerId` | `String` | The ID of the customer |
| `tokenId` | `String` | The ID of the token to delete |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves when token is deleted

**API Call:** `DELETE /customers/{customerId}/tokens/{tokenId}`

---

### Bank Account Management

#### `razorpay.customers.addBankAccount(customerId, params, callback)`

Adds a bank account to a customer.

| Parameter | Type | Description |
|-----------|------|-------------|
| `customerId` | `String` | The ID of the customer |
| `params` | `Object` | Bank account details |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the bank account object

**API Call:** `POST /customers/{customerId}/bank_account`

---

#### `razorpay.customers.deleteBankAccount(customerId, bankId, callback)`

Deletes a bank account from a customer.

| Parameter | Type | Description |
|-----------|------|-------------|
| `customerId` | `String` | The ID of the customer |
| `bankId` | `String` | The ID of the bank account to delete |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves when bank account is deleted

**API Call:** `DELETE /customers/{customerId}/bank_account/{bankId}`

---

### Eligibility Management

#### `razorpay.customers.requestEligibilityCheck(params, callback)`

Requests an eligibility check for a customer.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Eligibility check parameters |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the eligibility check response

**API Call:** `POST /customers/eligibility`

---

#### `razorpay.customers.fetchEligibility(eligibilityId, callback)`

Fetches an eligibility check result.

| Parameter | Type | Description |
|-----------|------|-------------|
| `eligibilityId` | `String` | The ID of the eligibility check |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the eligibility object

**API Call:** `GET /customers/eligibility/{eligibilityId}`

---

## API Reference Summary

| Method | HTTP Method | Endpoint |
|--------|-------------|----------|
| `create` | POST | `/customers` |
| `edit` | PUT | `/customers/{customerId}` |
| `fetch` | GET | `/customers/{customerId}` |
| `all` | GET | `/customers` |
| `fetchTokens` | GET | `/customers/{customerId}/tokens` |
| `fetchToken` | GET | `/customers/{customerId}/tokens/{tokenId}` |
| `deleteToken` | DELETE | `/customers/{customerId}/tokens/{tokenId}` |
| `addBankAccount` | POST | `/customers/{customerId}/bank_account` |
| `deleteBankAccount` | DELETE | `/customers/{customerId}/bank_account/{bankId}` |
| `requestEligibilityCheck` | POST | `/customers/eligibility` |
| `fetchEligibility` | GET | `/customers/eligibility/{eligibilityId}` |

## Related Documentation

- [Razorpay Customers API Documentation](https://razorpay.com/docs/api/customers/)
