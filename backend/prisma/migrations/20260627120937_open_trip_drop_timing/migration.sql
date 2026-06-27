/*
  Warnings:

  - You are about to drop the column `departAt` on the `open_trip_city` table. All the data in the column will be lost.
  - You are about to drop the column `visitAt` on the `open_trip_destination` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[openTripCityId,order]` on the table `open_trip_destination` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `order` to the `open_trip_destination` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "open_trip_city" DROP COLUMN "departAt";

-- AlterTable
ALTER TABLE "open_trip_destination" DROP COLUMN "visitAt",
ADD COLUMN     "order" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "open_trip_destination_openTripCityId_order_key" ON "open_trip_destination"("openTripCityId", "order");
