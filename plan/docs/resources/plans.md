# Plans API

> **Source:** [`resources/plans.js`](../../resources/plans.js)

The Plans API provides methods for managing subscription plans in Razorpay. Plans define the billing cycle and amount for subscriptions.

## API Base

- **Base URL:** `/plans`

## Methods

### `razorpay.plans.create(params, callback)`

Creates a new subscription plan.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Plan creation parameters |
| `params.period` | `String` | Billing period (`daily`, `weekly`, `monthly`, `yearly`) |
| `params.interval` | `Number` | Billing interval (e.g., 1 for every period, 2 for every 2 periods) |
| `params.item` | `Object` | Item details containing `name`, `amount`, `currency`, `description` |
| `params.notes` | `Object` | Key-value pairs for notes |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the created plan object

**API Call:** `POST /plans`

---

### `razorpay.plans.fetch(planId, callback)`

Retrieves details of a specific plan.

| Parameter | Type | Description |
|-----------|------|-------------|
| `planId` | `String` | The ID of the plan to fetch (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the plan object

**Throws:** `Promise.reject("Plan ID is mandatory")` if `planId` is not provided

**API Call:** `GET /plans/{planId}`

---

### `razorpay.plans.all(params, callback)`

Retrieves all plans with query options and pagination.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Query parameters (optional) |
| `params.from` | `Date` | Filter plans from this date |
| `params.to` | `Date` | Filter plans until this date |
| `params.count` | `Number` | Number of records to fetch (default: `10`) |
| `params.skip` | `Number` | Number of records to skip (default: `0`) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to an array of plan objects

**API Call:** `GET /plans`

**Notes:**
- Date parameters (`from`, `to`) are automatically normalized using `normalizeDate()` utility
- Default pagination: 10 records, starting from 0

---

## API Reference Summary

| Method | HTTP Method | Endpoint | Required Parameters |
|--------|-------------|----------|---------------------|
| `create` | POST | `/plans` | `params` |
| `fetch` | GET | `/plans/{planId}` | `planId` |
| `all` | GET | `/plans` | None |

## Related Documentation

- [Razorpay Subscriptions API Documentation](https://razorpay.com/docs/subscriptions/api/)
- [Razorpay Plans API Documentation](https://razorpay.com/docs/api/plans/)
