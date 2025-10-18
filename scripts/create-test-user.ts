import { PrismaClient } from '@prisma/client';
// import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

async function createTestUser() {
  console.log('Creating test user in database...');

  // Get Supabase user ID from auth
  // const supabase = createClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  // );

  // For testing, we'll create a user with a known ID
  // In production, this should be done via auth callback or trigger
  const testEmail = 'ertalun@gmail.com';

  try {
    // Check if user already exists in Prisma
    const existing = await prisma.user.findUnique({
      where: { email: testEmail },
    });

    if (existing) {
      console.log(`✅ User already exists: ${existing.email}`);
      console.log(`   User ID: ${existing.id}`);

      // Check preferences
      const prefs = await prisma.userPreferences.findUnique({
        where: { user_id: existing.id },
      });

      if (prefs) {
        console.log('✅ Preferences exist');
      } else {
        console.log('⚠️ Creating default preferences...');
        await prisma.userPreferences.create({
          data: {
            user_id: existing.id,
            currency_format: 'USD',
            language: 'en',
            default_view: 'dashboard',
          },
        });
        console.log('✅ Default preferences created');
      }

      return;
    }

    // Create user in Prisma (matching Supabase auth user)
    // Note: password_hash is not used for auth (Supabase handles that)
    // We just need a placeholder
    const user = await prisma.user.create({
      data: {
        id: '00000000-0000-0000-0000-000000000001', // Temporary ID for testing
        email: testEmail,
        password_hash: 'supabase_handles_auth', // Placeholder
      },
    });

    console.log(`✅ Test user created: ${user.email}`);
    console.log(`   User ID: ${user.id}`);

    // Create default preferences
    await prisma.userPreferences.create({
      data: {
        user_id: user.id,
        currency_format: 'USD',
        date_format: 'MM/DD/YYYY',
        language: 'en',
        default_view: 'dashboard',
      },
    });

    console.log('✅ Default preferences created');
    console.log('\n⚠️ NOTE: User ID may not match Supabase Auth ID.');
    console.log('   For production, implement auth callback to sync IDs properly.');
  } catch (error: unknown) {
    console.error('❌ Failed to create test user:');
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(errorMessage);
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('Code:', (error as { code: string }).code);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
