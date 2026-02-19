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

## Billing Portal Scenarios - Complete Code Reference

### Scenario 1: When Account is Blocked (Payment Failed)

When a user's account is blocked due to payment failure, a "Fix Now" badge appears. Clicking it opens the billing portal.

**File:** [`apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/subscription/subscription.tsx:323-374`](apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/subscription/subscription.tsx:323)

```typescript
const handleBadgeClick = useCallback(async () => {
  // Dispute: open help modal
  if (isDispute) {
    window.dispatchEvent(new CustomEvent('open-help-modal'))
    return
  }

  // Blocked: open billing portal
  if (isBlocked) {
    try {
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
      if (!res.ok || !data?.url) {
        throw new Error(data?.error || 'Failed to start billing portal')
      }
      window.location.href = data.url
    } catch (e) {
      logger.error('Failed to open billing portal', { error: e })
      alert(e instanceof Error ? e.message : 'Failed to open billing portal')
    }
    return
  }

  // Free: upgrade to pro
  if (subscription.isFree) {
    handleUpgradeWithErrorHandling('pro')
    return
  }

  // Paid: edit usage limit
  if (permissions.canEditUsageLimit && usageLimitRef.current) {
    usageLimitRef.current.startEdit()
  }
}, [
  isDispute,
  isBlocked,
  subscription.isFree,
  subscription.isTeam,
  subscription.isEnterprise,
  activeOrgId,
  permissions.canEditUsageLimit,
  handleUpgradeWithErrorHandling,
  logger,
])
```

**Key Points:**
- Checks if account is blocked (`isBlocked` flag)
- Determines billing context (`organization` for Team/Enterprise, `user` for Pro)
- Redirects to Stripe billing portal in **same tab** (`window.location.href`)
- Includes error handling with user-friendly alert

---

### Scenario 2: For Usage Limit Issues (Opens in New Tab)

When a blocked user clicks on the usage indicator and has billing permissions, the billing portal opens in a new tab.

**File:** [`apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/usage-indicator/usage-indicator.tsx:315-359`](apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/usage-indicator/usage-indicator.tsx:315)

```typescript
const handleClick = async () => {
  try {
    if (onClick) {
      onClick()
      return
    }

    if (isDispute) {
      window.dispatchEvent(new CustomEvent('open-help-modal'))
      logger.info('Opened help modal for disputed account')
      return
    }

    if (isBlocked && userCanManageBilling) {
      try {
        const context = subscription.isTeam || subscription.isEnterprise ? 'organization' : 'user'
        const organizationId = subscriptionData?.data?.organization?.id

        const response = await fetch('/api/billing/portal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ context, organizationId }),
        })

        if (response.ok) {
          const { url } = await response.json()
          window.open(url, '_blank')
          logger.info('Opened billing portal for blocked account', { context, organizationId })
          return
        }
      } catch (portalError) {
        logger.warn('Failed to open billing portal, falling back to settings', {
          error: portalError,
        })
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-settings', { detail: { tab: 'subscription' } }))
      logger.info('Opened settings to subscription tab')
    }
  } catch (error) {
    logger.error('Failed to handle usage indicator click', { error })
  }
}
```

**Key Points:**
- Checks if user is blocked AND can manage billing (`isBlocked && userCanManageBilling`)
- Opens billing portal in **new tab** (`window.open(url, '_blank')`)
- Falls back to opening settings modal if portal fails
- Logs all actions for debugging

---

### Scenario 3: Manage Subscription from Settings

When a user wants to manage their subscription from the settings modal, the same `handleBadgeClick` function is used (see Scenario 1 above).

**Trigger Conditions:**
| Badge State | Action |
|-------------|--------|
| `isDispute` | Opens help modal |
| `isBlocked` | Opens billing portal |
| `subscription.isFree` | Shows upgrade prompt |
| Paid user | Allows editing usage limit |

---

## Backend API - Billing Portal Endpoint

**File:** [`apps/sim/app/api/billing/portal/route.ts`](apps/sim/app/api/billing/portal/route.ts)

```typescript
import { db } from '@sim/db'
import { subscription as subscriptionTable, user } from '@sim/db/schema'
import { createLogger } from '@sim/logger'
import { and, eq, or } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { requireStripeClient } from '@/lib/billing/stripe-client'
import { getBaseUrl } from '@/lib/core/utils/urls'

const logger = createLogger('BillingPortal')

export async function POST(request: NextRequest) {
  const session = await getSession()

  try {
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const context: 'user' | 'organization' =
      body?.context === 'organization' ? 'organization' : 'user'
    const organizationId: string | undefined = body?.organizationId || undefined
    const returnUrl: string = body?.returnUrl || `${getBaseUrl()}/workspace?billing=updated`

    const stripe = requireStripeClient()

    let stripeCustomerId: string | null = null

    if (context === 'organization') {
      if (!organizationId) {
        return NextResponse.json({ error: 'organizationId is required' }, { status: 400 })
      }

      const rows = await db
        .select({ customer: subscriptionTable.stripeCustomerId })
        .from(subscriptionTable)
        .where(
          and(
            eq(subscriptionTable.referenceId, organizationId),
            or(
              eq(subscriptionTable.status, 'active'),
              eq(subscriptionTable.cancelAtPeriodEnd, true)
            )
          )
        )
        .limit(1)

      stripeCustomerId = rows.length > 0 ? rows[0].customer || null : null
    } else {
      const rows = await db
        .select({ customer: user.stripeCustomerId })
        .from(user)
        .where(eq(user.id, session.user.id))
        .limit(1)

      stripeCustomerId = rows.length > 0 ? rows[0].customer || null : null
    }

    if (!stripeCustomerId) {
      logger.error('Stripe customer not found for portal session', {
        context,
        organizationId,
        userId: session.user.id,
      })
      return NextResponse.json({ error: 'Stripe customer not found' }, { status: 404 })
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl,
    })

    return NextResponse.json({ url: portal.url })
  } catch (error) {
    logger.error('Failed to create billing portal session', { error })
    return NextResponse.json({ error: 'Failed to create billing portal session' }, { status: 500 })
  }
}
```

---

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BILLING PORTAL FLOW                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐    ┌──────────────────┐    ┌─────────────────────────┐   │
│  │   Frontend   │    │   Backend API    │    │      Stripe API         │   │
│  └──────┬───────┘    └────────┬─────────┘    └────────────┬────────────┘   │
│         │                     │                           │                │
│         │  POST /api/billing/portal                      │                │
│         │  { context, organizationId, returnUrl }        │                │
│         │────────────────────▶│                           │                │
│         │                     │                           │                │
│         │                     │ Get stripeCustomerId      │                │
│         │                     │ from database             │                │
│         │                     │                           │                │
│         │                     │ billingPortal.sessions    │                │
│         │                     │ .create()                 │                │
│         │                     │──────────────────────────▶│                │
│         │                     │                           │                │
│         │                     │     { url: portal.url }   │                │
│         │                     │◀──────────────────────────│                │
│         │                     │                           │                │
│         │  { url: "https://billing.stripe.com/..." }     │                │
│         │◀────────────────────│                           │                │
│         │                     │                           │                │
│         │  window.location.href = url   (same tab)       │                │
│         │  OR window.open(url, '_blank') (new tab)       │                │
│         │─────────────────────────────────────────────────▶                │
│         │                     │                           │                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Summary Table

| Scenario | File Path | Line | Trigger | Tab Behavior |
|----------|-----------|------|---------|--------------|
| Account Blocked | `subscription.tsx` | 323-374 | `isBlocked` flag | Same tab (`window.location.href`) |
| Usage Limit Issue | `usage-indicator.tsx` | 315-359 | `isBlocked && userCanManageBilling` | New tab (`window.open`) |
| Manage Subscription | `subscription.tsx` | 323-374 | Badge click in settings | Same tab |
| Disputed Account | Both files | - | `isDispute` flag | Opens help modal (no portal) |
