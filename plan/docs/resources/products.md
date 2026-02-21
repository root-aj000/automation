# Products API

> **Source:** [`resources/products.js`](../../resources/products.js)

The Products API provides methods for managing product configurations for Razorpay accounts. Products are services that can be enabled for merchant accounts.

## API Base

- **Base URL:** `/accounts` (with products subresource)

## Methods

### `razorpay.products.requestProductConfiguration(accountId, params, callback)`

Requests product configuration for an account.

| Parameter | Type | Description |
|-----------|------|-------------|
| `accountId` | `String` | The ID of the account |
| `params` | `Object` | Product configuration parameters |
| `params.product_name` | `String` | Name of the product to configure |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the product configuration response

**API Call:** `POST /accounts/{accountId}/products` (v2)

---

### `razorpay.products.edit(accountId, productId, params, callback)`

Updates product configuration for an account.

| Parameter | Type | Description |
|-----------|------|-------------|
| `accountId` | `String` | The ID of the account |
| `productId` | `String` | The ID of the product to update |
| `params` | `Object` | Parameters to update |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the updated product configuration

**API Call:** `PATCH /accounts/{accountId}/products/{productId}` (v2)

---

### `razorpay.products.fetch(accountId, productId, callback)`

Retrieves product configuration details.

| Parameter | Type | Description |
|-----------|------|-------------|
| `accountId` | `String` | The ID of the account |
| `productId` | `String` | The ID of the product to fetch |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the product configuration object

**API Call:** `GET /accounts/{accountId}/products/{productId}` (v2)

---

### `razorpay.products.fetchTnc(productName, callback)`

Fetches terms and conditions for a product.

| Parameter | Type | Description |
|-----------|------|-------------|
| `productName` | `String` | The name of the product |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the terms and conditions

**API Call:** `GET /products/{productName}/tnc` (v2)

---

## API Reference Summary

| Method | HTTP Method | Endpoint | Version | Required Parameters |
|--------|-------------|----------|---------|---------------------|
| `requestProductConfiguration` | POST | `/accounts/{accountId}/products` | v2 | `accountId`, `params` |
| `edit` | PATCH | `/accounts/{accountId}/products/{productId}` | v2 | `accountId`, `productId`, `params` |
| `fetch` | GET | `/accounts/{accountId}/products/{productId}` | v2 | `accountId`, `productId` |
| `fetchTnc` | GET | `/products/{productName}/tnc` | v2 | `productName` |

## Related Documentation

- [Razorpay Products API Documentation](https://razorpay.com/docs/api/products/)
