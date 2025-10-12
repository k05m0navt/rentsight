import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting data migration: Creating default preferences for existing users...');

  // Find all users without preferences
  const usersWithoutPreferences = await prisma.user.findMany({
    where: {
      preferences: null,
    },
    select: {
      id: true,
      email: true,
    },
  });

  console.log(`Found ${usersWithoutPreferences.length} users without preferences`);

  // Create default preferences for each user
  let created = 0;
  for (const user of usersWithoutPreferences) {
    try {
      await prisma.userPreferences.create({
        data: {
          user_id: user.id,
          currency_format: 'USD',
          date_format: 'MM/DD/YYYY',
          language: 'en',
          default_view: 'dashboard',
        },
      });
      created++;
      console.log(`Created preferences for user: ${user.email}`);
    } catch (error) {
      console.error(`Failed to create preferences for user ${user.email}:`, error);
    }
  }

  console.log(`\nData migration complete:`);
  console.log(`- Total users checked: ${usersWithoutPreferences.length}`);
  console.log(`- Preferences created: ${created}`);
}

main()
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

