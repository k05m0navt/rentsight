import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function syncUser() {
  console.log('Syncing Supabase Auth user with Prisma database...\n');

  // The authenticated user from Supabase
  // We need to get this from the auth system
  // For now, let's query the auth.users table directly

  try {
    // Query Supabase auth.users table
    const authUsers: unknown[] = await prisma.$queryRaw`
      SELECT id, email, created_at 
      FROM auth.users 
      LIMIT 10
    `;

    console.log(`Found ${authUsers.length} users in Supabase Auth:`);
    authUsers.forEach((u: unknown) => {
      const user = u as { email: string; id: string };
      console.log(`  - ${user.email} (ID: ${user.id})`);
    });

    if (authUsers.length === 0) {
      console.log('\n⚠️ No users found in Supabase Auth.');
      console.log('   Please sign up through the UI first.');
      return;
    }

    // Sync each auth user to Prisma
    for (const authUser of authUsers) {
      const user = authUser as { id: string; email: string; created_at: string };
      // Check if user exists in Prisma
      const prismaUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (prismaUser) {
        console.log(`\n✅ User already synced: ${user.email}`);
      } else {
        // Create user in Prisma with matching ID
        const newUser = await prisma.user.create({
          data: {
            id: user.id,
            email: user.email,
            password_hash: 'supabase_auth_managed',
          },
        });

        console.log(`\n✅ Created Prisma user: ${newUser.email} (ID: ${newUser.id})`);

        // Create default preferences
        await prisma.userPreferences.create({
          data: {
            user_id: newUser.id,
            currency_format: 'USD',
            default_view: 'dashboard',
          },
        });

        console.log('✅ Created default preferences');
      }
    }

    console.log('\n🎉 Sync complete!');
  } catch (error: unknown) {
    console.error('\n❌ Sync failed:');
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error:', errorMessage);
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('Code:', (error as { code: string }).code);
    }
  } finally {
    await prisma.$disconnect();
  }
}

syncUser();
