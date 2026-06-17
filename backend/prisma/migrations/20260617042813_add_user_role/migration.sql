-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('admin', 'author');

-- DropForeignKey
ALTER TABLE "article" DROP CONSTRAINT "article_authorId_fkey";

-- AlterTable
ALTER TABLE "article" ALTER COLUMN "authorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" "user_role" NOT NULL DEFAULT 'admin';

-- AddForeignKey
ALTER TABLE "article" ADD CONSTRAINT "article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
