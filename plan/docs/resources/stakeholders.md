# Stakeholders API

> **Source:** [`resources/stakeholders.js`](../../resources/stakeholders.js)

The Stakeholders API provides methods for managing stakeholders for Razorpay accounts. Stakeholders are individuals or entities with ownership or control over a business account.

## API Base

- **Base URL:** `/accounts` (with stakeholders subresource)

## Methods

### `razorpay.stakeholders.create(accountId, params, callback)`

Creates a new stakeholder for an account.

| Parameter | Type | Description |
|-----------|------|-------------|
| `accountId` | `String` | The ID of the account |
| `params` | `Object` | Stakeholder creation parameters |
| `params.name` | `String` | Stakeholder's name |
| `params.email` | `String` | Stakeholder's email |
| `params.phone` | `Object` | Phone details with `country_code` and `number` |
| `params.kyc` | `Object` | KYC information |
| `params.address` | `Object` | Address details |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the created stakeholder object

**API Call:** `POST /accounts/{accountId}/stakeholders` (v2)

---

### `razorpay.stakeholders.edit(accountId, stakeholderId, params, callback)`

Updates an existing stakeholder's details.

| Parameter | Type | Description |
|-----------|------|-------------|
| `accountId` | `String` | The ID of the account |
| `stakeholderId` | `String` | The ID of the stakeholder to update |
| `params` | `Object` | Parameters to update |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the updated stakeholder object

**API Call:** `PATCH /accounts/{accountId}/stakeholders/{stakeholderId}` (v2)

---

### `razorpay.stakeholders.fetch(accountId, stakeholderId, callback)`

Retrieves details of a specific stakeholder.

| Parameter | Type | Description |
|-----------|------|-------------|
| `accountId` | `String` | The ID of the account |
| `stakeholderId` | `String` | The ID of the stakeholder to fetch |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the stakeholder object

**API Call:** `GET /accounts/{accountId}/stakeholders/{stakeholderId}` (v2)

---

### `razorpay.stakeholders.all(accountId, callback)`

Retrieves all stakeholders for an account.

| Parameter | Type | Description |
|-----------|------|-------------|
| `accountId` | `String` | The ID of the account |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to an array of stakeholder objects

**API Call:** `GET /accounts/{accountId}/stakeholders` (v2)

---

### Document Management

#### `razorpay.stakeholders.uploadStakeholderDoc(accountId, stakeholderId, params, callback)`

Uploads a document for a stakeholder.

| Parameter | Type | Description |
|-----------|------|-------------|
| `accountId` | `String` | The ID of the account |
| `stakeholderId` | `String` | The ID of the stakeholder |
| `params` | `Object` | Document upload parameters |
| `params.file` | `Object` | File object with `value` property containing file data |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the upload response

**API Call:** `POST /accounts/{accountId}/stakeholders/{stakeholderId}/documents` (v2, FormData)

---

#### `razorpay.stakeholders.fetchStakeholderDoc(accountId, stakeholderId, callback)`

Fetches all documents for a stakeholder.

| Parameter | Type | Description |
|-----------|------|-------------|
| `accountId` | `String` | The ID of the account |
| `stakeholderId` | `String` | The ID of the stakeholder |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to an array of documents

**API Call:** `GET /accounts/{accountId}/stakeholders/{stakeholderId}/documents` (v2)

---

## API Reference Summary

| Method | HTTP Method | Endpoint | Version | Required Parameters |
|--------|-------------|----------|---------|---------------------|
| `create` | POST | `/accounts/{accountId}/stakeholders` | v2 | `accountId`, `params` |
| `edit` | PATCH | `/accounts/{accountId}/stakeholders/{stakeholderId}` | v2 | `accountId`, `stakeholderId`, `params` |
| `fetch` | GET | `/accounts/{accountId}/stakeholders/{stakeholderId}` | v2 | `accountId`, `stakeholderId` |
| `all` | GET | `/accounts/{accountId}/stakeholders` | v2 | `accountId` |
| `uploadStakeholderDoc` | POST | `/accounts/{accountId}/stakeholders/{stakeholderId}/documents` | v2 | `accountId`, `stakeholderId`, `params` |
| `fetchStakeholderDoc` | GET | `/accounts/{accountId}/stakeholders/{stakeholderId}/documents` | v2 | `accountId`, `stakeholderId` |

## Related Documentation

- [Razorpay Stakeholders API Documentation](https://razorpay.com/docs/api/stakeholders/)
