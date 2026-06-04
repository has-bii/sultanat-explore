/*
  Warnings:

  - Added the required column `fileSize` to the `image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "image" ADD COLUMN     "blurHash" TEXT,
ADD COLUMN     "fileSize" INTEGER NOT NULL;
