# Addons API

> **Source:** [`resources/addons.js`](../../resources/addons.js)

The Addons API provides methods for managing subscription addons in Razorpay. Addons are additional charges that can be added to subscriptions.

## API Base

- **Base URL:** `/addons`

## Methods

### `razorpay.addons.fetch(addonId, callback)`

Fetches an addon given its ID.

| Parameter | Type | Description |
|-----------|------|-------------|
| `addonId` | `String` | The ID of the addon to fetch (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the addon object

**Throws:** `Promise.reject("Addon ID is mandatory")` if `addonId` is not provided

**API Call:** `GET /addons/{addonId}`

---

### `razorpay.addons.delete(addonId, callback)`

Deletes an addon given its ID.

| Parameter | Type | Description |
|-----------|------|-------------|
| `addonId` | `String` | The ID of the addon to delete (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves when the addon is deleted

**Throws:** `Promise.reject("Addon ID is mandatory")` if `addonId` is not provided

**API Call:** `DELETE /addons/{addonId}`

---

### `razorpay.addons.all(params, callback)`

Retrieves all addons with optional filtering and pagination.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Query parameters (optional) |
| `params.from` | `Date` | Filter addons from this date |
| `params.to` | `Date` | Filter addons until this date |
| `params.count` | `Number` | Number of records to fetch (default: `10`) |
| `params.skip` | `Number` | Number of records to skip (default: `0`) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to an array of addon objects

**API Call:** `GET /addons`

**Notes:**
- Date parameters (`from`, `to`) are automatically normalized using `normalizeDate()` utility
- Default pagination: 10 records, starting from 0

---

## API Reference Summary

| Method | HTTP Method | Endpoint | Required Parameters |
|--------|-------------|----------|---------------------|
| `fetch` | GET | `/addons/{addonId}` | `addonId` |
| `delete` | DELETE | `/addons/{addonId}` | `addonId` |
| `all` | GET | `/addons` | None |

## Related Documentation

- [Razorpay Subscriptions API Documentation](https://razorpay.com/docs/subscriptions/api/)
