# Team/Organization Billing Documentation

This document provides comprehensive documentation for team and organization billing, including seat management, usage pooling, permissions, and billing calculations.

## Table of Contents

1. [Overview](#overview)
2. [Team vs Individual Billing](#team-vs-individual-billing)
3. [Seat Management](#seat-management)
4. [Usage Pooling](#usage-pooling)
5. [Permission Model](#permission-model)
6. [Billing Calculations](#billing-calculations)
7. [Code Reference](#code-reference)
8. [API Endpoints](#api-endpoints)

---

## Overview

Team and Enterprise billing differs significantly from individual (Pro) billing. Instead of a single user with a fixed limit, organizations have multiple members sharing a pooled usage limit based on the number of seats.

### Key Differences

| Feature | Pro (Individual) | Team | Enterprise |
|---------|------------------|------|------------|
| Billing Entity | User | Organization | Organization |
| Usage Model | Individual limit | Pooled limit | Pooled limit |
| Seats | 1 | Variable (per-seat pricing) | Custom allocation |
| Credits | Stored on user | Stored on organization | Contact support |
| Billing Management | User only | Owner/Admin only | Owner/Admin only |
| Minimum Limit | Plan base | Seats × Price/seat | Custom contract |

---

## Team vs Individual Billing

### Architecture Comparison

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INDIVIDUAL (PRO) BILLING                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                         USER                                         │  │
│   │                                                                      │  │
│   │   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐              │  │
│   │   │ Subscription│   │  User Stats │   │   Credits   │              │  │
│   │   │             │   │             │   │             │              │  │
│   │   │ plan: pro   │   │ usageLimit  │   │ balance     │              │  │
│   │   │ status:     │   │ currentCost │   │             │              │  │
│   │   │   active    │   │             │   │             │              │  │
│   │   └─────────────┘   └─────────────┘   └─────────────┘              │  │
│   │                                                                      │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│   Usage Limit: $50 (plan base) + credits                                   │
│   All data stored on user entity                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                    TEAM BILLING                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                      ORGANIZATION                                    │  │
│   │                                                                      │  │
│   │   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐              │  │
│   │   │ Subscription│   │Organization │   │   Credits   │              │  │
│   │   │             │   │   Record    │   │             │              │  │
│   │   │ plan: team  │   │             │   │ balance     │              │  │
│   │   │ seats: 5    │   │ orgUsage    │   │             │              │  │
│   │   │ status:     │   │   Limit     │   │             │              │  │
│   │   │   active    │   │             │   │             │              │  │
│   │   └─────────────┘   └─────────────┘   └─────────────┘              │  │
│   │                                                                      │  │
│   │   ┌─────────────────────────────────────────────────────────────┐   │  │
│   │   │                      MEMBERS                                 │   │  │
│   │   │                                                              │   │  │
│   │   │   Member 1       Member 2       Member 3       Member 4    │   │  │
│   │   │   (Owner)        (Admin)        (Member)       (Member)    │   │  │
│   │   │      │              │              │              │        │   │  │
│   │   │      └──────────────┴──────────────┴──────────────┘        │   │  │
│   │   │                           │                                 │   │  │
│   │   │                    Individual Usage                         │   │  │
│   │   │                    (tracked separately)                     │   │  │
│   │   │                                                              │   │  │
│   │   └─────────────────────────────────────────────────────────────┘   │  │
│   │                                                                      │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│   Usage Limit: 5 seats × $40 = $200 (minimum) + credits                   │
│   All members share pooled limit                                           │
│   Credits stored on organization                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Seat Management

### Seat Concepts

| Term | Definition |
|------|------------|
| **Licensed Seats** | Number of seats paid for via Stripe (subscription.seats) |
| **Used Seats** | Number of actual members in the organization |
| **Available Seats** | Licensed Seats - Used Seats |
| **Effective Seats** | For Enterprise: metadata.seats (allocated), For Team: subscription.seats |

### Seat Management Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      SEAT MANAGEMENT FLOW                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ADD SEATS                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                                                                      │  │
│   │   1. Admin updates subscription in Stripe Billing Portal            │  │
│   │   2. Stripe sends subscription.updated webhook                      │  │
│   │   3. Database updates subscription.seats                            │  │
│   │   4. Organization usage limit recalculated                          │  │
│   │                                                                      │  │
│   │   Before: 3 seats × $40 = $120 minimum                              │  │
│   │   After:  5 seats × $40 = $200 minimum                              │  │
│   │                                                                      │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│   ADD MEMBER                                                                │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                                                                      │  │
│   │   1. Admin invites new member                                       │  │
│   │   2. Member accepts invitation                                      │  │
│   │   3. Member record created                                          │  │
│   │   4. Used seats increases                                           │  │
│   │                                                                      │  │
│   │   Note: Can add members up to licensed seats                        │  │
│   │   If used > licensed, block new invitations                         │  │
│   │                                                                      │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│   REMOVE MEMBER                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                                                                      │  │
│   │   1. Admin removes member                                           │  │
│   │   2. Member record deleted                                          │  │
│   │   3. Their usage preserved in departedMemberUsage                   │  │
│   │   4. Used seats decreases                                           │  │
│   │                                                                      │  │
│   │   Note: Usage is preserved for billing                              │  │
│   │   Seats remain licensed until changed in Stripe                     │  │
│   │                                                                      │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Seat Validation Code

```typescript
// Check if organization can add more members
async function canAddMember(organizationId: string): Promise<boolean> {
  const subscription = await getOrganizationSubscription(organizationId)
  const memberCount = await db
    .select({ count: sql`count(*)` })
    .from(member)
    .where(eq(member.organizationId, organizationId))

  const licensedSeats = subscription?.seats ?? 0
  const usedSeats = memberCount[0].count

  return usedSeats < licensedSeats
}
```

---

## Usage Pooling

### How Pooling Works

All members in an organization share a single pooled usage limit. Individual usage is tracked, but the limit applies to the total.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      USAGE POOLING EXAMPLE                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Organization: Team Plan, 5 seats                                         │
│   Usage Limit: 5 × $40 = $200                                              │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                                                                      │  │
│   │   Member Usage:                                                      │  │
│   │   ┌─────────────┬─────────────┬──────────────────────┐              │  │
│   │   │   Member    │   Usage     │   % of Total         │              │  │
│   │   ├─────────────┼─────────────┼──────────────────────┤              │  │
│   │   │   Alice     │   $75       │   37.5%              │              │  │
│   │   │   Bob       │   $45       │   22.5%              │              │  │
│   │   │   Charlie   │   $30       │   15%                │              │  │
│   │   │   Diana     │   $25       │   12.5%              │              │  │
│   │   │   Eve       │   $15       │   7.5%               │              │  │
│   │   ├─────────────┼─────────────┼──────────────────────┤              │  │
│   │   │   TOTAL     │   $190      │   95%                │              │  │
│   │   └─────────────┴─────────────┴──────────────────────┘              │  │
│   │                                                                      │  │
│   │   Usage Limit: $200                                                  │  │
│   │   Remaining: $10                                                     │  │
│   │                                                                      │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│   Note: Even though Alice used $75 (which would exceed Pro limit of $50),  │
│   the organization is still under the pooled limit of $200.                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Departed Member Usage

When a member leaves, their usage is preserved for accurate billing:

```typescript
// In organization table
departedMemberUsage: string  // Tracks usage from departed members

// When member is removed
async function removeMember(organizationId: string, userId: string) {
  // Get their current usage
  const userUsage = await db
    .select({ currentPeriodCost: userStats.currentPeriodCost })
    .from(userStats)
    .where(eq(userStats.userId, userId))

  // Add to departed usage
  await db
    .update(organization)
    .set({
      departedMemberUsage: sql`${organization.departedMemberUsage} + ${userUsage[0].currentPeriodCost}`
    })
    .where(eq(organization.id, organizationId))

  // Remove member
  await db.delete(member).where(eq(member.userId, userId))
}
```

---

## Permission Model

### Billing Permissions

| Role | View Billing | Manage Subscription | Purchase Credits | Update Usage Limit |
|------|--------------|---------------------|------------------|-------------------|
| Owner | ✅ | ✅ | ✅ | ✅ |
| Admin | ✅ | ✅ | ✅ | ✅ |
| Member | ❌ | ❌ | ❌ | ❌ |

### Permission Check Functions

**File:** [`apps/sim/lib/billing/credits/balance.ts:188-197`](apps/sim/lib/billing/credits/balance.ts:188)

```typescript
export async function isOrgAdmin(userId: string, organizationId: string): Promise<boolean> {
  const memberRows = await db
    .select({ role: member.role })
    .from(member)
    .where(and(eq(member.organizationId, organizationId), eq(member.userId, userId)))
    .limit(1)

  if (memberRows.length === 0) return false
  return memberRows[0].role === 'owner' || memberRows[0].role === 'admin'
}
```

**File:** [`apps/sim/lib/billing/core/organization.ts:347-368`](apps/sim/lib/billing/core/organization.ts:347)

```typescript
export async function isOrganizationOwnerOrAdmin(
  userId: string,
  organizationId: string
): Promise<boolean> {
  const memberRecord = await db
    .select({ role: member.role })
    .from(member)
    .where(and(eq(member.userId, userId), eq(member.organizationId, organizationId)))
    .limit(1)

  if (memberRecord.length === 0) {
    return false
  }

  const userRole = memberRecord[0].role
  return ['owner', 'admin'].includes(userRole)
}
```

---

## Billing Calculations

### Minimum Billing Amount

```typescript
// Team Plan
minimumBillingAmount = licensedSeats * pricePerSeat
// Example: 5 seats × $40 = $200

// Enterprise Plan
minimumBillingAmount = configuredLimit  // From orgUsageLimit
```

### Total Usage Limit

```typescript
// Team Plan
const configuredLimit = organization.orgUsageLimit
totalUsageLimit = Math.max(configuredLimit, minimumBillingAmount)

// Enterprise Plan
totalUsageLimit = configuredLimit  // Fixed, matches monthly cost
```

### Overage Calculation

```
Total Overage = Total Current Usage - Total Usage Limit

Where:
  Total Current Usage = Sum of all member usage + departedMemberUsage
  Total Usage Limit = max(orgUsageLimit, minimumBillingAmount)
```

---

## Code Reference

### File Locations

| File | Purpose |
|------|---------|
| [`lib/billing/core/organization.ts`](apps/sim/lib/billing/core/organization.ts) | Organization billing data & management |
| [`lib/billing/organizations/membership.ts`](apps/sim/lib/billing/organizations/membership.ts) | Member management & billing |
| [`lib/billing/threshold-billing.ts`](apps/sim/lib/billing/threshold-billing.ts) | Organization overage billing |

### Key Functions

| Function | File | Purpose |
|----------|------|---------|
| `getOrganizationBillingData` | organization.ts:66 | Get comprehensive billing data |
| `getOrganizationSubscription` | organization.ts:14 | Get org subscription |
| `updateOrganizationUsageLimit` | organization.ts:200 | Update org usage limit |
| `getOrganizationBillingSummary` | organization.ts:282 | Get admin dashboard summary |
| `isOrganizationOwnerOrAdmin` | organization.ts:347 | Check billing permission |
| `checkAndBillOrganizationOverageThreshold` | threshold-billing.ts:277 | Bill org overage |

---

## API Endpoints

### Get Organization Billing Data

**Endpoint:** `GET /api/organizations/{id}/billing`

**Response:**
```json
{
  "organizationId": "org_xxx",
  "organizationName": "Acme Inc",
  "subscriptionPlan": "team",
  "subscriptionStatus": "active",
  "totalSeats": 5,
  "usedSeats": 4,
  "seatsCount": 5,
  "totalCurrentUsage": 190.00,
  "totalUsageLimit": 200.00,
  "minimumBillingAmount": 200.00,
  "averageUsagePerMember": 47.50,
  "billingPeriodStart": "2026-02-01T00:00:00Z",
  "billingPeriodEnd": "2026-03-01T00:00:00Z",
  "members": [
    {
      "userId": "user_1",
      "userName": "Alice",
      "userEmail": "alice@example.com",
      "currentUsage": 75.00,
      "usageLimit": 200.00,
      "percentUsed": 37.5,
      "isOverLimit": false,
      "role": "owner",
      "joinedAt": "2026-01-01T00:00:00Z",
      "lastActive": "2026-02-15T00:00:00Z"
    }
  ]
}
```

### Update Organization Usage Limit

**Endpoint:** `POST /api/organizations/{id}/usage-limit`

**Request Body:**
```json
{
  "limit": 500.00
}
```

**Response (Success):**
```json
{
  "success": true
}
```

**Response (Error - Below Minimum):**
```json
{
  "success": false,
  "error": "Usage limit cannot be less than minimum billing amount of $200.00"
}
```

### Get Seat Information

**Endpoint:** `GET /api/organizations/{id}/seats`

**Response:**
```json
{
  "licensedSeats": 5,
  "usedSeats": 4,
  "availableSeats": 1
}
```

---

## Summary Tables

### Plan Comparison

| Feature | Pro | Team | Enterprise |
|---------|-----|------|------------|
| Billing Entity | User | Organization | Organization |
| Pricing Model | Flat rate | Per-seat | Custom |
| Usage Model | Individual | Pooled | Pooled |
| Seat Management | N/A | Via Stripe | Allocated |
| Credit Purchase | ✅ | ✅ (Admin) | ❌ |
| Usage Limit Edit | ✅ | ✅ (Admin) | ❌ |

### Billing Flow by Plan

| Event | Pro | Team/Enterprise |
|-------|-----|-----------------|
| Payment Failure | Block single user | Block ALL members |
| Payment Success | Unblock user | Unblock ALL members |
| Overage Billing | Bill user | Bill organization |
| Usage Reset | Reset user stats | Reset ALL member stats |

---

## Related Documentation

- [Credit System Documentation](./credit-system.md)
- [Billing State Machine](./billing-state-machine.md)
- [Webhook Handler Deep Dive](./webhook-deep-dive.md)
