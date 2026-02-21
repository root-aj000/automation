# Accounts API

> **Source:** [`resources/accounts.js`](../../resources/accounts.js)

The Accounts API provides methods for managing Razorpay accounts. This module handles account creation, modification, retrieval, and document management.

## API Base

- **Base URL:** `/accounts`
- **API Version:** `v2`

## Methods

### `razorpay.accounts.create(params, callback)`

Creates a new Razorpay account.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Account creation parameters |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the created account object

**API Call:** `POST /accounts` (v2)

---

### `razorpay.accounts.edit(accountId, params, callback)`

Edits an existing account's details.

| Parameter | Type | Description |
|-----------|------|-------------|
| `accountId` | `String` | The ID of the account to edit |
| `params` | `Object` | Parameters to update |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the updated account object

**API Call:** `PATCH /accounts/{accountId}` (v2)

---

### `razorpay.accounts.fetch(accountId, callback)`

Retrieves details of a specific account.

| Parameter | Type | Description |
|-----------|------|-------------|
| `accountId` | `String` | The ID of the account to fetch |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the account object

**API Call:** `GET /accounts/{accountId}` (v2)

---

### `razorpay.accounts.delete(accountId, callback)`

Deletes a specific account.

| Parameter | Type | Description |
|-----------|------|-------------|
| `accountId` | `String` | The ID of the account to delete |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves when the account is deleted

**API Call:** `DELETE /accounts/{accountId}` (v2)

---

### `razorpay.accounts.uploadAccountDoc(accountId, params, callback)`

Uploads a document for a specific account.

| Parameter | Type | Description |
|-----------|------|-------------|
| `accountId` | `String` | The ID of the account |
| `params` | `Object` | Document upload parameters |
| `params.file` | `Object` | File object with `value` property containing file data |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the upload response

**API Call:** `POST /accounts/{accountId}/documents` (v2, FormData)

---

### `razorpay.accounts.fetchAccountDoc(accountId, callback)`

Fetches all documents associated with a specific account.

| Parameter | Type | Description |
|-----------|------|-------------|
| `accountId` | `String` | The ID of the account |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the list of documents

**API Call:** `GET /accounts/{accountId}/documents` (v2)

---

## API Reference Summary

| Method | HTTP Method | Endpoint | Version |
|--------|-------------|----------|---------|
| `create` | POST | `/accounts` | v2 |
| `edit` | PATCH | `/accounts/{accountId}` | v2 |
| `fetch` | GET | `/accounts/{accountId}` | v2 |
| `delete` | DELETE | `/accounts/{accountId}` | v2 |
| `uploadAccountDoc` | POST | `/accounts/{accountId}/documents` | v2 |
| `fetchAccountDoc` | GET | `/accounts/{accountId}/documents` | v2 |

## Related Documentation

- [Razorpay Accounts API Documentation](https://razorpay.com/docs/api/accounts/)
