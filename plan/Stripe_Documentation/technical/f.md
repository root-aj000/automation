## Billing Portal Frontend Integration

The frontend calls the billing portal from **two locations**:

### 1. Primary Call - Subscription Settings Component

**File:** [`apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/subscription/subscription.tsx:334`](apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/subscription/subscription.tsx:334)

```typescript
// Called when user is blocked (payment failed)
if (isBlocked) {
  const context = subscription.isTeam || subscription.isEnterprise ? 'organization' : 'user'
  const res = await fetch('/api/billing/portal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      context,
      organizationId: activeOrgId,
      returnUrl: `${getBaseUrl()}/workspace?billing=updated`,
    }),
  })
  const data = await res.json()
  window.location.href = data.url
}
```

### 2. Secondary Call - Usage Indicator Component

**File:** [`apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/usage-indicator/usage-indicator.tsx:333`](apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/usage-indicator/usage-indicator.tsx:333)

```typescript
const response = await fetch('/api/billing/portal', {
  method: 'POST',
  // ...
})
window.open(url, '_blank')  // Opens in new tab
```

### Backend API Route

**File:** [`apps/sim/app/api/billing/portal/route.ts`](apps/sim/app/api/billing/portal/route.ts)

**Endpoint:** `POST /api/billing/portal`

**Request Body:**
```typescript
{
  context: 'user' | 'organization',  // Billing context
  organizationId?: string,            // Required if context is 'organization'
  returnUrl?: string                  // URL to return after portal session
}
```

**Response:**
```typescript
{ url: string }  // Stripe billing portal URL
```

**Flow:**
```
Frontend Component                    Backend API                    Stripe
       │                                  │                            │
       │  POST /api/billing/portal        │                            │
       │─────────────────────────────────▶│                            │
       │                                  │                            │
       │                                  │  Get stripeCustomerId       │
       │                                  │  from DB                    │
       │                                  │                            │
       │                                  │  billingPortal.sessions.create()
       │                                  │───────────────────────────▶│
       │                                  │                            │
       │                                  │  Return portal URL         │
       │                                  │◀───────────────────────────│
       │                                  │                            │
       │  { url: "https://billing.stripe.com/..." }                   │
       │◀─────────────────────────────────│                            │
       │                                  │                            │
       │  window.location.href = url      │                            │
       │  (or window.open for new tab)    │                            │
       │─────────────────────────────────────────────────────────────▶│
       │                                  │                            │
```

### When Billing Portal is Opened

1. **When account is blocked** (payment failed) - Shows "Fix Now" button
2. **When user wants to manage subscription** - From settings modal
3. **For usage limit issues** - Opens in new tab
