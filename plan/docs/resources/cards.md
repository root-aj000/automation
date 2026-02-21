# Cards API

> **Source:** [`resources/cards.js`](../../resources/cards.js)

The Cards API provides methods for retrieving card information and requesting card references in Razorpay.

## Methods

### `razorpay.cards.fetch(itemId, callback)`

Fetches card details for a given card ID.

| Parameter | Type | Description |
|-----------|------|-------------|
| `itemId` | `String` | The card ID to fetch (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the card object

**Throws:** `Error('card_id is mandatory')` if `itemId` is not provided

**API Call:** `GET /cards/{itemId}`

---

### `razorpay.cards.requestCardReference(params, callback)`

Requests a card reference using fingerprint.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Parameters for the card reference request |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the card reference object

**API Call:** `POST /cards/fingerprints`

---

## API Reference Summary

| Method | HTTP Method | Endpoint | Required Parameters |
|--------|-------------|----------|---------------------|
| `fetch` | GET | `/cards/{itemId}` | `itemId` |
| `requestCardReference` | POST | `/cards/fingerprints` | `params` |

## Related Documentation

- [Razorpay Cards API Documentation](https://razorpay.com/docs/api/cards/)
