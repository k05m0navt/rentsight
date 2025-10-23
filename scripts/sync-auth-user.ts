import { syncAllUsers } from '../src/lib/user-sync';

async function syncUser() {
  console.log('Syncing Supabase Auth users with Prisma database...\n');

  try {
    const result = await syncAllUsers();
    
    if (result.success) {
      console.log(`\n🎉 Sync complete!`);
      console.log(`✅ Synced ${result.synced} users`);
      
      if (result.errors.length > 0) {
        console.log(`\n⚠️ ${result.errors.length} errors occurred:`);
        result.errors.forEach(error => console.log(`  - ${error}`));
      }
    } else {
      console.error('\n❌ Sync failed:');
      result.errors.forEach(error => console.error(`  - ${error}`));
    }
  } catch (error: unknown) {
    console.error('\n❌ Sync failed:');
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error:', errorMessage);
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('Code:', (error as { code: string }).code);
    }
  }
}

syncUser();
