-- CreateEnum
CREATE TYPE "open_trip_status" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "inclusion_type" AS ENUM ('include', 'exclude');

-- CreateTable
CREATE TABLE "open_trip" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "description" JSONB NOT NULL,
    "price" INTEGER NOT NULL,
    "coverImageId" UUID NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "status" "open_trip_status" NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "open_trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "open_trip_city" (
    "id" UUID NOT NULL,
    "openTripId" UUID NOT NULL,
    "cityId" UUID NOT NULL,
    "arriveAt" TIMESTAMP(3) NOT NULL,
    "departAt" TIMESTAMP(3),
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "open_trip_city_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "open_trip_destination" (
    "id" UUID NOT NULL,
    "openTripCityId" UUID NOT NULL,
    "destinationId" UUID NOT NULL,
    "visitAt" TIMESTAMP(3) NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "open_trip_destination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inclusion_item" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inclusion_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "open_trip_inclusion" (
    "id" UUID NOT NULL,
    "openTripId" UUID NOT NULL,
    "inclusionItemId" UUID NOT NULL,
    "type" "inclusion_type" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "open_trip_inclusion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "open_trip_slug_key" ON "open_trip"("slug");

-- CreateIndex
CREATE INDEX "open_trip_coverImageId_idx" ON "open_trip"("coverImageId");

-- CreateIndex
CREATE INDEX "open_trip_status_publishedAt_idx" ON "open_trip"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "open_trip_startAt_idx" ON "open_trip"("startAt");

-- CreateIndex
CREATE INDEX "open_trip_city_openTripId_idx" ON "open_trip_city"("openTripId");

-- CreateIndex
CREATE INDEX "open_trip_city_cityId_idx" ON "open_trip_city"("cityId");

-- CreateIndex
CREATE UNIQUE INDEX "open_trip_city_openTripId_order_key" ON "open_trip_city"("openTripId", "order");

-- CreateIndex
CREATE INDEX "open_trip_destination_openTripCityId_idx" ON "open_trip_destination"("openTripCityId");

-- CreateIndex
CREATE INDEX "open_trip_destination_destinationId_idx" ON "open_trip_destination"("destinationId");

-- CreateIndex
CREATE UNIQUE INDEX "open_trip_destination_openTripCityId_order_key" ON "open_trip_destination"("openTripCityId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "inclusion_item_slug_key" ON "inclusion_item"("slug");

-- CreateIndex
CREATE INDEX "open_trip_inclusion_openTripId_idx" ON "open_trip_inclusion"("openTripId");

-- CreateIndex
CREATE INDEX "open_trip_inclusion_inclusionItemId_idx" ON "open_trip_inclusion"("inclusionItemId");

-- CreateIndex
CREATE UNIQUE INDEX "open_trip_inclusion_openTripId_inclusionItemId_key" ON "open_trip_inclusion"("openTripId", "inclusionItemId");

-- AddForeignKey
ALTER TABLE "open_trip" ADD CONSTRAINT "open_trip_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "open_trip_city" ADD CONSTRAINT "open_trip_city_openTripId_fkey" FOREIGN KEY ("openTripId") REFERENCES "open_trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "open_trip_city" ADD CONSTRAINT "open_trip_city_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "open_trip_destination" ADD CONSTRAINT "open_trip_destination_openTripCityId_fkey" FOREIGN KEY ("openTripCityId") REFERENCES "open_trip_city"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "open_trip_destination" ADD CONSTRAINT "open_trip_destination_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "open_trip_inclusion" ADD CONSTRAINT "open_trip_inclusion_openTripId_fkey" FOREIGN KEY ("openTripId") REFERENCES "open_trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "open_trip_inclusion" ADD CONSTRAINT "open_trip_inclusion_inclusionItemId_fkey" FOREIGN KEY ("inclusionItemId") REFERENCES "inclusion_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
