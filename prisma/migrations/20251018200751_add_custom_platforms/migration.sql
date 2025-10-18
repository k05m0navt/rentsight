-- CreateTable
CREATE TABLE "CustomPlatform" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "usage_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomPlatform_pkey" PRIMARY KEY ("id")
);

-- AddColumn
ALTER TABLE "RentEntry" ADD COLUMN     "custom_platform_name" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "CustomPlatform_user_id_name_key" ON "CustomPlatform"("user_id", "name");

-- CreateIndex
CREATE INDEX "CustomPlatform_user_id_idx" ON "CustomPlatform"("user_id");

-- AddForeignKey
ALTER TABLE "CustomPlatform" ADD CONSTRAINT "CustomPlatform_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
