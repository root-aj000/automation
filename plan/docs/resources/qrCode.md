# QR Codes API

> **Source:** [`resources/qrCode.js`](../../resources/qrCode.js)

The QR Codes API provides methods for managing QR code-based payments in Razorpay. QR codes allow merchants to accept payments by displaying a QR code that customers can scan.

## API Base

- **Base URL:** `/payments/qr_codes`

## Methods

### `razorpay.qrCode.create(params, callback)`

Creates a new QR code for accepting payments.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | QR code creation parameters |
| `params.type` | `String` | QR code type (`upi_qr`) |
| `params.name` | `String` | Name for the QR code |
| `params.usage` | `String` | Usage type (`single_use` or `multiple_use`) |
| `params.fixed_amount` | `Boolean` | Whether amount is fixed |
| `params.amount` | `Number` | Amount in smallest currency unit (if fixed_amount is true) |
| `params.currency` | `String` | Currency code (default: `INR`) |
| `params.description` | `String` | QR code description |
| `params.customer_id` | `String` | Customer ID for closed QR codes |
| `params.notes` | `Object` | Key-value pairs for notes |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the created QR code object

**API Call:** `POST /payments/qr_codes`

---

### `razorpay.qrCode.all(params, callback)`

Retrieves all QR codes with query options and pagination.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Query parameters (optional) |
| `params.from` | `Date` | Filter QR codes from this date |
| `params.to` | `Date` | Filter QR codes until this date |
| `params.count` | `Number` | Number of records to fetch |
| `params.skip` | `Number` | Number of records to skip |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to an array of QR code objects

**API Call:** `GET /payments/qr_codes`

---

### `razorpay.qrCode.fetchAllPayments(qrCodeId, params, callback)`

Retrieves all payments for a specific QR code.

| Parameter | Type | Description |
|-----------|------|-------------|
| `qrCodeId` | `String` | The ID of the QR code |
| `params` | `Object` | Query parameters (optional) |
| `params.from` | `Date` | Filter payments from this date |
| `params.to` | `Date` | Filter payments until this date |
| `params.count` | `Number` | Number of records to fetch |
| `params.skip` | `Number` | Number of records to skip |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to an array of payment objects

**API Call:** `GET /payments/qr_codes/{qrCodeId}/payments`

---

### `razorpay.qrCode.fetch(qrCodeId, callback)`

Retrieves details of a specific QR code.

| Parameter | Type | Description |
|-----------|------|-------------|
| `qrCodeId` | `String` | The ID of the QR code to fetch (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the QR code object

**Throws:** `Promise.reject("qrCode Id is mandatroy")` if `qrCodeId` is not provided

**API Call:** `GET /payments/qr_codes/{qrCodeId}`

---

### `razorpay.qrCode.close(qrCodeId, callback)`

Closes a QR code to stop accepting payments.

| Parameter | Type | Description |
|-----------|------|-------------|
| `qrCodeId` | `String` | The ID of the QR code to close (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the closed QR code object

**Throws:** `Promise.reject("qrCode Id is mandatroy")` if `qrCodeId` is not provided

**API Call:** `POST /payments/qr_codes/{qrCodeId}/close`

---

## API Reference Summary

| Method | HTTP Method | Endpoint | Required Parameters |
|--------|-------------|----------|---------------------|
| `create` | POST | `/payments/qr_codes` | `params` |
| `all` | GET | `/payments/qr_codes` | None |
| `fetchAllPayments` | GET | `/payments/qr_codes/{qrCodeId}/payments` | `qrCodeId` |
| `fetch` | GET | `/payments/qr_codes/{qrCodeId}` | `qrCodeId` |
| `close` | POST | `/payments/qr_codes/{qrCodeId}/close` | `qrCodeId` |

## Related Documentation

- [Razorpay QR Codes API Documentation](https://razorpay.com/docs/api/qr-codes/)
