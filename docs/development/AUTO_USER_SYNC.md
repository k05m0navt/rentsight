# Automatic User Synchronization

This document explains the automatic user synchronization system that keeps Supabase Auth users in sync with the Prisma database.

## Overview

The system automatically synchronizes users between Supabase Auth and your Prisma database to prevent foreign key constraint errors when creating properties, rent entries, and other user-related data.

## Components

### 1. Database Trigger (Primary Method)
- **File**: Applied via migration `setup_user_sync_trigger`
- **Function**: Automatically syncs users when they sign up or update their profile
- **Trigger**: Runs on `INSERT` or `UPDATE` events in `auth.users` table
- **Benefits**: 
  - Zero latency - happens immediately
  - No external dependencies
  - Works even if your app is down

### 2. User Sync Service
- **File**: `src/lib/user-sync.ts`
- **Functions**:
  - `syncUserToPrisma()` - Sync a specific user
  - `syncCurrentUser()` - Sync the currently authenticated user
  - `syncAllUsers()` - Batch sync all users

### 3. API Integration
- **File**: `src/app/api/properties/route.ts`
- **Function**: Automatically syncs users before creating properties
- **Fallback**: Ensures user exists even if database trigger fails

### 4. Webhook Handler (Optional)
- **File**: `src/app/api/webhooks/auth/route.ts`
- **Purpose**: Handle Supabase Auth webhooks for real-time sync
- **Setup**: Requires webhook configuration in Supabase dashboard

### 5. Admin Endpoint
- **File**: `src/app/api/admin/sync-users/route.ts`
- **Purpose**: Manual sync for troubleshooting or initial setup
- **Usage**: `POST /api/admin/sync-users`

## How It Works

### Automatic Sync Flow

1. **User Signs Up** → Supabase Auth creates user
2. **Database Trigger** → Automatically creates user in Prisma database
3. **Default Preferences** → Creates user preferences automatically
4. **API Calls** → User can immediately create properties, entries, etc.

### Fallback Sync Flow

1. **API Call** → User tries to create property
2. **Auth Check** → Verify user is authenticated
3. **Sync Check** → Ensure user exists in Prisma database
4. **Create Property** → Proceed with property creation

## Configuration

### Database Trigger Setup

The trigger is automatically applied via migration. It:
- Syncs user data (id, email, name)
- Creates default user preferences
- Handles conflicts gracefully

### Webhook Setup (Optional)

To enable webhook-based sync:

1. Go to Supabase Dashboard → Authentication → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/webhooks/auth`
3. Select events: `user.created`, `user.updated`
4. Save configuration

## Usage

### Manual Sync

```bash
# Sync all users
npx tsx scripts/sync-auth-user.ts

# Or use the API endpoint
curl -X POST https://yourdomain.com/api/admin/sync-users
```

### Programmatic Sync

```typescript
import { syncCurrentUser, syncUserToPrisma } from '@/lib/user-sync';

// Sync current authenticated user
const result = await syncCurrentUser();

// Sync specific user
const result = await syncUserToPrisma({
  id: 'user-id',
  email: 'user@example.com',
  name: 'User Name'
});
```

## Troubleshooting

### Common Issues

1. **Foreign Key Constraint Errors**
   - **Cause**: User not synced to Prisma database
   - **Solution**: Run manual sync or check database trigger

2. **Sync Failures**
   - **Check**: Database permissions for trigger function
   - **Verify**: User data format matches expected schema

3. **Webhook Not Working**
   - **Check**: Webhook URL is accessible
   - **Verify**: Supabase webhook configuration
   - **Fallback**: Database trigger should still work

### Debugging

```typescript
// Check if user exists in Prisma
const user = await prisma.user.findUnique({
  where: { id: 'user-id' }
});

// Check sync status
const result = await syncCurrentUser();
console.log('Sync result:', result);
```

## Monitoring

### Logs to Watch

- `[UserSync]` - User sync service logs
- `[AuthWebhook]` - Webhook handler logs
- `[AdminSync]` - Manual sync logs

### Health Checks

- Database trigger is active
- Webhook endpoint responds (if configured)
- Manual sync works without errors

## Security Considerations

- Database trigger runs with elevated permissions
- Webhook endpoint should validate Supabase signatures
- Admin sync endpoint should require authentication
- User data is sanitized before database insertion

## Performance

- Database trigger: ~1ms per user
- API sync: ~10-50ms per user
- Batch sync: Scales linearly with user count
- No impact on user signup flow
