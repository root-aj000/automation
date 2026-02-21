# Fund Accounts API

> **Source:** [`resources/fundAccount.js`](../../resources/fundAccount.js)

The Fund Accounts API provides methods for creating and managing fund accounts in Razorpay. Fund accounts are used to hold funds for payouts and transfers.

## Methods

### `razorpay.fundAccount.create(params, callback)`

Creates a new fund account.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Fund account creation parameters |
| `params.customer_id` | `String` | Customer ID to link the fund account |
| `params.account_type` | `String` | Type of account (e.g., `bank_account`, `vpa`) |
| `params.bank_account` | `Object` | Bank account details (if account_type is `bank_account`) |
| `params.vpa` | `Object` | VPA details (if account_type is `vpa`) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the created fund account object

**API Call:** `POST /fund_accounts`

---

### `razorpay.fundAccount.fetch(customerId, callback)`

Fetches all fund accounts associated with a customer.

| Parameter | Type | Description |
|-----------|------|-------------|
| `customerId` | `String` | The ID of the customer (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to an array of fund account objects

**Throws:** `Promise.reject("Customer Id is mandatroy")` if `customerId` is not provided

**API Call:** `GET /fund_accounts?customer_id={customerId}`

---

## API Reference Summary

| Method | HTTP Method | Endpoint | Required Parameters |
|--------|-------------|----------|---------------------|
| `create` | POST | `/fund_accounts` | `params` |
| `fetch` | GET | `/fund_accounts?customer_id={customerId}` | `customerId` |

## Related Documentation

- [Razorpay Fund Accounts API Documentation](https://razorpay.com/docs/api/fund-accounts/)
- [Razorpay Payouts Documentation](https://razorpay.com/docs/payouts/)
