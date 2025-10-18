-- AlterTable
ALTER TABLE "UserPreferences" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "dateFormat" TEXT NOT NULL DEFAULT 'MM/DD/YYYY',
ADD COLUMN     "numberFormat" TEXT NOT NULL DEFAULT 'en-US',
ADD COLUMN     "preferredPlatforms" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "reducedMotion" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "theme" TEXT NOT NULL DEFAULT 'system';
