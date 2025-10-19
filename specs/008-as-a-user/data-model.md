# Data Model: Progressive Web App (PWA)

**Feature**: 008-as-a-user  
**Date**: 2025-01-27  
**Purpose**: PWA-specific data entities, relationships, and storage patterns

## PWA Entities

### App Manifest
**Purpose**: Configuration file defining PWA metadata and behavior

**Fields**:
- `name`: Application display name (string, required)
- `short_name`: Short name for limited space (string, required)
- `description`: Application description (string, required)
- `start_url`: Initial URL when app launches (string, required)
- `display`: Display mode (enum: "standalone", "fullscreen", "minimal-ui")
- `orientation`: Preferred orientation (enum: "portrait", "landscape", "any")
- `theme_color`: Theme color for browser UI (string, hex color)
- `background_color`: Background color for splash screen (string, hex color)
- `icons`: Array of icon definitions with sizes and types
- `categories`: App categories for app stores (array of strings)
- `lang`: Primary language (string, ISO 639-1 code)
- `scope`: Navigation scope for the app (string, URL pattern)

**Validation Rules**:
- `name` must be 1-45 characters
- `short_name` must be 1-12 characters
- `start_url` must be absolute or relative to manifest location
- `theme_color` and `background_color` must be valid hex colors
- Icons must include at least 192x192 and 512x512 sizes

### Service Worker Registration
**Purpose**: Manages service worker lifecycle and updates

**Fields**:
- `script_url`: URL to service worker script (string, required)
- `scope`: Service worker scope (string, required)
- `update_via_cache`: Update strategy (enum: "imports", "all", "none")
- `registration_id`: Unique identifier for registration (string, UUID)
- `state`: Current state (enum: "installing", "installed", "activating", "activated", "redundant")
- `installing_worker`: Reference to installing worker instance
- `waiting_worker`: Reference to waiting worker instance
- `active_worker`: Reference to active worker instance

**Validation Rules**:
- `script_url` must be accessible and valid JavaScript
- `scope` must be within app origin
- `registration_id` must be unique per browser instance

### Cache Storage
**Purpose**: Manages cached resources for offline functionality

**Fields**:
- `cache_name`: Name of the cache (string, required)
- `version`: Cache version for invalidation (string, required)
- `resources`: Array of cached resource URLs (array of strings)
- `created_at`: Cache creation timestamp (datetime, required)
- `last_updated`: Last update timestamp (datetime, required)
- `size`: Cache size in bytes (number, optional)
- `strategy`: Caching strategy used (enum: "cache-first", "network-first", "stale-while-revalidate")

**Validation Rules**:
- `cache_name` must be unique per service worker
- `version` must follow semantic versioning
- `resources` must be valid URLs within app scope

### Push Subscription
**Purpose**: User's subscription to receive push notifications

**Fields**:
- `endpoint`: Push service endpoint URL (string, required)
- `keys`: Encryption keys for push messages (object, required)
  - `p256dh`: P-256 Diffie-Hellman key (string, required)
  - `auth`: Authentication secret (string, required)
- `user_id`: Associated user ID (string, required)
- `created_at`: Subscription creation timestamp (datetime, required)
- `expires_at`: Subscription expiration timestamp (datetime, optional)
- `notification_types`: Enabled notification types (array of strings)

**Validation Rules**:
- `endpoint` must be valid push service URL
- `keys.p256dh` and `keys.auth` must be valid base64 strings
- `user_id` must reference existing user
- `notification_types` must be from allowed list

### Offline Data Store
**Purpose**: Local storage for offline data synchronization

**Fields**:
- `table_name`: Name of the data table (string, required)
- `record_id`: Unique record identifier (string, required)
- `data`: Record data (object, required)
- `operation`: Operation type (enum: "create", "update", "delete")
- `timestamp`: Local operation timestamp (datetime, required)
- `synced`: Sync status (boolean, default: false)
- `sync_attempts`: Number of sync attempts (number, default: 0)
- `last_sync_error`: Last sync error message (string, optional)

**Validation Rules**:
- `table_name` must match existing database schema
- `record_id` must be unique within table
- `data` must conform to table schema
- `operation` must be valid CRUD operation

## Relationships

### App Manifest ↔ Service Worker
- **Relationship**: One-to-one
- **Description**: Each manifest can have one service worker registration
- **Constraints**: Service worker must be within manifest scope

### Service Worker ↔ Cache Storage
- **Relationship**: One-to-many
- **Description**: Service worker can manage multiple caches
- **Constraints**: Each cache must have unique name within service worker

### User ↔ Push Subscription
- **Relationship**: One-to-many
- **Description**: User can have multiple push subscriptions (different devices)
- **Constraints**: Each subscription must have unique endpoint

### User ↔ Offline Data Store
- **Relationship**: One-to-many
- **Description**: User can have multiple offline data records
- **Constraints**: Records must belong to user's accessible data

## State Transitions

### Service Worker Lifecycle
```
installing → installed → activating → activated
     ↓           ↓           ↓
redundant ← redundant ← redundant ← redundant
```

**Transitions**:
- `installing`: New service worker being installed
- `installed`: Service worker installed but not yet active
- `activating`: Service worker becoming active
- `activated`: Service worker is active and controlling pages
- `redundant`: Service worker is no longer needed

### Cache Storage Lifecycle
```
created → updated → invalidated → deleted
```

**Transitions**:
- `created`: New cache created with initial resources
- `updated`: Cache updated with new resources or version
- `invalidated`: Cache marked for deletion due to version mismatch
- `deleted`: Cache removed from storage

### Offline Data Sync Lifecycle
```
pending → syncing → synced
   ↓        ↓
failed ← failed
```

**Transitions**:
- `pending`: Data changes waiting to be synced
- `syncing`: Currently attempting to sync with server
- `synced`: Successfully synchronized with server
- `failed`: Sync attempt failed, will retry

## Storage Patterns

### Browser Storage Hierarchy
1. **Service Worker Cache**: Static assets, API responses
2. **IndexedDB**: Structured offline data, user preferences
3. **localStorage**: Simple configuration, flags
4. **sessionStorage**: Temporary session data

### Data Persistence Strategy
- **Static Assets**: Cached indefinitely with version-based invalidation
- **API Responses**: Cached with TTL, refreshed on network availability
- **User Data**: Stored in IndexedDB with background sync
- **Configuration**: Stored in localStorage for quick access

### Cache Invalidation Rules
- **Version-based**: New service worker version invalidates all caches
- **TTL-based**: API responses expire after configured time
- **Manual**: User actions can trigger cache invalidation
- **Storage quota**: Old caches removed when storage limit reached
