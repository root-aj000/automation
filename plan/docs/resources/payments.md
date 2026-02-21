# Payments API

> **Source:** [`resources/payments.js`](../../resources/payments.js)

The Payments API provides comprehensive methods for managing payments in Razorpay. This includes payment creation, capture, refunds, transfers, and various utility methods for payment operations.

## API Base

- **Base URL:** `/payments`

## Methods

### `razorpay.payments.all(params, callback)`

Retrieves all payments with query options and pagination.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Query parameters (optional) |
| `params.from` | `Date` | Filter payments from this date |
| `params.to` | `Date` | Filter payments until this date |
| `params.count` | `Number` | Number of records to fetch (default: `10`) |
| `params.skip` | `Number` | Number of records to skip (default: `0`) |
| `params["expand[]"]` | `String` | Expand related entities |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to an array of payment objects

**API Call:** `GET /payments`

**Notes:**
- Date parameters (`from`, `to`) are automatically normalized using `normalizeDate()` utility
- Default pagination: 10 records, starting from 0

---

### `razorpay.payments.fetch(paymentId, params, callback)`

Retrieves details of a specific payment.

| Parameter | Type | Description |
|-----------|------|-------------|
| `paymentId` | `String` | The ID of the payment to fetch (**Required**) |
| `params` | `Object` | Query parameters (optional) |
| `params["expand[]"]` | `String` | Expand related entities |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the payment object

**Throws:** `Error('payment_id is mandatory')` if `paymentId` is not provided

**API Call:** `GET /payments/{paymentId}`

---

### `razorpay.payments.capture(paymentId, amount, currency, callback)`

Captures an authorized payment.

| Parameter | Type | Description |
|-----------|------|-------------|
| `paymentId` | `String` | The ID of the payment to capture (**Required**) |
| `amount` | `Number` | Amount to capture in smallest currency unit (**Required**) |
| `currency` | `String` | Currency code (optional, for backward compatibility can be callback) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the captured payment object

**Throws:** 
- `Error('payment_id is mandatory')` if `paymentId` is not provided
- `Error('amount is mandatory')` if `amount` is not provided

**API Call:** `POST /payments/{paymentId}/capture`

**Notes:** For backward compatibility, the third argument can be a callback instead of currency.

---

### `razorpay.payments.createPaymentJson(params, callback)`

Creates a payment using JSON payload.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Payment creation parameters |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the created payment object

**API Call:** `POST /payments/create/json`

---

### `razorpay.payments.createRecurringPayment(params, callback)`

Creates a recurring payment.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Recurring payment parameters |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the created payment object

**API Call:** `POST /payments/create/recurring`

---

### `razorpay.payments.edit(paymentId, params, callback)`

Updates payment details (e.g., notes).

| Parameter | Type | Description |
|-----------|------|-------------|
| `paymentId` | `String` | The ID of the payment to edit (**Required**) |
| `params` | `Object` | Parameters to update (e.g., notes) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the updated payment object

**Throws:** `Error('payment_id is mandatory')` if `paymentId` is not provided

**API Call:** `PATCH /payments/{paymentId}`

---

### Refund Operations

#### `razorpay.payments.refund(paymentId, params, callback)`

Initiates a refund for a payment.

| Parameter | Type | Description |
|-----------|------|-------------|
| `paymentId` | `String` | The ID of the payment to refund (**Required**) |
| `params` | `Object` | Refund parameters (amount, notes, etc.) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the refund object

**Throws:** `Error('payment_id is mandatory')` if `paymentId` is not provided

**API Call:** `POST /payments/{paymentId}/refund`

---

#### `razorpay.payments.fetchMultipleRefund(paymentId, params, callback)`

Fetches multiple refunds for a payment.

| Parameter | Type | Description |
|-----------|------|-------------|
| `paymentId` | `String` | The ID of the payment |
| `params` | `Object` | Query parameters (from, to, count, skip) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to an array of refund objects

**API Call:** `GET /payments/{paymentId}/refunds`

---

#### `razorpay.payments.fetchRefund(paymentId, refundId, callback)`

Fetches a specific refund for a payment.

| Parameter | Type | Description |
|-----------|------|-------------|
| `paymentId` | `String` | The ID of the payment (**Required**) |
| `refundId` | `String` | The ID of the refund (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the refund object

**Throws:** 
- `Error('payment Id is mandatory')` if `paymentId` is not provided
- `Error('refund Id is mandatory')` if `refundId` is not provided

**API Call:** `GET /payments/{paymentId}/refunds/{refundId}`

---

### Transfer Operations

#### `razorpay.payments.fetchTransfer(paymentId, callback)`

Fetches all transfers for a payment.

| Parameter | Type | Description |
|-----------|------|-------------|
| `paymentId` | `String` | The ID of the payment (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to an array of transfer objects

**Throws:** `Error('payment Id is mandatory')` if `paymentId` is not provided

**API Call:** `GET /payments/{paymentId}/transfers`

---

#### `razorpay.payments.transfer(paymentId, params, callback)`

Creates transfers for a payment.

| Parameter | Type | Description |
|-----------|------|-------------|
| `paymentId` | `String` | The ID of the payment (**Required**) |
| `params` | `Object` | Transfer parameters |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the transfer objects

**Throws:** `Error('payment_id is mandatory')` if `paymentId` is not provided

**API Call:** `POST /payments/{paymentId}/transfers`

---

### Payment Details

#### `razorpay.payments.bankTransfer(paymentId, callback)`

Fetches bank transfer details for a payment.

| Parameter | Type | Description |
|-----------|------|-------------|
| `paymentId` | `String` | The ID of the payment (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to bank transfer details

**Throws:** `Promise.reject('payment_id is mandatory')` if `paymentId` is not provided

**API Call:** `GET /payments/{paymentId}/bank_transfer`

---

#### `razorpay.payments.fetchCardDetails(paymentId, callback)`

Fetches card details for a payment.

| Parameter | Type | Description |
|-----------|------|-------------|
| `paymentId` | `String` | The ID of the payment (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to card details

**Throws:** `Promise.reject('payment_id is mandatory')` if `paymentId` is not provided

**API Call:** `GET /payments/{paymentId}/card`

---

### Downtime Management

#### `razorpay.payments.fetchPaymentDowntime(callback)`

Fetches all payment gateway downtimes.

| Parameter | Type | Description |
|-----------|------|-------------|
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to downtime information

**API Call:** `GET /payments/downtimes`

---

#### `razorpay.payments.fetchPaymentDowntimeById(downtimeId, callback)`

Fetches a specific downtime by ID.

| Parameter | Type | Description |
|-----------|------|-------------|
| `downtimeId` | `String` | The ID of the downtime (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the downtime details

**Throws:** `Promise.reject('Downtime Id is mandatory')` if `downtimeId` is not provided

**API Call:** `GET /payments/downtimes/{downtimeId}`

---

### OTP Operations

#### `razorpay.payments.otpGenerate(paymentId, callback)`

Generates an OTP for a payment.

| Parameter | Type | Description |
|-----------|------|-------------|
| `paymentId` | `String` | The ID of the payment (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the OTP generation response

**Throws:** `Promise.reject('payment Id is mandatory')` if `paymentId` is not provided

**API Call:** `POST /payments/{paymentId}/otp_generate`

---

#### `razorpay.payments.otpSubmit(paymentId, params, callback)`

Submits an OTP for payment verification.

| Parameter | Type | Description |
|-----------|------|-------------|
| `paymentId` | `String` | The ID of the payment (**Required**) |
| `params` | `Object` | OTP parameters (contains the OTP value) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the verification response

**Throws:** `Promise.reject('payment Id is mandatory')` if `paymentId` is not provided

**API Call:** `POST /payments/{paymentId}/otp/submit`

---

#### `razorpay.payments.otpResend(paymentId, callback)`

Resends an OTP for a payment.

| Parameter | Type | Description |
|-----------|------|-------------|
| `paymentId` | `String` | The ID of the payment (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the OTP resend response

**Throws:** `Promise.reject('payment Id is mandatory')` if `paymentId` is not provided

**API Call:** `POST /payments/{paymentId}/otp/resend`

---

### UPI Operations

#### `razorpay.payments.createUpi(params, callback)`

Initiates a UPI payment.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | UPI payment parameters |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the UPI payment object

**API Call:** `POST /payments/create/upi`

---

#### `razorpay.payments.validateVpa(params, callback)`

Validates a VPA (Virtual Payment Address).

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | VPA validation parameters |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the validation response

**API Call:** `POST /payments/validate/vpa`

---

### Utility Methods

#### `razorpay.payments.fetchPaymentMethods(callback)`

Fetches all available payment methods.

| Parameter | Type | Description |
|-----------|------|-------------|
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to available payment methods

**API Call:** `GET /methods`

---

## API Reference Summary

| Method | HTTP Method | Endpoint | Required Parameters |
|--------|-------------|----------|---------------------|
| `all` | GET | `/payments` | None |
| `fetch` | GET | `/payments/{paymentId}` | `paymentId` |
| `capture` | POST | `/payments/{paymentId}/capture` | `paymentId`, `amount` |
| `createPaymentJson` | POST | `/payments/create/json` | `params` |
| `createRecurringPayment` | POST | `/payments/create/recurring` | `params` |
| `edit` | PATCH | `/payments/{paymentId}` | `paymentId`, `params` |
| `refund` | POST | `/payments/{paymentId}/refund` | `paymentId` |
| `fetchMultipleRefund` | GET | `/payments/{paymentId}/refunds` | `paymentId` |
| `fetchRefund` | GET | `/payments/{paymentId}/refunds/{refundId}` | `paymentId`, `refundId` |
| `fetchTransfer` | GET | `/payments/{paymentId}/transfers` | `paymentId` |
| `transfer` | POST | `/payments/{paymentId}/transfers` | `paymentId` |
| `bankTransfer` | GET | `/payments/{paymentId}/bank_transfer` | `paymentId` |
| `fetchCardDetails` | GET | `/payments/{paymentId}/card` | `paymentId` |
| `fetchPaymentDowntime` | GET | `/payments/downtimes` | None |
| `fetchPaymentDowntimeById` | GET | `/payments/downtimes/{downtimeId}` | `downtimeId` |
| `otpGenerate` | POST | `/payments/{paymentId}/otp_generate` | `paymentId` |
| `otpSubmit` | POST | `/payments/{paymentId}/otp/submit` | `paymentId`, `params` |
| `otpResend` | POST | `/payments/{paymentId}/otp/resend` | `paymentId` |
| `createUpi` | POST | `/payments/create/upi` | `params` |
| `validateVpa` | POST | `/payments/validate/vpa` | `params` |
| `fetchPaymentMethods` | GET | `/methods` | None |

## Related Documentation

- [Razorpay Payments API Documentation](https://razorpay.com/docs/api/payments/)
