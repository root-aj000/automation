# Documents API

> **Source:** [`resources/documents.js`](../../resources/documents.js)

The Documents API provides methods for uploading and retrieving documents in Razorpay. Documents can be used for various purposes like KYC verification, dispute evidence, etc.

## API Base

- **Base URL:** `/documents`

## Methods

### `razorpay.documents.create(params, callback)`

Uploads a new document.

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `Object` | Document upload parameters |
| `params.file` | `Object` | File object with `value` property containing file data (**Required**) |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the created document object

**API Call:** `POST /documents` (FormData)

**Notes:**
- The file parameter should contain a `value` property with the actual file data
- Uses multipart/form-data for file upload
- Additional parameters can be passed alongside the file

---

### `razorpay.documents.fetch(documentId, callback)`

Retrieves details of a specific document.

| Parameter | Type | Description |
|-----------|------|-------------|
| `documentId` | `String` | The ID of the document to fetch |
| `callback` | `Function` | Callback function (optional) |

**Returns:** `Promise` - Resolves to the document object

**API Call:** `GET /documents/{documentId}`

---

## API Reference Summary

| Method | HTTP Method | Endpoint | Required Parameters |
|--------|-------------|----------|---------------------|
| `create` | POST | `/documents` | `params.file` |
| `fetch` | GET | `/documents/{documentId}` | `documentId` |

## Related Documentation

- [Razorpay Documents API Documentation](https://razorpay.com/docs/api/documents/)
