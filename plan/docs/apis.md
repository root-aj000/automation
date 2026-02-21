# Razorpay API Reference

## Accounts

- `razorpay.accounts.create(params, callback)`
- `razorpay.accounts.edit(accountId, params, callback)`
- `razorpay.accounts.fetch(accountId, callback)`
- `razorpay.accounts.delete(accountId, callback)`
- `razorpay.accounts.uploadAccountDoc(accountId, params, callback)`
- `razorpay.accounts.fetchAccountDoc(accountId, callback)`

## Addons

- `razorpay.addons.fetch(addonId, callback)`
- `razorpay.addons.delete(addonId, callback)`
- `razorpay.addons.all(params, callback)`

## Cards

- `razorpay.cards.fetch(itemId, callback)`
- `razorpay.cards.requestCardReference(params, callback)`

## Customers

- `razorpay.customers.create(params, callback)`
- `razorpay.customers.edit(customerId, params, callback)`
- `razorpay.customers.fetch(customerId, callback)`
- `razorpay.customers.all(params, callback)`
- `razorpay.customers.fetchTokens(customerId, callback)`
- `razorpay.customers.fetchToken(customerId, tokenId, callback)`
- `razorpay.customers.deleteToken(customerId, tokenId, callback)`
- `razorpay.customers.addBankAccount(customerId, params, callback)`
- `razorpay.customers.deleteBankAccount(customerId, bankId, callback)`
- `razorpay.customers.requestEligibilityCheck(params, callback)`
- `razorpay.customers.fetchEligibility(eligibilityId, callback)`

## Disputes

- `razorpay.disputes.fetch(disputeId, callback)`
- `razorpay.disputes.all(params, callback)`
- `razorpay.disputes.accept(disputeId, callback)`
- `razorpay.disputes.contest(disputeId, params, callback)`

## Documents

- `razorpay.documents.create(params, callback)`
- `razorpay.documents.fetch(documentId, callback)`

## Fund Accounts

- `razorpay.fundAccount.create(params, callback)`
- `razorpay.fundAccount.fetch(customerId, callback)`

## IINs

- `razorpay.iins.fetch(tokenIin, callback)`
- `razorpay.iins.all(params, callback)`

## Invoices

- `razorpay.invoices.create(params, callback)`
- `razorpay.invoices.edit(invoiceId, params, callback)`
- `razorpay.invoices.issue(invoiceId, callback)`
- `razorpay.invoices.delete(invoiceId, callback)`
- `razorpay.invoices.cancel(invoiceId, callback)`
- `razorpay.invoices.fetch(invoiceId, callback)`
- `razorpay.invoices.all(params, callback)`
- `razorpay.invoices.notifyBy(invoiceId, medium, callback)`

## Items

- `razorpay.items.all(params, callback)`
- `razorpay.items.fetch(itemId, callback)`
- `razorpay.items.create(params, callback)`
- `razorpay.items.edit(itemId, params, callback)`
- `razorpay.items.delete(itemId, callback)`

## Orders

- `razorpay.orders.all(params, callback)`
- `razorpay.orders.fetch(orderId, callback)`
- `razorpay.orders.create(params, callback)`
- `razorpay.orders.edit(orderId, params, callback)`
- `razorpay.orders.fetchPayments(orderId, callback)`
- `razorpay.orders.fetchTransferOrder(orderId, callback)`
- `razorpay.orders.viewRtoReview(orderId, callback)`
- `razorpay.orders.editFulfillment(orderId, params, callback)`

## Payment Links

- `razorpay.paymentLink.create(params, callback)`
- `razorpay.paymentLink.cancel(paymentLinkId, callback)`
- `razorpay.paymentLink.fetch(paymentLinkId, callback)`
- `razorpay.paymentLink.all(params, callback)`
- `razorpay.paymentLink.edit(paymentLinkId, params, callback)`
- `razorpay.paymentLink.notifyBy(paymentLinkId, medium, callback)`

## Payments

- `razorpay.payments.all(params, callback)`
- `razorpay.payments.fetch(paymentId, params, callback)`
- `razorpay.payments.capture(paymentId, amount, currency, callback)`
- `razorpay.payments.createPaymentJson(params, callback)`
- `razorpay.payments.createRecurringPayment(params, callback)`
- `razorpay.payments.edit(paymentId, params, callback)`
- `razorpay.payments.refund(paymentId, params, callback)`
- `razorpay.payments.fetchMultipleRefund(paymentId, params, callback)`
- `razorpay.payments.fetchRefund(paymentId, refundId, callback)`
- `razorpay.payments.fetchTransfer(paymentId, callback)`
- `razorpay.payments.transfer(paymentId, params, callback)`
- `razorpay.payments.bankTransfer(paymentId, callback)`
- `razorpay.payments.fetchCardDetails(paymentId, callback)`
- `razorpay.payments.fetchPaymentDowntime(callback)`
- `razorpay.payments.fetchPaymentDowntimeById(downtimeId, callback)`
- `razorpay.payments.otpGenerate(paymentId, callback)`
- `razorpay.payments.otpSubmit(paymentId, params, callback)`
- `razorpay.payments.otpResend(paymentId, callback)`
- `razorpay.payments.createUpi(params, callback)`
- `razorpay.payments.validateVpa(params, callback)`
- `razorpay.payments.fetchPaymentMethods(callback)`

## Plans

- `razorpay.plans.create(params, callback)`
- `razorpay.plans.fetch(planId, callback)`
- `razorpay.plans.all(params, callback)`

## Products

- `razorpay.products.requestProductConfiguration(accountId, params, callback)`
- `razorpay.products.edit(accountId, productId, params, callback)`
- `razorpay.products.fetch(accountId, productId, callback)`
- `razorpay.products.fetchTnc(productName, callback)`

## QR Codes

- `razorpay.qrCode.create(params, callback)`
- `razorpay.qrCode.all(params, callback)`
- `razorpay.qrCode.fetchAllPayments(qrCodeId, params, callback)`
- `razorpay.qrCode.fetch(qrCodeId, callback)`
- `razorpay.qrCode.close(qrCodeId, callback)`

## Refunds

- `razorpay.refunds.all(params, callback)`
- `razorpay.refunds.edit(refundId, params, callback)`
- `razorpay.refunds.fetch(refundId, params, callback)`

## Settlements

- `razorpay.settlements.createOndemandSettlement(params, callback)`
- `razorpay.settlements.all(params, callback)`
- `razorpay.settlements.fetch(settlementId, callback)`
- `razorpay.settlements.fetchOndemandSettlementById(settlementId, params, callback)`
- `razorpay.settlements.fetchAllOndemandSettlement(params, callback)`
- `razorpay.settlements.reports(params, callback)`

## Stakeholders

- `razorpay.stakeholders.create(accountId, params, callback)`
- `razorpay.stakeholders.edit(accountId, stakeholderId, params, callback)`
- `razorpay.stakeholders.fetch(accountId, stakeholderId, callback)`
- `razorpay.stakeholders.all(accountId, callback)`
- `razorpay.stakeholders.uploadStakeholderDoc(accountId, stakeholderId, params, callback)`
- `razorpay.stakeholders.fetchStakeholderDoc(accountId, stakeholderId, callback)`

## Subscriptions

- `razorpay.subscriptions.create(params, callback)`
- `razorpay.subscriptions.fetch(subscriptionId, callback)`
- `razorpay.subscriptions.update(subscriptionId, params, callback)`
- `razorpay.subscriptions.pendingUpdate(subscriptionId, callback)`
- `razorpay.subscriptions.cancelScheduledChanges(subscriptionId, callback)`
- `razorpay.subscriptions.pause(subscriptionId, params, callback)`
- `razorpay.subscriptions.resume(subscriptionId, params, callback)`
- `razorpay.subscriptions.deleteOffer(subscriptionId, offerId, callback)`
- `razorpay.subscriptions.all(params, callback)`
- `razorpay.subscriptions.cancel(subscriptionId, cancelAtCycleEnd, callback)`
- `razorpay.subscriptions.createAddon(subscriptionId, params, callback)`
- `razorpay.subscriptions.createRegistrationLink(params, callback)`

## Tokens

- `razorpay.tokens.create(params, callback)`
- `razorpay.tokens.fetch(params, callback)`
- `razorpay.tokens.delete(params, callback)`
- `razorpay.tokens.processPaymentOnAlternatePAorPG(params, callback)`

## Transfers

- `razorpay.transfers.all(params, callback)`
- `razorpay.transfers.fetch(transferId, params, callback)`
- `razorpay.transfers.create(params, callback)`
- `razorpay.transfers.edit(transferId, params, callback)`
- `razorpay.transfers.reverse(transferId, params, callback)`
- `razorpay.transfers.fetchSettlements(callback)`

## Virtual Accounts

- `razorpay.virtualAccounts.all(params, callback)`
- `razorpay.virtualAccounts.fetch(virtualAccountId, callback)`
- `razorpay.virtualAccounts.create(params, callback)`
- `razorpay.virtualAccounts.close(virtualAccountId, callback)`
- `razorpay.virtualAccounts.fetchPayments(virtualAccountId, callback)`
- `razorpay.virtualAccounts.addReceiver(virtualAccountId, params, callback)`
- `razorpay.virtualAccounts.allowedPayer(virtualAccountId, params, callback)`
- `razorpay.virtualAccounts.deleteAllowedPayer(virtualAccountId, allowedPayerId, callback)`

## Webhooks

- `razorpay.webhooks.create(params, accountId, callback)`
- `razorpay.webhooks.edit(params, webhookId, accountId, callback)`
- `razorpay.webhooks.all(params, accountId, callback)`
- `razorpay.webhooks.fetch(webhookId, accountId, callback)`
- `razorpay.webhooks.delete(webhookId, accountId, callback)`
