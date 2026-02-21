# OAuth Token Validator

> **Source:** [`resources/oAuthTokenValidator.js`](../../resources/oAuthTokenValidator.js)

The OAuth Token Validator is a utility module that provides validation functionality for OAuth token-related operations. It contains validation schemas and a validation function to ensure input parameters meet the required criteria.

## Module Overview

This module exports validation schemas and a validation function used across OAuth-related API operations.

---

## Exports

### `SCHEMAS`

An object containing validation schemas for different OAuth operations.

#### Schema: `generateAuthUrl`

Validation schema for generating authorization URL.

| Field | Error Message |
|-------|---------------|
| `client_id` | `"client_id is empty"` |
| `response_type` | `"response_type is empty"` |
| `redirect_uri` | `"redirect_uri is empty"` |
| `scope` | `"scope is empty"` |
| `state` | `"state is empty"` |

#### Schema: `getAccessToken`

Validation schema for obtaining access token.

| Field | Error Message |
|-------|---------------|
| `client_id` | `"client_id is empty"` |
| `client_secret` | `"client_secret is empty"` |
| `grant_type` | `"grant_type is empty"` |
| `redirect_uri` | `"redirect_uri is empty"` |
| `code` | `"code is empty"` |

#### Schema: `refreshToken`

Validation schema for refreshing tokens.

| Field | Error Message |
|-------|---------------|
| `client_id` | `"client_id is empty"` |
| `client_secret` | `"client_secret is empty"` |
| `grant_type` | `"grant_type is empty"` |
| `refresh_token` | `"refresh_token is empty"` |

#### Schema: `revokeToken`

Validation schema for revoking tokens.

| Field | Error Message |
|-------|---------------|
| `client_id` | `"client_id is empty"` |
| `client_secret` | `"client_secret is empty"` |
| `token_type_hint` | `"token_type_hint is empty"` |
| `token` | `"token is empty"` |

---

### `validateInput(inputData, schema)`

Validates input data against a given schema.

| Parameter | Type | Description |
|-----------|------|-------------|
| `inputData` | `Object` | The data object to validate |
| `schema` | `Object` | The validation schema to use |

**Returns:** `Object` - An errors object containing field names as keys and error messages as values

#### Validation Rules

The function performs the following validations:

1. **Empty Check**: Verifies that required fields exist and are not empty strings
2. **URL Validation**: For `redirect_uri` field, validates that it's a valid URL
3. **Client ID Format**: For `client_id` field, validates it matches pattern `/^[A-Za-z0-9]{1,14}$/`
4. **Grant Type Validation**: For `grant_type` field, validates it's either `"refresh_token"` or `"authorization_code"`

#### Example Usage

```javascript
const { validateInput, SCHEMAS } = require('./oAuthTokenValidator');

const inputData = {
  client_id: 'test_client',
  redirect_uri: 'https://example.com/callback',
  response_type: 'code',
  scope: 'read_write',
  state: 'random_state'
};

const errors = validateInput(inputData, SCHEMAS.generateAuthUrl);

if (Object.keys(errors).length > 0) {
  console.log('Validation errors:', errors);
}
```

---

## Dependencies

- [`isValidUrl`](../utils/razorpay-utils.md) - Utility function from `../utils/razorpay-utils` for URL validation

---

## Related Documentation

- [Razorpay OAuth Documentation](https://razorpay.com/docs/api/oauth/)
