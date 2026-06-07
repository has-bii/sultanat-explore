-- AlterTable: Drop label, add slug
ALTER TABLE "attraction_category" DROP COLUMN "label",
ADD COLUMN "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "attraction_category_slug_key" ON "attraction_category"("slug");

-- AlterTable: Make categoryId nullable
ALTER TABLE "attraction" ALTER COLUMN "categoryId" DROP NOT NULL;

-- DropForeignKey
ALTER TABLE "attraction" DROP CONSTRAINT "attraction_categoryId_fkey";

-- AddForeignKey (SetNull)
ALTER TABLE "attraction" ADD CONSTRAINT "attraction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "attraction_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
