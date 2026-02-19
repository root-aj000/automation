# Payment Troubleshooting Guide

This guide helps you understand and resolve common payment-related issues.

---

## Quick Reference

| Problem | Most Likely Cause | Quick Fix |
|---------|-----------------|-----------|
| Payment declined | Insufficient funds or card issue | Try a different card or contact your bank |
| Can't update payment method | Browser issue | Clear cache or try different browser |
| Double charged | Duplicate submission | Check invoices, contact support |
| Missing credits | Processing delay | Wait 5 minutes, then contact support |
| Wrong subscription status | Sync delay | Refresh page, wait a few minutes |

---

## Common Issues & Solutions

### 1. Payment Declined

**What it means:** Your bank or card issuer rejected the payment.

**Possible causes:**
- Insufficient funds in your account
- Card has expired
- Card is blocked for international transactions
- Bank's fraud detection triggered
- Card has daily spending limits

**What to do:**
1. Check that your card details are correct
2. Verify you have sufficient funds
3. Try a different payment method
4. Contact your bank to authorize the transaction
5. Use a different card

**How to update your payment method:**
1. Log in to your account
2. Go to Settings → Billing
3. Click "Manage Subscription" or "Update Payment Method"
4. Enter new card details

---

### 2. Payment Failed Email Received

**What it means:** An automatic payment (like a subscription renewal) could not be processed.

**The email includes:**
- Which card was attempted (e.g., "Visa ending in 4242")
- A link to update your payment method
- Instructions to resolve the issue

**What to do:**
1. Check if your card is still valid
2. Update your payment method using the provided link
3. The system will automatically retry the payment

**Automatic retries:** Stripe will automatically attempt to charge your card again. You don't need to manually retry unless you update your payment method.

---

### 3. Credits Not Added After Purchase

**What it means:** You completed a credit purchase but the credits aren't showing in your account.

**Possible causes:**
- Processing delay
- Payment not fully completed
- Browser caching issue

**What to do:**
1. Wait 5 minutes and refresh the page
2. Check your email for a purchase confirmation
3. Check your bank statement to verify the charge
4. If confirmed but credits missing, contact support with:
   - Your account email
   - Approximate time of purchase
   - Number of credits purchased
   - Payment confirmation number (if available)

---

### 4. Subscription Not Updating

**What it means:** You changed your subscription but the changes aren't reflected.

**Possible causes:**
- Sync delay between Stripe and Sim
- Browser cache showing old data
- Payment for upgrade not completed

**What to do:**
1. Log out and log back in
2. Clear your browser cache
3. Wait 5-10 minutes for systems to sync
4. Check your email for a subscription update confirmation

---

### 5. Incorrect Amount Charged

**What it means:** The amount charged differs from what you expected.

**Possible reasons:**
- Proration (partial month charges)
- Added or removed team seats mid-cycle
- Overage charges
- Taxes applied
- Promotion code not applied correctly

**To understand your charge:**
1. Go to Settings → Billing
2. Click "View Invoices"
3. Open the invoice in question
4. Review the line items

**Proration explained:**
```
Example: You upgrade from Pro ($20/mo) to Team ($50/mo) on day 15 of a 30-day month.

Your charge:
- Remaining Pro credit: -$10 (half month unused)
- Team charge: $25 (half month of new plan)
- Net charge: $15

Your next invoice will be the full Team price: $50
```

---

### 6. Cannot Cancel Subscription

**What it means:** The cancel option isn't working or isn't visible.

**Possible causes:**
- Subscription already marked for cancellation
- Payment issue blocking cancellation
- Browser issue

**What to do:**
1. Check if you received a cancellation confirmation email
2. Try a different browser
3. Use the billing portal link in your billing settings
4. Contact support with your account email

---

### 7. Team Member Can't Access Organization

**What it means:** A team member was invited but can't access the team's resources.

**Possible causes:**
- Invitation not accepted
- Seat limit reached
- Account email mismatch

**What to do:**
1. Verify the team member accepted the invitation
2. Check the team has available seats
3. Ensure they're logging in with the correct email
4. Have them check spam folder for invitation email

---

### 8. Overage Charges Unexpected

**What it means:** You were charged for usage over your plan limit unexpectedly.

**How it works:**
- You're only charged when overage reaches a threshold (minimum amount)
- Overage is calculated based on your actual usage
- You're notified before being charged

**To prevent unexpected overage:**
1. Monitor your usage in the dashboard
2. Set up usage alerts (if available)
3. Purchase credits to cover extra usage
4. Upgrade to a higher plan with more included usage

---

### 9. Dispute / Chargeback Issues

**What it means:** You contacted your bank to reverse a charge, which starts a formal dispute process.

**Important:**
- Disputes can take 60-90 days to resolve
- Filing a dispute doesn't guarantee a refund
- We receive notification and can provide evidence

**If you filed a dispute by mistake:**
1. Contact your bank to withdraw the dispute
2. Contact our support with the details

**If you didn't recognize the charge:**
1. Check if someone else in your organization made the purchase
2. Verify the charge amount and date match your records
3. Contact support for clarification

---

### 10. Refund Not Received

**What it means:** A refund was issued but hasn't appeared in your account.

**Important timing:**
- Refunds take 5-10 business days to appear
- Some banks take longer to process
- The refund goes to the original payment method

**What to do:**
1. Check the refund confirmation email for details
2. Wait at least 10 business days
3. Check with your bank about the pending refund
4. If still not received after 10 business days, contact support with your refund confirmation number

---

## Getting Help

### Before Contacting Support

Please have the following information ready:
- Your account email address
- Description of the issue
- Any error messages you received
- Date and time of the issue
- Screenshot of the problem (if applicable)

### Contact Options

1. **In-App Support**: Click the help icon in the application
2. **Email**: Send details to the support email address
3. **Billing Portal**: Access via Settings → Billing for self-service options

### Response Times

| Issue Type | Typical Response Time |
|------------|----------------------|
| Payment failures | Within 24 hours |
| Refund requests | Within 24-48 hours |
| Billing questions | Within 24 hours |
| Disputes | Within 48-72 hours |

---

## Prevention Tips

### Avoid Payment Issues

1. **Keep payment info updated**: Update your card before it expires
2. **Monitor usage**: Check your usage regularly to avoid surprise overages
3. **Use auto-renew**: Ensure your subscription doesn't lapse
4. **Keep contact info current**: Ensure you receive all notifications

### Best Practices for Teams

1. **Designate a billing admin**: One person responsible for payment
2. **Monitor seat usage**: Remove unused seats to save money
3. **Review invoices monthly**: Catch any issues early
4. **Set up a backup payment method**: Prevent service interruption

---

## Glossary Quick Reference

| Term | Meaning |
|------|---------|
| Proration | Partial charge/credit for partial time |
| Overage | Usage beyond plan limits |
| Threshold | Minimum amount before billing |
| Webhook | Automatic notification between systems |
| Dispute | Customer challenging a charge through their bank |
