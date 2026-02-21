# IINs API

> **Source:** [`resources/iins.js`](../../resources/iins.js)

The IINs (Issuer Identification Numbers) API provides methods for retrieving information about card issuers. IINs are the first 6-8 digits of a card number that identify the card issuer.

## API Base

- **Base URL:** `/iins`

## Methods

### `razorpay.iins.fetch(tokenIin, callback)`

Fetches details for a specific IIN.

| Parameter | Type | Description |
|-----------|------|-------------|
| `tokenIin` | `String` | The IIN to fetch details for |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the IIN details object containing issuer information

**API Call:** `GET /iins/{tokenIin}`

---

### `razorpay.iins.all(params, callback)`

Retrieves a list of all IINs with optional filtering.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Query parameters (optional) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to an array of IIN objects

**API Call:** `GET /iins/list`

---

## API Reference Summary

| Method | HTTP Method | Endpoint | Required Parameters |
|--------|-------------|----------|---------------------|
| `fetch` | GET | `/iins/{tokenIin}` | `tokenIin` |
| `all` | GET | `/iins/list` | None |

## Related Documentation

- [Razorpay IINs API Documentation](https://razorpay.com/docs/api/iins/)
