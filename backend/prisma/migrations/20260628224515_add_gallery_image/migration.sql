-- CreateEnum
CREATE TYPE "gallery_type" AS ENUM ('home', 'open_trip', 'private_trip', 'umrah');

-- CreateTable
CREATE TABLE "gallery_image" (
    "id" UUID NOT NULL,
    "imageId" UUID NOT NULL,
    "type" "gallery_type" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "gallery_image_imageId_idx" ON "gallery_image"("imageId");

-- CreateIndex
CREATE INDEX "gallery_image_type_idx" ON "gallery_image"("type");

-- CreateIndex
CREATE UNIQUE INDEX "gallery_image_type_order_key" ON "gallery_image"("type", "order");

-- AddForeignKey
ALTER TABLE "gallery_image" ADD CONSTRAINT "gallery_image_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
