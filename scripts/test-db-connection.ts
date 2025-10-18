import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  console.log('Testing database connection...');

  try {
    // Simple query to test connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database connection successful!');
    console.log('Result:', result);

    // Check if our new tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN ('Property', 'UserPreferences')
    `;
    console.log('\n✅ Migration tables check:');
    console.log(tables);

    // Check for existing users
    const userCount = await prisma.user.count();
    console.log(`\n✅ Found ${userCount} users in database`);
  } catch (error: any) {
    console.error('❌ Database connection failed:');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
