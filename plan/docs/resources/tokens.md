# Tokens API

> **Source:** [`resources/tokens.js`](../../resources/tokens.js)

The Tokens API provides methods for managing payment tokens in Razorpay. Tokens are used for recurring payments and tokenized transactions.

## API Base

- **Base URL:** `/tokens`

## Methods

### `razorpay.tokens.create(params, callback)`

Creates a new token for a customer.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Token creation parameters |
| `params.customer_id` | `String` | The ID of the customer |
| `params.method` | `String` | Payment method (`card`, `cardless_emi`, `paylater`, `emi`, `netbanking`) |
| `params.card` | `Object` | Card details (for card method) |
| `params.contact` | `String` | Contact number |
| `params.email` | `String` | Email address |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the created token object

**API Call:** `POST /tokens`

---

### `razorpay.tokens.fetch(params, callback)`

Fetches token details.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Token fetch parameters |
| `params.id` | `String` | Token ID to fetch |
| `params.customer_id` | `String` | Customer ID associated with the token |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the token object

**API Call:** `POST /tokens/fetch`

---

### `razorpay.tokens.delete(params, callback)`

Deletes a token.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Token deletion parameters |
| `params.id` | `String` | Token ID to delete |
| `params.customer_id` | `String` | Customer ID associated with the token |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves when token is deleted

**API Call:** `POST /tokens/delete`

---

### `razorpay.tokens.processPaymentOnAlternatePAorPG(params, callback)`

Processes payment token data on an alternate Payment Aggregator or Payment Gateway.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Payment processing parameters |
| `params.token_id` | `String` | Token ID |
| `params.merchant_id` | `String` | Merchant ID |
| `params.payment` | `Object` | Payment details |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the processed payment data

**API Call:** `POST /tokens/service_provider_tokens/token_transactional_data`

---

## API Reference Summary

| Method | HTTP Method | Endpoint | Required Parameters |
|--------|-------------|----------|---------------------|
| `create` | POST | `/tokens` | `params` |
| `fetch` | POST | `/tokens/fetch` | `params` |
| `delete` | POST | `/tokens/delete` | `params` |
| `processPaymentOnAlternatePAorPG` | POST | `/tokens/service_provider_tokens/token_transactional_data` | `params` |

## Related Documentation

- [Razorpay Tokens API Documentation](https://razorpay.com/docs/api/tokens/)
- [Razorpay Tokenization Documentation](https://razorpay.com/docs/tokenization/)
