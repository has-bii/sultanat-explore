/*
  Warnings:

  - Made the column `blurHash` on table `image` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "image" ALTER COLUMN "blurHash" SET NOT NULL;
