/**
 * Create Default Preferences Script
 *
 * This script creates default UserPreferences for all existing users
 * who don't have preferences yet. This ensures backward compatibility
 * after adding the new preference fields.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createDefaultPreferences() {
  console.log('🔄 Creating default preferences for existing users...\n');

  try {
    // Get all users without preferences
    const usersWithoutPreferences = await prisma.user.findMany({
      where: {
        preferences: null,
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (usersWithoutPreferences.length === 0) {
      console.log('✅ All users already have preferences');
      return;
    }

    console.log(`Found ${usersWithoutPreferences.length} users without preferences`);

    // Create default preferences for each user
    let successCount = 0;
    let errorCount = 0;

    for (const user of usersWithoutPreferences) {
      try {
        await prisma.userPreferences.create({
          data: {
            user_id: user.id,
            currency: 'USD',
            numberFormat: 'en-US',
            preferredPlatforms: [],
            default_view: 'dashboard',
            // Legacy fields for backward compatibility
            currency_format: 'USD',
          },
        });

        successCount++;
        console.log(`✅ Created preferences for user: ${user.email}`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Failed to create preferences for user: ${user.email}`, error);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Success: ${successCount} users`);
    if (errorCount > 0) {
      console.log(`   ❌ Errors: ${errorCount} users`);
    }
    console.log(`\n✨ Default preferences creation complete!`);
  } catch (error) {
    console.error('❌ Error running seed script:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createDefaultPreferences()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
