# Subscriptions API

> **Source:** [`resources/subscriptions.js`](../../resources/subscriptions.js)

The Subscriptions API provides methods for managing subscriptions in Razorpay. Subscriptions allow you to charge customers on a recurring basis automatically.

## API Base

- **Base URL:** `/subscriptions`

## Methods

### `razorpay.subscriptions.create(params, callback)`

Creates a new subscription.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Subscription creation parameters |
| `params.plan_id` | `String` | The ID of the plan to subscribe to (**Required**) |
| `params.customer_id` | `String` | Customer ID for the subscription |
| `params.total_count` | `Number` | Total number of billing cycles |
| `params.quantity` | `Number` | Number of units (default: `1`) |
| `params.start_at` | `Number` | Unix timestamp for subscription start |
| `params.expire_by` | `Number` | Unix timestamp for subscription expiry |
| `params.notes` | `Object` | Key-value pairs for notes |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the created subscription object

**API Call:** `POST /subscriptions`

---

### `razorpay.subscriptions.fetch(subscriptionId, callback)`

Retrieves details of a specific subscription.

| Parameter | Type | Description |
|-----------|------|-------------|
| `subscriptionId` | `String` | The ID of the subscription to fetch (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the subscription object

**Throws:** `Promise.reject("Subscription ID is mandatory")` if `subscriptionId` is not provided

**API Call:** `GET /subscriptions/{subscriptionId}`

---

### `razorpay.subscriptions.update(subscriptionId, params, callback)`

Updates a subscription's details.

| Parameter | Type | Description |
|-----------|------|-------------|
| `subscriptionId` | `String` | The ID of the subscription to update (**Required**) |
| `params` | `Object` | Parameters to update |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the updated subscription object

**Throws:** `Promise.reject("Subscription ID is mandatory")` if `subscriptionId` is not provided

**API Call:** `PATCH /subscriptions/{subscriptionId}`

---

### Scheduled Changes

#### `razorpay.subscriptions.pendingUpdate(subscriptionId, callback)`

Retrieves pending scheduled changes for a subscription.

| Parameter | Type | Description |
|-----------|------|-------------|
| `subscriptionId` | `String` | The ID of the subscription (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the pending update details

**Throws:** `Promise.reject("Subscription ID is mandatory")` if `subscriptionId` is not provided

**API Call:** `GET /subscriptions/{subscriptionId}/retrieve_scheduled_changes`

---

#### `razorpay.subscriptions.cancelScheduledChanges(subscriptionId, callback)`

Cancels scheduled changes for a subscription.

| Parameter | Type | Description |
|-----------|------|-------------|
| `subscriptionId` | `String` | The ID of the subscription (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves when scheduled changes are cancelled

**Throws:** `Promise.reject("Subscription Id is mandatory")` if `subscriptionId` is not provided

**API Call:** `POST /subscriptions/{subscriptionId}/cancel_scheduled_changes`

---

### Pause and Resume

#### `razorpay.subscriptions.pause(subscriptionId, params, callback)`

Pauses a subscription.

| Parameter | Type | Description |
|-----------|------|-------------|
| `subscriptionId` | `String` | The ID of the subscription (**Required**) |
| `params` | `Object` | Pause parameters (optional) |
| `params.pause_at` | `Number` | Unix timestamp to pause at |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the paused subscription object

**Throws:** `Promise.reject("Subscription Id is mandatory")` if `subscriptionId` is not provided

**API Call:** `POST /subscriptions/{subscriptionId}/pause`

---

#### `razorpay.subscriptions.resume(subscriptionId, params, callback)`

Resumes a paused subscription.

| Parameter | Type | Description |
|-----------|------|-------------|
| `subscriptionId` | `String` | The ID of the subscription (**Required**) |
| `params` | `Object` | Resume parameters (optional) |
| `params.resume_at` | `Number` | Unix timestamp to resume at |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the resumed subscription object

**Throws:** `Promise.reject("Subscription Id is mandatory")` if `subscriptionId` is not provided

**API Call:** `POST /subscriptions/{subscriptionId}/resume`

---

### Offer Management

#### `razorpay.subscriptions.deleteOffer(subscriptionId, offerId, callback)`

Deletes an offer linked to a subscription.

| Parameter | Type | Description |
|-----------|------|-------------|
| `subscriptionId` | `String` | The ID of the subscription (**Required**) |
| `offerId` | `String` | The ID of the offer to delete (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves when the offer is deleted

**Throws:** `Promise.reject("Subscription Id is mandatory")` if `subscriptionId` is not provided

**API Call:** `DELETE /subscriptions/{subscriptionId}/{offerId}`

---

### `razorpay.subscriptions.all(params, callback)`

Retrieves all subscriptions with query options and pagination.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Query parameters (optional) |
| `params.from` | `Date` | Filter subscriptions from this date |
| `params.to` | `Date` | Filter subscriptions until this date |
| `params.count` | `Number` | Number of records to fetch (default: `10`) |
| `params.skip` | `Number` | Number of records to skip (default: `0`) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to an array of subscription objects

**API Call:** `GET /subscriptions`

**Notes:**
- Date parameters (`from`, `to`) are automatically normalized using `normalizeDate()` utility
- Default pagination: 10 records, starting from 0

---

### `razorpay.subscriptions.cancel(subscriptionId, cancelAtCycleEnd, callback)`

Cancels a subscription.

| Parameter | Type | Description |
|-----------|------|-------------|
| `subscriptionId` | `String` | The ID of the subscription to cancel (**Required**) |
| `cancelAtCycleEnd` | `Boolean` | Cancel at end of billing cycle (default: `false`) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the cancelled subscription object

**Throws:** `Promise.reject("Subscription ID is mandatory")` if `subscriptionId` is not provided

**API Call:** `POST /subscriptions/{subscriptionId}/cancel`

---

### Addon Management

#### `razorpay.subscriptions.createAddon(subscriptionId, params, callback)`

Creates an addon for a subscription.

| Parameter | Type | Description |
|-----------|------|-------------|
| `subscriptionId` | `String` | The ID of the subscription (**Required**) |
| `params` | `Object` | Addon parameters |
| `params.item` | `Object` | Item details with `name`, `amount`, `currency`, `description` |
| `params.quantity` | `Number` | Number of addon units |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the created addon object

**Throws:** `Promise.reject("Subscription ID is mandatory")` if `subscriptionId` is not provided

**API Call:** `POST /subscriptions/{subscriptionId}/addons`

---

### Registration Links

#### `razorpay.subscriptions.createRegistrationLink(params, callback)`

Creates a registration link for subscription authorization.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Registration link parameters |
| `params.customer_id` | `String` | Customer ID |
| `params.amount` | `Number` | Amount for registration |
| `params.currency` | `String` | Currency code |
| `params.type` | `String` | Type of registration (`link`, `invoice`) |
| `params.description` | `String` | Description for the link |
| `params.subscription_registration` | `Object` | Subscription registration details |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the registration link object

**API Call:** `POST /subscription_registration/auth_links`

---

## API Reference Summary

| Method | HTTP Method | Endpoint | Required Parameters |
|--------|-------------|----------|---------------------|
| `create` | POST | `/subscriptions` | `params.plan_id` |
| `fetch` | GET | `/subscriptions/{subscriptionId}` | `subscriptionId` |
| `update` | PATCH | `/subscriptions/{subscriptionId}` | `subscriptionId`, `params` |
| `pendingUpdate` | GET | `/subscriptions/{subscriptionId}/retrieve_scheduled_changes` | `subscriptionId` |
| `cancelScheduledChanges` | POST | `/subscriptions/{subscriptionId}/cancel_scheduled_changes` | `subscriptionId` |
| `pause` | POST | `/subscriptions/{subscriptionId}/pause` | `subscriptionId` |
| `resume` | POST | `/subscriptions/{subscriptionId}/resume` | `subscriptionId` |
| `deleteOffer` | DELETE | `/subscriptions/{subscriptionId}/{offerId}` | `subscriptionId`, `offerId` |
| `all` | GET | `/subscriptions` | None |
| `cancel` | POST | `/subscriptions/{subscriptionId}/cancel` | `subscriptionId` |
| `createAddon` | POST | `/subscriptions/{subscriptionId}/addons` | `subscriptionId`, `params` |
| `createRegistrationLink` | POST | `/subscription_registration/auth_links` | `params` |

## Related Documentation

- [Razorpay Subscriptions API Documentation](https://razorpay.com/docs/subscriptions/api/)
