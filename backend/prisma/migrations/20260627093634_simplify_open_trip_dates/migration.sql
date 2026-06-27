/*
  Warnings:

  - You are about to drop the column `order` on the `open_trip_city` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `open_trip_destination` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "open_trip_city_openTripId_order_key";

-- DropIndex
DROP INDEX "open_trip_destination_openTripCityId_order_key";

-- AlterTable
ALTER TABLE "open_trip_city" DROP COLUMN "order";

-- AlterTable
ALTER TABLE "open_trip_destination" DROP COLUMN "order";
