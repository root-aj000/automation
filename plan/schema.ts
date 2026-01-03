import { type SQL, sql } from 'drizzle-orm'
import {
  bigint,
  boolean,
  check,
  customType,
  decimal,
  doublePrecision,
  index,
  integer,
  json,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  vector,
} from 'drizzle-orm/pg-core'
import { DEFAULT_FREE_CREDITS, TAG_SLOTS } from './constants'

// Custom tsvector type for full-text search
export const tsvector = customType<{
  data: string
}>({
  dataType() {
    return `tsvector`
  },
})

// ============================================
// ENUMS
// ============================================

export const tenantStatusEnum = pgEnum('tenant_status', ['active', 'suspended', 'deleted'])

export const notificationTypeEnum = pgEnum('notification_type', ['webhook', 'email', 'slack'])

export const notificationDeliveryStatusEnum = pgEnum('notification_delivery_status', [
  'pending',
  'in_progress',
  'success',
  'failed',
])

export const billingBlockedReasonEnum = pgEnum('billing_blocked_reason', [
  'payment_failed',
  'dispute',
])

export const permissionTypeEnum = pgEnum('permission_type', ['admin', 'write', 'read'])

export const workspaceInvitationStatusEnum = pgEnum('workspace_invitation_status', [
  'pending',
  'accepted',
  'rejected',
  'cancelled',
])

export const templateStatusEnum = pgEnum('template_status', ['pending', 'approved', 'rejected'])

export const templateCreatorTypeEnum = pgEnum('template_creator_type', ['user', 'organization'])

export const usageLogCategoryEnum = pgEnum('usage_log_category', ['model', 'fixed'])

export const usageLogSourceEnum = pgEnum('usage_log_source', ['workflow', 'wand', 'copilot'])

// ============================================
// TENANT - Top Level Isolation Entity
// ============================================

export const tenant = pgTable(
  'tenant',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    status: tenantStatusEnum('status').notNull().default('active'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => ({
    slugIdx: uniqueIndex('tenant_slug_idx').on(table.slug),
    statusIdx: index('tenant_status_idx').on(table.status),
    deletedAtIdx: index('tenant_deleted_at_idx').on(table.deletedAt),
  })
)

// ============================================
// USER & AUTHENTICATION
// ============================================

export const user = pgTable(
  'user',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull(),
    image: text('image'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    stripeCustomerId: text('stripe_customer_id'),
    isSuperUser: boolean('is_super_user').notNull().default(false),
  },
  (table) => ({
    tenantIdx: index('user_tenant_idx').on(table.tenantId),
    tenantEmailIdx: index('user_tenant_email_idx').on(table.tenantId, table.email),
  })
)

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    activeOrganizationId: text('active_organization_id').references(() => organization.id, {
      onDelete: 'set null',
    }),
  },
  (table) => ({
    tenantIdx: index('session_tenant_idx').on(table.tenantId),
    userIdIdx: index('session_user_id_idx').on(table.userId),
    tokenIdx: index('session_token_idx').on(table.token),
  })
)

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
  },
  (table) => ({
    tenantIdx: index('account_tenant_idx').on(table.tenantId),
    userIdIdx: index('account_user_id_idx').on(table.userId),
    accountProviderIdx: index('idx_account_on_account_id_provider_id').on(
      table.accountId,
      table.providerId
    ),
    uniqueUserProviderAccount: uniqueIndex('account_user_provider_account_unique').on(
      table.userId,
      table.providerId,
      table.accountId
    ),
  })
)

// Verification is global (email verification tokens)
export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at'),
  },
  (table) => ({
    identifierIdx: index('verification_identifier_idx').on(table.identifier),
    expiresAtIdx: index('verification_expires_at_idx').on(table.expiresAt),
  })
)

// ============================================
// ORGANIZATION
// ============================================

export const organization = pgTable(
  'organization',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    logo: text('logo'),
    metadata: json('metadata'),
    orgUsageLimit: decimal('org_usage_limit'),
    storageUsedBytes: bigint('storage_used_bytes', { mode: 'number' }).notNull().default(0),
    departedMemberUsage: decimal('departed_member_usage').notNull().default('0'),
    creditBalance: decimal('credit_balance').notNull().default('0'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    tenantIdx: index('organization_tenant_idx').on(table.tenantId),
    tenantSlugIdx: uniqueIndex('organization_tenant_slug_idx').on(table.tenantId, table.slug),
  })
)

export const member = pgTable(
  'member',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
    role: text('role').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    tenantIdx: index('member_tenant_idx').on(table.tenantId),
    userIdIdx: index('member_user_id_idx').on(table.userId),
    organizationIdIdx: index('member_organization_id_idx').on(table.organizationId),
  })
)

export const invitation = pgTable(
  'invitation',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    inviterId: text('inviter_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
    role: text('role').notNull(),
    status: text('status').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    tenantIdx: index('invitation_tenant_idx').on(table.tenantId),
    emailIdx: index('invitation_email_idx').on(table.email),
    organizationIdIdx: index('invitation_organization_id_idx').on(table.organizationId),
  })
)

// ============================================
// WORKSPACE
// ============================================

export const workspace = pgTable(
  'workspace',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    ownerId: text('owner_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    billedAccountUserId: text('billed_account_user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'no action' }),
    allowPersonalApiKeys: boolean('allow_personal_api_keys').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('workspace_tenant_idx').on(table.tenantId),
    ownerIdx: index('workspace_owner_idx').on(table.ownerId),
  })
)

export const workspaceEnvironment = pgTable(
  'workspace_environment',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspace.id, { onDelete: 'cascade' }),
    variables: json('variables').notNull().default('{}'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('workspace_environment_tenant_idx').on(table.tenantId),
    workspaceUnique: uniqueIndex('workspace_environment_workspace_unique').on(table.workspaceId),
  })
)

export const workspaceBYOKKeys = pgTable(
  'workspace_byok_keys',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspace.id, { onDelete: 'cascade' }),
    providerId: text('provider_id').notNull(),
    encryptedApiKey: text('encrypted_api_key').notNull(),
    createdBy: text('created_by').references(() => user.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('workspace_byok_tenant_idx').on(table.tenantId),
    workspaceProviderUnique: uniqueIndex('workspace_byok_provider_unique').on(
      table.workspaceId,
      table.providerId
    ),
    workspaceIdx: index('workspace_byok_workspace_idx').on(table.workspaceId),
  })
)

export const workspaceFile = pgTable(
  'workspace_file',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspace.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    key: text('key').notNull().unique(),
    size: integer('size').notNull(),
    type: text('type').notNull(),
    uploadedBy: text('uploaded_by')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    uploadedAt: timestamp('uploaded_at').notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('workspace_file_tenant_idx').on(table.tenantId),
    workspaceIdIdx: index('workspace_file_workspace_id_idx').on(table.workspaceId),
    keyIdx: index('workspace_file_key_idx').on(table.key),
  })
)

export const workspaceFiles = pgTable(
  'workspace_files',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    key: text('key').notNull().unique(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    workspaceId: text('workspace_id').references(() => workspace.id, { onDelete: 'cascade' }),
    context: text('context').notNull(),
    originalName: text('original_name').notNull(),
    contentType: text('content_type').notNull(),
    size: integer('size').notNull(),
    uploadedAt: timestamp('uploaded_at').notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('workspace_files_tenant_idx').on(table.tenantId),
    keyIdx: index('workspace_files_key_idx').on(table.key),
    userIdIdx: index('workspace_files_user_id_idx').on(table.userId),
    workspaceIdIdx: index('workspace_files_workspace_id_idx').on(table.workspaceId),
    contextIdx: index('workspace_files_context_idx').on(table.context),
  })
)

export type WorkspaceInvitationStatus = (typeof workspaceInvitationStatusEnum.enumValues)[number]

export const workspaceInvitation = pgTable(
  'workspace_invitation',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspace.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    inviterId: text('inviter_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    role: text('role').notNull().default('member'),
    status: workspaceInvitationStatusEnum('status').notNull().default('pending'),
    token: text('token').notNull().unique(),
    permissions: permissionTypeEnum('permissions').notNull().default('admin'),
    orgInvitationId: text('org_invitation_id'),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('workspace_invitation_tenant_idx').on(table.tenantId),
    workspaceIdx: index('workspace_invitation_workspace_idx').on(table.workspaceId),
    tokenIdx: uniqueIndex('workspace_invitation_token_idx').on(table.token),
  })
)

export const workspaceNotificationSubscription = pgTable(
  'workspace_notification_subscription',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspace.id, { onDelete: 'cascade' }),
    notificationType: notificationTypeEnum('notification_type').notNull(),
    workflowIds: text('workflow_ids').array().notNull().default(sql`'{}'::text[]`),
    allWorkflows: boolean('all_workflows').notNull().default(false),
    levelFilter: text('level_filter')
      .array()
      .notNull()
      .default(sql`ARRAY['info', 'error']::text[]`),
    triggerFilter: text('trigger_filter')
      .array()
      .notNull()
      .default(sql`ARRAY['api', 'webhook', 'schedule', 'manual', 'chat']::text[]`),
    includeFinalOutput: boolean('include_final_output').notNull().default(false),
    includeTraceSpans: boolean('include_trace_spans').notNull().default(false),
    includeRateLimits: boolean('include_rate_limits').notNull().default(false),
    includeUsageData: boolean('include_usage_data').notNull().default(false),
    webhookConfig: jsonb('webhook_config'),
    emailRecipients: text('email_recipients').array(),
    slackConfig: jsonb('slack_config'),
    alertConfig: jsonb('alert_config'),
    lastAlertAt: timestamp('last_alert_at'),
    active: boolean('active').notNull().default(true),
    createdBy: text('created_by')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('workspace_notification_tenant_idx').on(table.tenantId),
    workspaceIdIdx: index('workspace_notification_workspace_id_idx').on(table.workspaceId),
    activeIdx: index('workspace_notification_active_idx').on(table.active),
    typeIdx: index('workspace_notification_type_idx').on(table.notificationType),
  })
)

export const workspaceNotificationDelivery = pgTable(
  'workspace_notification_delivery',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    subscriptionId: text('subscription_id')
      .notNull()
      .references(() => workspaceNotificationSubscription.id, { onDelete: 'cascade' }),
    workflowId: text('workflow_id')
      .notNull()
      .references(() => workflow.id, { onDelete: 'cascade' }),
    executionId: text('execution_id').notNull(),
    status: notificationDeliveryStatusEnum('status').notNull().default('pending'),
    attempts: integer('attempts').notNull().default(0),
    lastAttemptAt: timestamp('last_attempt_at'),
    nextAttemptAt: timestamp('next_attempt_at'),
    responseStatus: integer('response_status'),
    responseBody: text('response_body'),
    errorMessage: text('error_message'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('workspace_notification_delivery_tenant_idx').on(table.tenantId),
    subscriptionIdIdx: index('workspace_notification_delivery_subscription_id_idx').on(
      table.subscriptionId
    ),
    executionIdIdx: index('workspace_notification_delivery_execution_id_idx').on(table.executionId),
    statusIdx: index('workspace_notification_delivery_status_idx').on(table.status),
    nextAttemptIdx: index('workspace_notification_delivery_next_attempt_idx').on(
      table.nextAttemptAt
    ),
  })
)

// ============================================
// USER SETTINGS & STATS
// ============================================

export const settings = pgTable(
  'settings',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' })
      .unique(),
    theme: text('theme').notNull().default('system'),
    autoConnect: boolean('auto_connect').notNull().default(true),
    telemetryEnabled: boolean('telemetry_enabled').notNull().default(true),
    emailPreferences: json('email_preferences').notNull().default('{}'),
    billingUsageNotificationsEnabled: boolean('billing_usage_notifications_enabled')
      .notNull()
      .default(true),
    showTrainingControls: boolean('show_training_controls').notNull().default(false),
    superUserModeEnabled: boolean('super_user_mode_enabled').notNull().default(true),
    errorNotificationsEnabled: boolean('error_notifications_enabled').notNull().default(true),
    snapToGridSize: integer('snap_to_grid_size').notNull().default(0),
    copilotEnabledModels: jsonb('copilot_enabled_models').notNull().default('{}'),
    copilotAutoAllowedTools: jsonb('copilot_auto_allowed_tools').notNull().default('[]'),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('settings_tenant_idx').on(table.tenantId),
    userIdIdx: uniqueIndex('settings_user_id_idx').on(table.userId),
  })
)

export const userStats = pgTable(
  'user_stats',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' })
      .unique(),
    totalManualExecutions: integer('total_manual_executions').notNull().default(0),
    totalApiCalls: integer('total_api_calls').notNull().default(0),
    totalWebhookTriggers: integer('total_webhook_triggers').notNull().default(0),
    totalScheduledExecutions: integer('total_scheduled_executions').notNull().default(0),
    totalChatExecutions: integer('total_chat_executions').notNull().default(0),
    totalTokensUsed: integer('total_tokens_used').notNull().default(0),
    totalCost: decimal('total_cost').notNull().default('0'),
    currentUsageLimit: decimal('current_usage_limit').default(DEFAULT_FREE_CREDITS.toString()),
    usageLimitUpdatedAt: timestamp('usage_limit_updated_at').defaultNow(),
    currentPeriodCost: decimal('current_period_cost').notNull().default('0'),
    lastPeriodCost: decimal('last_period_cost').default('0'),
    billedOverageThisPeriod: decimal('billed_overage_this_period').notNull().default('0'),
    proPeriodCostSnapshot: decimal('pro_period_cost_snapshot').default('0'),
    creditBalance: decimal('credit_balance').notNull().default('0'),
    totalCopilotCost: decimal('total_copilot_cost').notNull().default('0'),
    currentPeriodCopilotCost: decimal('current_period_copilot_cost').notNull().default('0'),
    lastPeriodCopilotCost: decimal('last_period_copilot_cost').default('0'),
    totalCopilotTokens: integer('total_copilot_tokens').notNull().default(0),
    totalCopilotCalls: integer('total_copilot_calls').notNull().default(0),
    storageUsedBytes: bigint('storage_used_bytes', { mode: 'number' }).notNull().default(0),
    lastActive: timestamp('last_active').notNull().defaultNow(),
    billingBlocked: boolean('billing_blocked').notNull().default(false),
    billingBlockedReason: billingBlockedReasonEnum('billing_blocked_reason'),
  },
  (table) => ({
    tenantIdx: index('user_stats_tenant_idx').on(table.tenantId),
    userIdIdx: uniqueIndex('user_stats_user_id_idx').on(table.userId),
  })
)

export const environment = pgTable(
  'environment',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' })
      .unique(),
    variables: json('variables').notNull(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('environment_tenant_idx').on(table.tenantId),
    userIdIdx: uniqueIndex('environment_user_id_idx').on(table.userId),
  })
)

// ============================================
// WORKFLOW
// ============================================

export const workflowFolder = pgTable(
  'workflow_folder',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspace.id, { onDelete: 'cascade' }),
    parentId: text('parent_id'),
    color: text('color').default('#6B7280'),
    isExpanded: boolean('is_expanded').notNull().default(true),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('workflow_folder_tenant_idx').on(table.tenantId),
    userIdx: index('workflow_folder_user_idx').on(table.userId),
    workspaceParentIdx: index('workflow_folder_workspace_parent_idx').on(
      table.workspaceId,
      table.parentId
    ),
    parentSortIdx: index('workflow_folder_parent_sort_idx').on(table.parentId, table.sortOrder),
  })
)

export const workflow = pgTable(
  'workflow',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    workspaceId: text('workspace_id').references(() => workspace.id, { onDelete: 'cascade' }),
    folderId: text('folder_id').references(() => workflowFolder.id, { onDelete: 'set null' }),
    name: text('name').notNull(),
    description: text('description'),
    color: text('color').notNull().default('#3972F6'),
    lastSynced: timestamp('last_synced').notNull(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    isDeployed: boolean('is_deployed').notNull().default(false),
    deployedAt: timestamp('deployed_at'),
    runCount: integer('run_count').notNull().default(0),
    lastRunAt: timestamp('last_run_at'),
    variables: json('variables').default('{}'),
  },
  (table) => ({
    tenantIdx: index('workflow_tenant_idx').on(table.tenantId),
    userIdIdx: index('workflow_user_id_idx').on(table.userId),
    workspaceIdIdx: index('workflow_workspace_id_idx').on(table.workspaceId),
    userWorkspaceIdx: index('workflow_user_workspace_idx').on(table.userId, table.workspaceId),
    tenantWorkspaceIdx: index('workflow_tenant_workspace_idx').on(table.tenantId, table.workspaceId),
  })
)

export const workflowBlocks = pgTable(
  'workflow_blocks',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    workflowId: text('workflow_id')
      .notNull()
      .references(() => workflow.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    name: text('name').notNull(),
    positionX: decimal('position_x').notNull(),
    positionY: decimal('position_y').notNull(),
    enabled: boolean('enabled').notNull().default(true),
    horizontalHandles: boolean('horizontal_handles').notNull().default(true),
    isWide: boolean('is_wide').notNull().default(false),
    advancedMode: boolean('advanced_mode').notNull().default(false),
    triggerMode: boolean('trigger_mode').notNull().default(false),
    height: decimal('height').notNull().default('0'),
    subBlocks: jsonb('sub_blocks').notNull().default('{}'),
    outputs: jsonb('outputs').notNull().default('{}'),
    data: jsonb('data').default('{}'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('workflow_blocks_tenant_idx').on(table.tenantId),
    workflowIdIdx: index('workflow_blocks_workflow_id_idx').on(table.workflowId),
    typeIdx: index('workflow_blocks_type_idx').on(table.type),
  })
)

export const workflowEdges = pgTable(
  'workflow_edges',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    workflowId: text('workflow_id')
      .notNull()
      .references(() => workflow.id, { onDelete: 'cascade' }),
    sourceBlockId: text('source_block_id')
      .notNull()
      .references(() => workflowBlocks.id, { onDelete: 'cascade' }),
    targetBlockId: text('target_block_id')
      .notNull()
      .references(() => workflowBlocks.id, { onDelete: 'cascade' }),
    sourceHandle: text('source_handle'),
    targetHandle: text('target_handle'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('workflow_edges_tenant_idx').on(table.tenantId),
    workflowIdIdx: index('workflow_edges_workflow_id_idx').on(table.workflowId),
    workflowSourceIdx: index('workflow_edges_workflow_source_idx').on(
      table.workflowId,
      table.sourceBlockId
    ),
    workflowTargetIdx: index('workflow_edges_workflow_target_idx').on(
      table.workflowId,
      table.targetBlockId
    ),
  })
)

export const workflowSubflows = pgTable(
  'workflow_subflows',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    workflowId: text('workflow_id')
      .notNull()
      .references(() => workflow.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    config: jsonb('config').notNull().default('{}'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('workflow_subflows_tenant_idx').on(table.tenantId),
    workflowIdIdx: index('workflow_subflows_workflow_id_idx').on(table.workflowId),
    workflowTypeIdx: index('workflow_subflows_workflow_type_idx').on(table.workflowId, table.type),
  })
)

export const workflowSchedule = pgTable(
  'workflow_schedule',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    workflowId: text('workflow_id')
      .notNull()
      .references(() => workflow.id, { onDelete: 'cascade' }),
    blockId: text('block_id').references(() => workflowBlocks.id, { onDelete: 'cascade' }),
    cronExpression: text('cron_expression'),
    nextRunAt: timestamp('next_run_at'),
    lastRanAt: timestamp('last_ran_at'),
    lastQueuedAt: timestamp('last_queued_at'),
    triggerType: text('trigger_type').notNull(),
    timezone: text('timezone').notNull().default('UTC'),
    failedCount: integer('failed_count').notNull().default(0),
    status: text('status').notNull().default('active'),
    lastFailedAt: timestamp('last_failed_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('workflow_schedule_tenant_idx').on(table.tenantId),
    workflowBlockUnique: uniqueIndex('workflow_schedule_workflow_block_unique').on(
      table.workflowId,
      table.blockId
    ),
  })
)

export const workflowDeploymentVersion = pgTable(
  'workflow_deployment_version',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    workflowId: text('workflow_id')
      .notNull()
      .references(() => workflow.id, { onDelete: 'cascade' }),
    version: integer('version').notNull(),
    name: text('name'),
    state: json('state').notNull(),
    isActive: boolean('is_active').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    createdBy: text('created_by'),
  },
  (table) => ({
    tenantIdx: index('workflow_deployment_version_tenant_idx').on(table.tenantId),
    workflowVersionUnique: uniqueIndex('workflow_deployment_version_workflow_version_unique').on(
      table.workflowId,
      table.version
    ),
    workflowActiveIdx: index('workflow_deployment_version_workflow_active_idx').on(
      table.workflowId,
      table.isActive
    ),
    createdAtIdx: index('workflow_deployment_version_created_at_idx').on(table.createdAt),
  })
)

// ============================================
// EXECUTION & RUNTIME
// ============================================

export const workflowExecutionSnapshots = pgTable(
  'workflow_execution_snapshots',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    workflowId: text('workflow_id')
      .notNull()
      .references(() => workflow.id, { onDelete: 'cascade' }),
    stateHash: text('state_hash').notNull(),
    stateData: jsonb('state_data').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('workflow_snapshots_tenant_idx').on(table.tenantId),
    workflowIdIdx: index('workflow_snapshots_workflow_id_idx').on(table.workflowId),
    stateHashIdx: index('workflow_snapshots_hash_idx').on(table.stateHash),
    workflowHashUnique: uniqueIndex('workflow_snapshots_workflow_hash_idx').on(
      table.workflowId,
      table.stateHash
    ),
    createdAtIdx: index('workflow_snapshots_created_at_idx').on(table.createdAt),
  })
)

export const workflowExecutionLogs = pgTable(
  'workflow_execution_logs',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    workflowId: text('workflow_id')
      .notNull()
      .references(() => workflow.id, { onDelete: 'cascade' }),
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspace.id, { onDelete: 'cascade' }),
    executionId: text('execution_id').notNull(),
    stateSnapshotId: text('state_snapshot_id')
      .notNull()
      .references(() => workflowExecutionSnapshots.id),
    deploymentVersionId: text('deployment_version_id').references(
      () => workflowDeploymentVersion.id,
      { onDelete: 'set null' }
    ),
    level: text('level').notNull(),
    status: text('status').notNull().default('running'),
    trigger: text('trigger').notNull(),
    startedAt: timestamp('started_at').notNull(),
    endedAt: timestamp('ended_at'),
    totalDurationMs: integer('total_duration_ms'),
    executionData: jsonb('execution_data').notNull().default('{}'),
    cost: jsonb('cost'),
    files: jsonb('files'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('workflow_execution_logs_tenant_idx').on(table.tenantId),
    workflowIdIdx: index('workflow_execution_logs_workflow_id_idx').on(table.workflowId),
    stateSnapshotIdIdx: index('workflow_execution_logs_state_snapshot_id_idx').on(
      table.stateSnapshotId
    ),
    deploymentVersionIdIdx: index('workflow_execution_logs_deployment_version_id_idx').on(
      table.deploymentVersionId
    ),
    triggerIdx: index('workflow_execution_logs_trigger_idx').on(table.trigger),
    levelIdx: index('workflow_execution_logs_level_idx').on(table.level),
    startedAtIdx: index('workflow_execution_logs_started_at_idx').on(table.startedAt),
    executionIdUnique: uniqueIndex('workflow_execution_logs_execution_id_unique').on(
      table.executionId
    ),
    workflowStartedAtIdx: index('workflow_execution_logs_workflow_started_at_idx').on(
      table.workflowId,
      table.startedAt
    ),
    workspaceStartedAtIdx: index('workflow_execution_logs_workspace_started_at_idx').on(
      table.workspaceId,
      table.startedAt
    ),
    tenantStartedAtIdx: index('workflow_execution_logs_tenant_started_at_idx').on(
      table.tenantId,
      table.startedAt
    ),
  })
)

export const pausedExecutions = pgTable(
  'paused_executions',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    workflowId: text('workflow_id')
      .notNull()
      .references(() => workflow.id, { onDelete: 'cascade' }),
    executionId: text('execution_id').notNull(),
    executionSnapshot: jsonb('execution_snapshot').notNull(),
    pausePoints: jsonb('pause_points').notNull(),
    totalPauseCount: integer('total_pause_count').notNull(),
    resumedCount: integer('resumed_count').notNull().default(0),
    status: text('status').notNull().default('paused'),
    metadata: jsonb('metadata').notNull().default(sql`'{}'::jsonb`),
    pausedAt: timestamp('paused_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    expiresAt: timestamp('expires_at'),
  },
  (table) => ({
    tenantIdx: index('paused_executions_tenant_idx').on(table.tenantId),
    workflowIdx: index('paused_executions_workflow_id_idx').on(table.workflowId),
    statusIdx: index('paused_executions_status_idx').on(table.status),
    executionUnique: uniqueIndex('paused_executions_execution_id_unique').on(table.executionId),
  })
)

export const resumeQueue = pgTable(
  'resume_queue',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    pausedExecutionId: text('paused_execution_id')
      .notNull()
      .references(() => pausedExecutions.id, { onDelete: 'cascade' }),
    parentExecutionId: text('parent_execution_id').notNull(),
    newExecutionId: text('new_execution_id').notNull(),
    contextId: text('context_id').notNull(),
    resumeInput: jsonb('resume_input'),
    status: text('status').notNull().default('pending'),
    queuedAt: timestamp('queued_at').notNull().defaultNow(),
    claimedAt: timestamp('claimed_at'),
    completedAt: timestamp('completed_at'),
    failureReason: text('failure_reason'),
  },
  (table) => ({
    tenantIdx: index('resume_queue_tenant_idx').on(table.tenantId),
    parentStatusIdx: index('resume_queue_parent_status_idx').on(
      table.parentExecutionId,
      table.status,
      table.queuedAt
    ),
    newExecutionIdx: index('resume_queue_new_execution_idx').on(table.newExecutionId),
  })
)

// ============================================
// WEBHOOK & TRIGGERS
// ============================================

export const webhook = pgTable(
  'webhook',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    workflowId: text('workflow_id')
      .notNull()
      .references(() => workflow.id, { onDelete: 'cascade' }),
    blockId: text('block_id').references(() => workflowBlocks.id, { onDelete: 'cascade' }),
    path: text('path').notNull(),
    provider: text('provider'),
    providerConfig: json('provider_config'),
    isActive: boolean('is_active').notNull().default(true),
    failedCount: integer('failed_count').default(0),
    lastFailedAt: timestamp('last_failed_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('webhook_tenant_idx').on(table.tenantId),
    pathIdx: uniqueIndex('path_idx').on(table.path),
    workflowBlockIdx: index('idx_webhook_on_workflow_id_block_id').on(
      table.workflowId,
      table.blockId
    ),
  })
)

// ============================================
// API KEYS & PERMISSIONS
// ============================================

export const apiKey = pgTable(
  'api_key',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    workspaceId: text('workspace_id').references(() => workspace.id, { onDelete: 'cascade' }),
    createdBy: text('created_by').references(() => user.id, { onDelete: 'set null' }),
    name: text('name').notNull(),
    key: text('key').notNull().unique(),
    type: text('type').notNull().default('personal'),
    lastUsed: timestamp('last_used'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    expiresAt: timestamp('expires_at'),
  },
  (table) => ({
    tenantIdx: index('api_key_tenant_idx').on(table.tenantId),
    workspaceTypeCheck: check(
      'workspace_type_check',
      sql`(type = 'workspace' AND workspace_id IS NOT NULL) OR (type = 'personal' AND workspace_id IS NULL)`
    ),
    workspaceTypeIdx: index('api_key_workspace_type_idx').on(table.workspaceId, table.type),
    userTypeIdx: index('api_key_user_type_idx').on(table.userId, table.type),
  })
)

export const permissions = pgTable(
  'permissions',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    entityType: text('entity_type').notNull(),
    entityId: text('entity_id').notNull(),
    permissionType: permissionTypeEnum('permission_type').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('permissions_tenant_idx').on(table.tenantId),
    userIdIdx: index('permissions_user_id_idx').on(table.userId),
    entityIdx: index('permissions_entity_idx').on(table.entityType, table.entityId),
    userEntityTypeIdx: index('permissions_user_entity_type_idx').on(table.userId, table.entityType),
    userEntityPermissionIdx: index('permissions_user_entity_permission_idx').on(
      table.userId,
      table.entityType,
      table.permissionType
    ),
    userEntityIdx: index('permissions_user_entity_idx').on(
      table.userId,
      table.entityType,
      table.entityId
    ),
    uniquePermissionConstraint: uniqueIndex('permissions_unique_constraint').on(
      table.userId,
      table.entityType,
      table.entityId
    ),
  })
)

// ============================================
// CUSTOM TOOLS
// ============================================

export const customTools = pgTable(
  'custom_tools',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    workspaceId: text('workspace_id').references(() => workspace.id, { onDelete: 'cascade' }),
    userId: text('user_id').references(() => user.id, { onDelete: 'set null' }),
    title: text('title').notNull(),
    schema: json('schema').notNull(),
    code: text('code').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('custom_tools_tenant_idx').on(table.tenantId),
    workspaceIdIdx: index('custom_tools_workspace_id_idx').on(table.workspaceId),
    workspaceTitleUnique: uniqueIndex('custom_tools_workspace_title_unique').on(
      table.workspaceId,
      table.title
    ),
  })
)

// ============================================
// MEMORY
// ============================================

export const memory = pgTable(
  'memory',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspace.id, { onDelete: 'cascade' }),
    key: text('key').notNull(),
    data: jsonb('data').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => ({
    tenantIdx: index('memory_tenant_idx').on(table.tenantId),
    keyIdx: index('memory_key_idx').on(table.key),
    workspaceIdx: index('memory_workspace_idx').on(table.workspaceId),
    uniqueKeyPerWorkspaceIdx: uniqueIndex('memory_workspace_key_idx').on(
      table.workspaceId,
      table.key
    ),
  })
)

// ============================================
// CHAT
// ============================================

export const chat = pgTable(
  'chat',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    workflowId: text('workflow_id')
      .notNull()
      .references(() => workflow.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    identifier: text('identifier').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    isActive: boolean('is_active').notNull().default(true),
    customizations: json('customizations').default('{}'),
    authType: text('auth_type').notNull().default('public'),
    password: text('password'),
    allowedEmails: json('allowed_emails').default('[]'),
    outputConfigs: json('output_configs').default('[]'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('chat_tenant_idx').on(table.tenantId),
    identifierIdx: uniqueIndex('identifier_idx').on(table.identifier),
  })
)

// ============================================
// COPILOT
// ============================================

export const copilotChats = pgTable(
  'copilot_chats',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    workflowId: text('workflow_id')
      .notNull()
      .references(() => workflow.id, { onDelete: 'cascade' }),
    title: text('title'),
    messages: jsonb('messages').notNull().default('[]'),
    model: text('model').notNull().default('claude-3-7-sonnet-latest'),
    conversationId: text('conversation_id'),
    previewYaml: text('preview_yaml'),
    planArtifact: text('plan_artifact'),
    config: jsonb('config'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('copilot_chats_tenant_idx').on(table.tenantId),
    userIdIdx: index('copilot_chats_user_id_idx').on(table.userId),
    workflowIdIdx: index('copilot_chats_workflow_id_idx').on(table.workflowId),
    userWorkflowIdx: index('copilot_chats_user_workflow_idx').on(table.userId, table.workflowId),
    createdAtIdx: index('copilot_chats_created_at_idx').on(table.createdAt),
    updatedAtIdx: index('copilot_chats_updated_at_idx').on(table.updatedAt),
  })
)

export const workflowCheckpoints = pgTable(
  'workflow_checkpoints',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    workflowId: text('workflow_id')
      .notNull()
      .references(() => workflow.id, { onDelete: 'cascade' }),
    chatId: uuid('chat_id')
      .notNull()
      .references(() => copilotChats.id, { onDelete: 'cascade' }),
    messageId: text('message_id'),
    workflowState: json('workflow_state').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('workflow_checkpoints_tenant_idx').on(table.tenantId),
    userIdIdx: index('workflow_checkpoints_user_id_idx').on(table.userId),
    workflowIdIdx: index('workflow_checkpoints_workflow_id_idx').on(table.workflowId),
    chatIdIdx: index('workflow_checkpoints_chat_id_idx').on(table.chatId),
    messageIdIdx: index('workflow_checkpoints_message_id_idx').on(table.messageId),
    userWorkflowIdx: index('workflow_checkpoints_user_workflow_idx').on(
      table.userId,
      table.workflowId
    ),
    workflowChatIdx: index('workflow_checkpoints_workflow_chat_idx').on(
      table.workflowId,
      table.chatId
    ),
    createdAtIdx: index('workflow_checkpoints_created_at_idx').on(table.createdAt),
    chatCreatedAtIdx: index('workflow_checkpoints_chat_created_at_idx').on(
      table.chatId,
      table.createdAt
    ),
  })
)

export const copilotFeedback = pgTable(
  'copilot_feedback',
  {
    feedbackId: uuid('feedback_id').primaryKey().defaultRandom(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    chatId: uuid('chat_id')
      .notNull()
      .references(() => copilotChats.id, { onDelete: 'cascade' }),
    userQuery: text('user_query').notNull(),
    agentResponse: text('agent_response').notNull(),
    isPositive: boolean('is_positive').notNull(),
    feedback: text('feedback'),
    workflowYaml: text('workflow_yaml'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('copilot_feedback_tenant_idx').on(table.tenantId),
    userIdIdx: index('copilot_feedback_user_id_idx').on(table.userId),
    chatIdIdx: index('copilot_feedback_chat_id_idx').on(table.chatId),
    userChatIdx: index('copilot_feedback_user_chat_idx').on(table.userId, table.chatId),
    isPositiveIdx: index('copilot_feedback_is_positive_idx').on(table.isPositive),
    createdAtIdx: index('copilot_feedback_created_at_idx').on(table.createdAt),
  })
)

// ============================================
// KNOWLEDGE BASE
// ============================================

export const knowledgeBase = pgTable(
  'knowledge_base',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    workspaceId: text('workspace_id').references(() => workspace.id),
    name: text('name').notNull(),
    description: text('description'),
    tokenCount: integer('token_count').notNull().default(0),
    embeddingModel: text('embedding_model').notNull().default('text-embedding-3-small'),
    embeddingDimension: integer('embedding_dimension').notNull().default(1536),
    chunkingConfig: json('chunking_config')
      .notNull()
      .default('{"maxSize": 1024, "minSize": 1, "overlap": 200}'),
    deletedAt: timestamp('deleted_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('kb_tenant_idx').on(table.tenantId),
    userIdIdx: index('kb_user_id_idx').on(table.userId),
    workspaceIdIdx: index('kb_workspace_id_idx').on(table.workspaceId),
    userWorkspaceIdx: index('kb_user_workspace_idx').on(table.userId, table.workspaceId),
    deletedAtIdx: index('kb_deleted_at_idx').on(table.deletedAt),
  })
)

export const document = pgTable(
  'document',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    knowledgeBaseId: text('knowledge_base_id')
      .notNull()
      .references(() => knowledgeBase.id, { onDelete: 'cascade' }),
    filename: text('filename').notNull(),
    fileUrl: text('file_url').notNull(),
    fileSize: integer('file_size').notNull(),
    mimeType: text('mime_type').notNull(),
    chunkCount: integer('chunk_count').notNull().default(0),
    tokenCount: integer('token_count').notNull().default(0),
    characterCount: integer('character_count').notNull().default(0),
    processingStatus: text('processing_status').notNull().default('pending'),
    processingStartedAt: timestamp('processing_started_at'),
    processingCompletedAt: timestamp('processing_completed_at'),
    processingError: text('processing_error'),
    enabled: boolean('enabled').notNull().default(true),
    deletedAt: timestamp('deleted_at'),
    tag1: text('tag1'),
    tag2: text('tag2'),
    tag3: text('tag3'),
    tag4: text('tag4'),
    tag5: text('tag5'),
    tag6: text('tag6'),
    tag7: text('tag7'),
    number1: doublePrecision('number1'),
    number2: doublePrecision('number2'),
    number3: doublePrecision('number3'),
    number4: doublePrecision('number4'),
    number5: doublePrecision('number5'),
    date1: timestamp('date1'),
    date2: timestamp('date2'),
    boolean1: boolean('boolean1'),
    boolean2: boolean('boolean2'),
    boolean3: boolean('boolean3'),
    uploadedAt: timestamp('uploaded_at').notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('doc_tenant_idx').on(table.tenantId),
    knowledgeBaseIdIdx: index('doc_kb_id_idx').on(table.knowledgeBaseId),
    filenameIdx: index('doc_filename_idx').on(table.filename),
    processingStatusIdx: index('doc_processing_status_idx').on(
      table.knowledgeBaseId,
      table.processingStatus
    ),
    tag1Idx: index('doc_tag1_idx').on(table.tag1),
    tag2Idx: index('doc_tag2_idx').on(table.tag2),
    tag3Idx: index('doc_tag3_idx').on(table.tag3),
    tag4Idx: index('doc_tag4_idx').on(table.tag4),
    tag5Idx: index('doc_tag5_idx').on(table.tag5),
    tag6Idx: index('doc_tag6_idx').on(table.tag6),
    tag7Idx: index('doc_tag7_idx').on(table.tag7),
    number1Idx: index('doc_number1_idx').on(table.number1),
    number2Idx: index('doc_number2_idx').on(table.number2),
    number3Idx: index('doc_number3_idx').on(table.number3),
    number4Idx: index('doc_number4_idx').on(table.number4),
    number5Idx: index('doc_number5_idx').on(table.number5),
    date1Idx: index('doc_date1_idx').on(table.date1),
    date2Idx: index('doc_date2_idx').on(table.date2),
    boolean1Idx: index('doc_boolean1_idx').on(table.boolean1),
    boolean2Idx: index('doc_boolean2_idx').on(table.boolean2),
    boolean3Idx: index('doc_boolean3_idx').on(table.boolean3),
  })
)

export const knowledgeBaseTagDefinitions = pgTable(
  'knowledge_base_tag_definitions',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    knowledgeBaseId: text('knowledge_base_id')
      .notNull()
      .references(() => knowledgeBase.id, { onDelete: 'cascade' }),
    tagSlot: text('tag_slot', {
      enum: TAG_SLOTS,
    }).notNull(),
    displayName: text('display_name').notNull(),
    fieldType: text('field_type').notNull().default('text'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('kb_tag_definitions_tenant_idx').on(table.tenantId),
    kbTagSlotIdx: uniqueIndex('kb_tag_definitions_kb_slot_idx').on(
      table.knowledgeBaseId,
      table.tagSlot
    ),
    kbDisplayNameIdx: uniqueIndex('kb_tag_definitions_kb_display_name_idx').on(
      table.knowledgeBaseId,
      table.displayName
    ),
    kbIdIdx: index('kb_tag_definitions_kb_id_idx').on(table.knowledgeBaseId),
  })
)

export const embedding = pgTable(
  'embedding',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    knowledgeBaseId: text('knowledge_base_id')
      .notNull()
      .references(() => knowledgeBase.id, { onDelete: 'cascade' }),
    documentId: text('document_id')
      .notNull()
      .references(() => document.id, { onDelete: 'cascade' }),
    chunkIndex: integer('chunk_index').notNull(),
    chunkHash: text('chunk_hash').notNull(),
    content: text('content').notNull(),
    contentLength: integer('content_length').notNull(),
    tokenCount: integer('token_count').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }),
    embeddingModel: text('embedding_model').notNull().default('text-embedding-3-small'),
    startOffset: integer('start_offset').notNull(),
    endOffset: integer('end_offset').notNull(),
    tag1: text('tag1'),
    tag2: text('tag2'),
    tag3: text('tag3'),
    tag4: text('tag4'),
    tag5: text('tag5'),
    tag6: text('tag6'),
    tag7: text('tag7'),
    number1: doublePrecision('number1'),
    number2: doublePrecision('number2'),
    number3: doublePrecision('number3'),
    number4: doublePrecision('number4'),
    number5: doublePrecision('number5'),
    date1: timestamp('date1'),
    date2: timestamp('date2'),
    boolean1: boolean('boolean1'),
    boolean2: boolean('boolean2'),
    boolean3: boolean('boolean3'),
    enabled: boolean('enabled').notNull().default(true),
    contentTsv: tsvector('content_tsv').generatedAlwaysAs(
      (): SQL => sql`to_tsvector('english', ${embedding.content})`
    ),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('emb_tenant_idx').on(table.tenantId),
    kbIdIdx: index('emb_kb_id_idx').on(table.knowledgeBaseId),
    docIdIdx: index('emb_doc_id_idx').on(table.documentId),
    docChunkIdx: uniqueIndex('emb_doc_chunk_idx').on(table.documentId, table.chunkIndex),
    kbModelIdx: index('emb_kb_model_idx').on(table.knowledgeBaseId, table.embeddingModel),
    kbEnabledIdx: index('emb_kb_enabled_idx').on(table.knowledgeBaseId, table.enabled),
    docEnabledIdx: index('emb_doc_enabled_idx').on(table.documentId, table.enabled),
    embeddingVectorHnswIdx: index('embedding_vector_hnsw_idx')
      .using('hnsw', table.embedding.op('vector_cosine_ops'))
      .with({
        m: 16,
        ef_construction: 64,
      }),
    tag1Idx: index('emb_tag1_idx').on(table.tag1),
    tag2Idx: index('emb_tag2_idx').on(table.tag2),
    tag3Idx: index('emb_tag3_idx').on(table.tag3),
    tag4Idx: index('emb_tag4_idx').on(table.tag4),
    tag5Idx: index('emb_tag5_idx').on(table.tag5),
    tag6Idx: index('emb_tag6_idx').on(table.tag6),
    tag7Idx: index('emb_tag7_idx').on(table.tag7),
    number1Idx: index('emb_number1_idx').on(table.number1),
    number2Idx: index('emb_number2_idx').on(table.number2),
    number3Idx: index('emb_number3_idx').on(table.number3),
    number4Idx: index('emb_number4_idx').on(table.number4),
    number5Idx: index('emb_number5_idx').on(table.number5),
    date1Idx: index('emb_date1_idx').on(table.date1),
    date2Idx: index('emb_date2_idx').on(table.date2),
    boolean1Idx: index('emb_boolean1_idx').on(table.boolean1),
    boolean2Idx: index('emb_boolean2_idx').on(table.boolean2),
    boolean3Idx: index('emb_boolean3_idx').on(table.boolean3),
    contentFtsIdx: index('emb_content_fts_idx').using('gin', table.contentTsv),
    embeddingNotNullCheck: check('embedding_not_null_check', sql`"embedding" IS NOT NULL`),
  })
)

// ============================================
// MCP SERVERS
// ============================================

export const mcpServers = pgTable(
  'mcp_servers',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspace.id, { onDelete: 'cascade' }),
    createdBy: text('created_by').references(() => user.id, { onDelete: 'set null' }),
    name: text('name').notNull(),
    description: text('description'),
    transport: text('transport').notNull(),
    url: text('url'),
    headers: json('headers').default('{}'),
    timeout: integer('timeout').default(30000),
    retries: integer('retries').default(3),
    enabled: boolean('enabled').notNull().default(true),
    lastConnected: timestamp('last_connected'),
    connectionStatus: text('connection_status').default('disconnected'),
    lastError: text('last_error'),
    statusConfig: jsonb('status_config').default('{}'),
    toolCount: integer('tool_count').default(0),
    lastToolsRefresh: timestamp('last_tools_refresh'),
    totalRequests: integer('total_requests').default(0),
    lastUsed: timestamp('last_used'),
    deletedAt: timestamp('deleted_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('mcp_servers_tenant_idx').on(table.tenantId),
    workspaceEnabledIdx: index('mcp_servers_workspace_enabled_idx').on(
      table.workspaceId,
      table.enabled
    ),
    workspaceDeletedIdx: index('mcp_servers_workspace_deleted_idx').on(
      table.workspaceId,
      table.deletedAt
    ),
  })
)

export const workflowMcpServer = pgTable(
  'workflow_mcp_server',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspace.id, { onDelete: 'cascade' }),
    createdBy: text('created_by')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('workflow_mcp_server_tenant_idx').on(table.tenantId),
    workspaceIdIdx: index('workflow_mcp_server_workspace_id_idx').on(table.workspaceId),
    createdByIdx: index('workflow_mcp_server_created_by_idx').on(table.createdBy),
  })
)

export const workflowMcpTool = pgTable(
  'workflow_mcp_tool',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    serverId: text('server_id')
      .notNull()
      .references(() => workflowMcpServer.id, { onDelete: 'cascade' }),
    workflowId: text('workflow_id')
      .notNull()
      .references(() => workflow.id, { onDelete: 'cascade' }),
    toolName: text('tool_name').notNull(),
    toolDescription: text('tool_description'),
    parameterSchema: json('parameter_schema').notNull().default('{}'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('workflow_mcp_tool_tenant_idx').on(table.tenantId),
    serverIdIdx: index('workflow_mcp_tool_server_id_idx').on(table.serverId),
    workflowIdIdx: index('workflow_mcp_tool_workflow_id_idx').on(table.workflowId),
    serverWorkflowUnique: uniqueIndex('workflow_mcp_tool_server_workflow_unique').on(
      table.serverId,
      table.workflowId
    ),
  })
)

// ============================================
// SSO PROVIDER
// ============================================

export const ssoProvider = pgTable(
  'sso_provider',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    issuer: text('issuer').notNull(),
    domain: text('domain').notNull(),
    oidcConfig: text('oidc_config'),
    samlConfig: text('saml_config'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    providerId: text('provider_id').notNull(),
    organizationId: text('organization_id').references(() => organization.id, {
      onDelete: 'cascade',
    }),
  },
  (table) => ({
    tenantIdx: index('sso_provider_tenant_idx').on(table.tenantId),
    providerIdIdx: index('sso_provider_provider_id_idx').on(table.providerId),
    domainIdx: index('sso_provider_domain_idx').on(table.domain),
    userIdIdx: index('sso_provider_user_id_idx').on(table.userId),
    organizationIdIdx: index('sso_provider_organization_id_idx').on(table.organizationId),
  })
)

// ============================================
// USAGE & BILLING
// ============================================

export const usageLog = pgTable(
  'usage_log',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    category: usageLogCategoryEnum('category').notNull(),
    source: usageLogSourceEnum('source').notNull(),
    description: text('description').notNull(),
    metadata: jsonb('metadata'),
    cost: decimal('cost').notNull(),
    workspaceId: text('workspace_id').references(() => workspace.id, { onDelete: 'set null' }),
    workflowId: text('workflow_id').references(() => workflow.id, { onDelete: 'set null' }),
    executionId: text('execution_id'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('usage_log_tenant_idx').on(table.tenantId),
    userCreatedAtIdx: index('usage_log_user_created_at_idx').on(table.userId, table.createdAt),
    sourceIdx: index('usage_log_source_idx').on(table.source),
    workspaceIdIdx: index('usage_log_workspace_id_idx').on(table.workspaceId),
    workflowIdIdx: index('usage_log_workflow_id_idx').on(table.workflowId),
    tenantCreatedAtIdx: index('usage_log_tenant_created_at_idx').on(table.tenantId, table.createdAt),
  })
)

export const subscription = pgTable(
  'subscription',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenant.id, { onDelete: 'cascade' }),
    plan: text('plan').notNull(),
    referenceId: text('reference_id').notNull(),
    stripeCustomerId: text('stripe_customer_id'),
    stripeSubscriptionId: text('stripe_subscription_id'),
    status: text('status'),
    periodStart: timestamp('period_start'),
    periodEnd: timestamp('period_end'),
    cancelAtPeriodEnd: boolean('cancel_at_period_end'),
    seats: integer('seats'),
    trialStart: timestamp('trial_start'),
    trialEnd: timestamp('trial_end'),
    metadata: json('metadata'),
  },
  (table) => ({
    tenantIdx: index('subscription_tenant_idx').on(table.tenantId),
    referenceStatusIdx: index('subscription_reference_status_idx').on(
      table.referenceId,
      table.status
    ),
    enterpriseMetadataCheck: check(
      'check_enterprise_metadata',
      sql`plan != 'enterprise' OR metadata IS NOT NULL`
    ),
  })
)

// ============================================
// GLOBAL TABLES (No tenant scoping)
// ============================================

export const waitlist = pgTable('waitlist', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const rateLimitBucket = pgTable('rate_limit_bucket', {
  key: text('key').primaryKey(),
  tokens: decimal('tokens').notNull(),
  lastRefillAt: timestamp('last_refill_at').notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const idempotencyKey = pgTable(
  'idempotency_key',
  {
    key: text('key').notNull(),
    namespace: text('namespace').notNull().default('default'),
    result: json('result').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    keyNamespacePk: uniqueIndex('idempotency_key_namespace_unique').on(table.key, table.namespace),
    createdAtIdx: index('idempotency_key_created_at_idx').on(table.createdAt),
    namespaceIdx: index('idempotency_key_namespace_idx').on(table.namespace),
  })
)

// System documentation embeddings (global)
export const docsEmbeddings = pgTable(
  'docs_embeddings',
  {
    chunkId: uuid('chunk_id').primaryKey().defaultRandom(),
    chunkText: text('chunk_text').notNull(),
    sourceDocument: text('source_document').notNull(),
    sourceLink: text('source_link').notNull(),
    headerText: text('header_text').notNull(),
    headerLevel: integer('header_level').notNull(),
    tokenCount: integer('token_count').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),
    embeddingModel: text('embedding_model').notNull().default('text-embedding-3-small'),
    metadata: jsonb('metadata').notNull().default('{}'),
    chunkTextTsv: tsvector('chunk_text_tsv').generatedAlwaysAs(
      (): SQL => sql`to_tsvector('english', ${docsEmbeddings.chunkText})`
    ),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    sourceDocumentIdx: index('docs_emb_source_document_idx').on(table.sourceDocument),
    headerLevelIdx: index('docs_emb_header_level_idx').on(table.headerLevel),
    sourceHeaderIdx: index('docs_emb_source_header_idx').on(
      table.sourceDocument,
      table.headerLevel
    ),
    modelIdx: index('docs_emb_model_idx').on(table.embeddingModel),
    createdAtIdx: index('docs_emb_created_at_idx').on(table.createdAt),
    embeddingVectorHnswIdx: index('docs_embedding_vector_hnsw_idx')
      .using('hnsw', table.embedding.op('vector_cosine_ops'))
      .with({
        m: 16,
        ef_construction: 64,
      }),
    metadataGinIdx: index('docs_emb_metadata_gin_idx').using('gin', table.metadata),
    chunkTextFtsIdx: index('docs_emb_chunk_text_fts_idx').using('gin', table.chunkTextTsv),
    embeddingNotNullCheck: check('docs_embedding_not_null_check', sql`"embedding" IS NOT NULL`),
    headerLevelCheck: check(
      'docs_header_level_check',
      sql`"header_level" >= 1 AND "header_level" <= 6`
    ),
  })
)

// ============================================
// TEMPLATES (Global marketplace)
// ============================================

export const templateCreators = pgTable(
  'template_creators',
  {
    id: text('id').primaryKey(),
    referenceType: templateCreatorTypeEnum('reference_type').notNull(),
    referenceId: text('reference_id').notNull(),
    name: text('name').notNull(),
    profileImageUrl: text('profile_image_url'),
    details: jsonb('details'),
    verified: boolean('verified').notNull().default(false),
    createdBy: text('created_by').references(() => user.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    referenceUniqueIdx: uniqueIndex('template_creators_reference_idx').on(
      table.referenceType,
      table.referenceId
    ),
    referenceIdIdx: index('template_creators_reference_id_idx').on(table.referenceId),
    createdByIdx: index('template_creators_created_by_idx').on(table.createdBy),
  })
)

export const templates = pgTable(
  'templates',
  {
    id: text('id').primaryKey(),
    workflowId: text('workflow_id').references(() => workflow.id, { onDelete: 'set null' }),
    name: text('name').notNull(),
    details: jsonb('details'),
    creatorId: text('creator_id').references(() => templateCreators.id, { onDelete: 'set null' }),
    views: integer('views').notNull().default(0),
    stars: integer('stars').notNull().default(0),
    status: templateStatusEnum('status').notNull().default('pending'),
    tags: text('tags').array().notNull().default(sql`'{}'::text[]`),
    requiredCredentials: jsonb('required_credentials').notNull().default('[]'),
    state: jsonb('state').notNull(),
    ogImageUrl: text('og_image_url'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    statusIdx: index('templates_status_idx').on(table.status),
    creatorIdIdx: index('templates_creator_id_idx').on(table.creatorId),
    viewsIdx: index('templates_views_idx').on(table.views),
    starsIdx: index('templates_stars_idx').on(table.stars),
    statusViewsIdx: index('templates_status_views_idx').on(table.status, table.views),
    statusStarsIdx: index('templates_status_stars_idx').on(table.status, table.stars),
    createdAtIdx: index('templates_created_at_idx').on(table.createdAt),
    updatedAtIdx: index('templates_updated_at_idx').on(table.updatedAt),
  })
)

export const templateStars = pgTable(
  'template_stars',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    templateId: text('template_id')
      .notNull()
      .references(() => templates.id, { onDelete: 'cascade' }),
    starredAt: timestamp('starred_at').notNull().defaultNow(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('template_stars_user_id_idx').on(table.userId),
    templateIdIdx: index('template_stars_template_id_idx').on(table.templateId),
    userTemplateIdx: index('template_stars_user_template_idx').on(table.userId, table.templateId),
    templateUserIdx: index('template_stars_template_user_idx').on(table.templateId, table.userId),
    starredAtIdx: index('template_stars_starred_at_idx').on(table.starredAt),
    templateStarredAtIdx: index('template_stars_template_starred_at_idx').on(
      table.templateId,
      table.starredAt
    ),
    uniqueUserTemplateConstraint: uniqueIndex('template_stars_user_template_unique').on(
      table.userId,
      table.templateId
    ),
  })
)