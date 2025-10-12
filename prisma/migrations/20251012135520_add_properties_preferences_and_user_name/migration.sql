-- AlterTable
ALTER TABLE "ExpenseEntry" ADD COLUMN     "property_id" TEXT;

-- AlterTable
ALTER TABLE "RentEntry" ADD COLUMN     "property_id" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT;

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "property_type" TEXT,
    "start_date" DATE,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreferences" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "currency_format" TEXT NOT NULL DEFAULT 'USD',
    "date_format" TEXT NOT NULL DEFAULT 'MM/DD/YYYY',
    "language" TEXT NOT NULL DEFAULT 'en',
    "default_view" TEXT NOT NULL DEFAULT 'dashboard',
    "theme_preference" TEXT,
    "preferences" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Property_user_id_idx" ON "Property"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Property_user_id_name_key" ON "Property"("user_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_user_id_key" ON "UserPreferences"("user_id");

-- CreateIndex
CREATE INDEX "ExpenseEntry_property_id_idx" ON "ExpenseEntry"("property_id");

-- CreateIndex
CREATE INDEX "RentEntry_property_id_idx" ON "RentEntry"("property_id");

-- AddForeignKey
ALTER TABLE "RentEntry" ADD CONSTRAINT "RentEntry_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseEntry" ADD CONSTRAINT "ExpenseEntry_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
