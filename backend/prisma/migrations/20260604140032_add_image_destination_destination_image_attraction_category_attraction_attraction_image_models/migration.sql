-- CreateTable
CREATE TABLE "image" (
    "id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destination" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageId" UUID NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "highlights" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "destination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destination_image" (
    "destinationId" UUID NOT NULL,
    "imageId" UUID NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "destination_image_pkey" PRIMARY KEY ("destinationId","imageId")
);

-- CreateTable
CREATE TABLE "attraction_category" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attraction_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attraction" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "destinationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attraction_image" (
    "attractionId" UUID NOT NULL,
    "imageId" UUID NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "attraction_image_pkey" PRIMARY KEY ("attractionId","imageId")
);

-- CreateIndex
CREATE UNIQUE INDEX "destination_slug_key" ON "destination"("slug");

-- CreateIndex
CREATE INDEX "destination_imageId_idx" ON "destination"("imageId");

-- CreateIndex
CREATE INDEX "destination_image_destinationId_idx" ON "destination_image"("destinationId");

-- CreateIndex
CREATE INDEX "destination_image_imageId_idx" ON "destination_image"("imageId");

-- CreateIndex
CREATE INDEX "attraction_imageId_idx" ON "attraction"("imageId");

-- CreateIndex
CREATE INDEX "attraction_categoryId_idx" ON "attraction"("categoryId");

-- CreateIndex
CREATE INDEX "attraction_destinationId_idx" ON "attraction"("destinationId");

-- CreateIndex
CREATE INDEX "attraction_image_attractionId_idx" ON "attraction_image"("attractionId");

-- CreateIndex
CREATE INDEX "attraction_image_imageId_idx" ON "attraction_image"("imageId");

-- AddForeignKey
ALTER TABLE "destination" ADD CONSTRAINT "destination_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destination_image" ADD CONSTRAINT "destination_image_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destination_image" ADD CONSTRAINT "destination_image_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attraction" ADD CONSTRAINT "attraction_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attraction" ADD CONSTRAINT "attraction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "attraction_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attraction" ADD CONSTRAINT "attraction_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attraction_image" ADD CONSTRAINT "attraction_image_attractionId_fkey" FOREIGN KEY ("attractionId") REFERENCES "attraction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attraction_image" ADD CONSTRAINT "attraction_image_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
