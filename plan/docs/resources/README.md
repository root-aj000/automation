# Razorpay Resources API Documentation

This directory contains comprehensive documentation for all Razorpay API resource modules.

## Available Resources

| Resource | Description | Documentation |
|----------|-------------|---------------|
| **Accounts** | Manage Razorpay accounts for merchants | [`accounts.md`](./accounts.md) |
| **Addons** | Manage subscription addons | [`addons.md`](./addons.md) |
| **Cards** | Retrieve card information and fingerprints | [`cards.md`](./cards.md) |
| **Customers** | Manage customer entities and their tokens/bank accounts | [`customers.md`](./customers.md) |
| **Disputes** | Handle payment disputes | [`disputes.md`](./disputes.md) |
| **Documents** | Upload and retrieve documents | [`documents.md`](./documents.md) |
| **Fund Accounts** | Create and manage fund accounts for payouts | [`fundAccount.md`](./fundAccount.md) |
| **IINs** | Retrieve issuer identification number details | [`iins.md`](./iins.md) |
| **Invoices** | Manage invoices and payment links | [`invoices.md`](./invoices.md) |
| **Items** | Manage line items for invoices | [`items.md`](./items.md) |
| **OAuth Token Validator** | Validation utilities for OAuth operations | [`oAuthTokenValidator.md`](./oAuthTokenValidator.md) |
| **Orders** | Create and manage orders | [`orders.md`](./orders.md) |
| **Payment Links** | Create and manage payment links | [`paymentLink.md`](./paymentLink.md) |
| **Payments** | Comprehensive payment management | [`payments.md`](./payments.md) |
| **Plans** | Define subscription billing plans | [`plans.md`](./plans.md) |
| **Products** | Configure products for accounts | [`products.md`](./products.md) |
| **QR Codes** | Create and manage QR code payments | [`qrCode.md`](./qrCode.md) |
| **Refunds** | Process and manage refunds | [`refunds.md`](./refunds.md) |
| **Settlements** | View and manage settlements | [`settlements.md`](./settlements.md) |
| **Stakeholders** | Manage stakeholders for accounts | [`stakeholders.md`](./stakeholders.md) |
| **Subscriptions** | Manage recurring billing subscriptions | [`subscriptions.md`](./subscriptions.md) |
| **Tokens** | Manage payment tokens for recurring payments | [`tokens.md`](./tokens.md) |
| **Transfers** | Split payments and transfer to linked accounts | [`transfers.md`](./transfers.md) |
| **Virtual Accounts** | Create virtual accounts for bank transfers | [`virtualAccounts.md`](./virtualAccounts.md) |
| **Webhooks** | Configure webhook notifications | [`webhooks.md`](./webhooks.md) |

## Quick Reference by Category

### Payments & Orders
- [`payments`](./payments.md) - Core payment operations
- [`orders`](./orders.md) - Order creation and management
- [`refunds`](./refunds.md) - Refund processing
- [`transfers`](./transfers.md) - Payment splitting and transfers

### Customer Management
- [`customers`](./customers.md) - Customer CRUD operations
- [`tokens`](./tokens.md) - Tokenization for recurring payments
- [`fundAccount`](./fundAccount.md) - Payout fund accounts

### Subscriptions
- [`subscriptions`](./subscriptions.md) - Subscription management
- [`plans`](./plans.md) - Billing plans
- [`addons`](./addons.md) - Subscription addons

### Invoicing
- [`invoices`](./invoices.md) - Invoice management
- [`items`](./items.md) - Line items
- [`paymentLink`](./paymentLink.md) - Payment links

### Account Management
- [`accounts`](./accounts.md) - Merchant accounts
- [`stakeholders`](./stakeholders.md) - Account stakeholders
- [`products`](./products.md) - Product configurations
- [`webhooks`](./webhooks.md) - Webhook management

### Alternative Payment Methods
- [`qrCode`](./qrCode.md) - QR code payments
- [`virtualAccounts`](./virtualAccounts.md) - Virtual bank accounts

### Utilities & Others
- [`cards`](./cards.md) - Card information
- [`disputes`](./disputes.md) - Dispute management
- [`documents`](./documents.md) - Document uploads
- [`iins`](./iins.md) - Card issuer information
- [`settlements`](./settlements.md) - Settlement reports
- [`oAuthTokenValidator`](./oAuthTokenValidator.md) - OAuth validation

## Common Patterns

### API Version
Most APIs use the default v1 API. The following resources use v2:
- `accounts` (all methods)
- `stakeholders` (all methods)
- `products` (all methods)
- `webhooks` (when `accountId` is provided)

### Pagination
List endpoints (`all()` methods) support pagination with:
- `count` - Number of records (default: 10)
- `skip` - Records to skip (default: 0)

### Date Normalization
Date parameters (`from`, `to`) are automatically normalized to Unix timestamps using the `normalizeDate()` utility function.

## Source Files

All documentation is generated from source files in the [`resources/`](../../resources/) directory.
