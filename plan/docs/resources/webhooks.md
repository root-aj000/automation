# Webhooks API

> **Source:** [`resources/webhooks.js`](../../resources/webhooks.js)

The Webhooks API provides methods for managing webhooks in Razorpay. Webhooks allow you to receive real-time notifications about events in your Razorpay account.

## API Base

- **Base URL:** `/accounts` (with webhooks subresource) for v2 API
- **Base URL:** `/webhooks` for v1 API

## Methods

### `razorpay.webhooks.create(params, accountId, callback)`

Creates a new webhook.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Webhook creation parameters |
| `params.url` | `String` | Webhook URL (**Required**) |
| `params.events` | `Array` | Array of event types to subscribe to |
| `params.secret` | `String` | Secret key for webhook signature verification |
| `accountId` | `String` | The ID of the account (optional, for v2 API) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the created webhook object

**API Call:** 
- `POST /webhooks` (v1, when `accountId` is not provided)
- `POST /accounts/{accountId}/webhooks` (v2, when `accountId` is provided)

---

### `razorpay.webhooks.edit(params, webhookId, accountId, callback)`

Updates an existing webhook's configuration.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Webhook update parameters |
| `params.url` | `String` | New webhook URL |
| `params.events` | `Array` | Updated array of event types |
| `params.status` | `String` | Webhook status (`active`, `inactive`) |
| `webhookId` | `String` | The ID of the webhook to update |
| `accountId` | `String` | The ID of the account (optional, for v2 API) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the updated webhook object

**API Call:** 
- `PUT /webhooks/{webhookId}` (v1, when `accountId` is not provided)
- `PATCH /accounts/{accountId}/webhooks/{webhookId}` (v2, when both `accountId` and `webhookId` are provided)

---

### `razorpay.webhooks.all(params, accountId, callback)`

Retrieves all webhooks with query options and pagination.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Query parameters (optional) |
| `params.from` | `Date` | Filter webhooks from this date |
| `params.to` | `Date` | Filter webhooks until this date |
| `params.count` | `Number` | Number of records to fetch (default: `10`) |
| `params.skip` | `Number` | Number of records to skip (default: `0`) |
| `accountId` | `String` | The ID of the account (optional, for v2 API) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to an array of webhook objects

**API Call:** 
- `GET /webhooks` (v1, when `accountId` is not provided)
- `GET /accounts/{accountId}/webhooks/` (v2, when `accountId` is provided)

**Notes:**
- Date parameters (`from`, `to`) are automatically normalized using `normalizeDate()` utility
- Default pagination: 10 records, starting from 0

---

### `razorpay.webhooks.fetch(webhookId, accountId, callback)`

Retrieves details of a specific webhook.

| Parameter | Type | Description |
|-----------|------|-------------|
| `webhookId` | `String` | The ID of the webhook to fetch |
| `accountId` | `String` | The ID of the account |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the webhook object

**API Call:** `GET /accounts/{accountId}/webhooks/{webhookId}` (v2)

---

### `razorpay.webhooks.delete(webhookId, accountId, callback)`

Deletes a webhook.

| Parameter | Type | Description |
|-----------|------|-------------|
| `webhookId` | `String` | The ID of the webhook to delete |
| `accountId` | `String` | The ID of the account |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves when the webhook is deleted

**API Call:** `DELETE /accounts/{accountId}/webhooks/{webhookId}` (v2)

---

## API Reference Summary

| Method | HTTP Method | Endpoint | Version | Required Parameters |
|--------|-------------|----------|---------|---------------------|
| `create` | POST | `/webhooks` or `/accounts/{accountId}/webhooks` | v1/v2 | `params` |
| `edit` | PUT/PATCH | `/webhooks/{webhookId}` or `/accounts/{accountId}/webhooks/{webhookId}` | v1/v2 | `webhookId`, `params` |
| `all` | GET | `/webhooks` or `/accounts/{accountId}/webhooks/` | v1/v2 | None |
| `fetch` | GET | `/accounts/{accountId}/webhooks/{webhookId}` | v2 | `webhookId`, `accountId` |
| `delete` | DELETE | `/accounts/{accountId}/webhooks/{webhookId}` | v2 | `webhookId`, `accountId` |

## Related Documentation

- [Razorpay Webhooks API Documentation](https://razorpay.com/docs/api/webhooks/)
- [Razorpay Webhook Events Reference](https://razorpay.com/docs/webhooks/events/)
