# Items API

> **Source:** [`resources/items.js`](../../resources/items.js)

The Items API provides methods for managing items in Razorpay. Items are individual products or services that can be added to invoices.

## Methods

### `razorpay.items.all(params, callback)`

Retrieves all items with query options and pagination.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Query parameters (optional) |
| `params.from` | `Date` | Filter items from this date |
| `params.to` | `Date` | Filter items until this date |
| `params.count` | `Number` | Number of records to fetch (default: `10`) |
| `params.skip` | `Number` | Number of records to skip (default: `0`) |
| `params.authorized` | `Boolean` | Filter for authorized items |
| `params.receipt` | `String` | Filter by receipt ID |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to an array of item objects

**API Call:** `GET /items`

**Notes:**
- Date parameters (`from`, `to`) are automatically normalized using `normalizeDate()` utility
- Default pagination: 10 records, starting from 0

---

### `razorpay.items.fetch(itemId, callback)`

Retrieves details of a specific item.

| Parameter | Type | Description |
|-----------|------|-------------|
| `itemId` | `String` | The ID of the item to fetch (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the item object

**Throws:** `Error('item_id is mandatory')` if `itemId` is not provided

**API Call:** `GET /items/{itemId}`

---

### `razorpay.items.create(params, callback)`

Creates a new item.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Item creation parameters |
| `params.amount` | `Number` | Item amount in smallest currency unit (**Required**) |
| `params.currency` | `String` | Currency code (default: `INR`) |
| `params.name` | `String` | Item name |
| `params.description` | `String` | Item description |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the created item object

**Throws:** `Error('amount is mandatory')` if `amount` is not provided

**API Call:** `POST /items`

---

### `razorpay.items.edit(itemId, params, callback)`

Updates an existing item's details.

| Parameter | Type | Description |
|-----------|------|-------------|
| `itemId` | `String` | The ID of the item to edit (**Required**) |
| `params` | `Object` | Parameters to update |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the updated item object

**Throws:** `Error('item_id is mandatory')` if `itemId` is not provided

**API Call:** `PATCH /items/{itemId}`

---

### `razorpay.items.delete(itemId, callback)`

Deletes a specific item.

| Parameter | Type | Description |
|-----------|------|-------------|
| `itemId` | `String` | The ID of the item to delete (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves when the item is deleted

**Throws:** `Error('item_id is mandatory')` if `itemId` is not provided

**API Call:** `DELETE /items/{itemId}`

---

## API Reference Summary

| Method | HTTP Method | Endpoint | Required Parameters |
|--------|-------------|----------|---------------------|
| `all` | GET | `/items` | None |
| `fetch` | GET | `/items/{itemId}` | `itemId` |
| `create` | POST | `/items` | `params.amount` |
| `edit` | PATCH | `/items/{itemId}` | `itemId`, `params` |
| `delete` | DELETE | `/items/{itemId}` | `itemId` |

## Related Documentation

- [Razorpay Items API Documentation](https://razorpay.com/docs/api/items/)
