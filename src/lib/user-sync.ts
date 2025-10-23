import { prisma } from './prisma';
import { createClient } from './supabase/server';

export interface SyncUserData {
  id: string;
  email: string;
  name?: string;
}

/**
 * Syncs a Supabase Auth user with the Prisma database
 * Creates the user if they don't exist, updates if they do
 */
export async function syncUserToPrisma(userData: SyncUserData): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    console.log(`[UserSync] Syncing user: ${userData.email} (${userData.id})`);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userData.id },
    });

    if (existingUser) {
      console.log(`[UserSync] User already exists: ${userData.email}`);
      
      // Update user data if needed
      if (existingUser.email !== userData.email || existingUser.name !== userData.name) {
        const updatedUser = await prisma.user.update({
          where: { id: userData.id },
          data: {
            email: userData.email,
            name: userData.name,
          },
        });
        console.log(`[UserSync] Updated user: ${userData.email}`);
        return { success: true, user: updatedUser };
      }
      
      return { success: true, user: existingUser };
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        password_hash: 'supabase_auth_managed',
      },
    });

    console.log(`[UserSync] Created new user: ${userData.email}`);

    // Create default preferences
    await prisma.userPreferences.create({
      data: {
        user_id: newUser.id,
        currency: 'USD',
        numberFormat: 'en-US',
        default_view: 'dashboard',
        currency_format: 'USD', // Legacy field
      },
    });

    console.log(`[UserSync] Created default preferences for: ${userData.email}`);

    return { success: true, user: newUser };
  } catch (error) {
    console.error('[UserSync] Error syncing user:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

/**
 * Syncs the current authenticated user
 * Useful for ensuring user exists before API operations
 */
export async function syncCurrentUser(): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return { success: false, error: 'No authenticated user' };
    }

    return await syncUserToPrisma({
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.name || user.user_metadata?.full_name,
    });
  } catch (error) {
    console.error('[UserSync] Error syncing current user:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

/**
 * Batch sync all users from Supabase Auth
 * Useful for initial setup or manual sync
 */
export async function syncAllUsers(): Promise<{ success: boolean; synced: number; errors: string[] }> {
  try {
    console.log('[UserSync] Starting batch sync of all users...');
    
    // Query Supabase auth.users table directly
    const authUsers: any[] = await prisma.$queryRaw`
      SELECT id, email, raw_user_meta_data->>'name' as name, raw_user_meta_data->>'full_name' as full_name
      FROM auth.users 
      ORDER BY created_at DESC
    `;

    console.log(`[UserSync] Found ${authUsers.length} users in Supabase Auth`);

    let synced = 0;
    const errors: string[] = [];

    for (const authUser of authUsers) {
      const result = await syncUserToPrisma({
        id: authUser.id,
        email: authUser.email,
        name: authUser.name || authUser.full_name,
      });

      if (result.success) {
        synced++;
      } else {
        errors.push(`${authUser.email}: ${result.error}`);
      }
    }

    console.log(`[UserSync] Batch sync complete: ${synced} synced, ${errors.length} errors`);
    return { success: true, synced, errors };
  } catch (error) {
    console.error('[UserSync] Error in batch sync:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, synced: 0, errors: [errorMessage] };
  }
}
