-- CreateTable
CREATE TABLE "city_category" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "city_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CityToCityCategory" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_CityToCityCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "city_category_slug_key" ON "city_category"("slug");

-- CreateIndex
CREATE INDEX "_CityToCityCategory_B_index" ON "_CityToCityCategory"("B");

-- AddForeignKey
ALTER TABLE "_CityToCityCategory" ADD CONSTRAINT "_CityToCityCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "city"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CityToCityCategory" ADD CONSTRAINT "_CityToCityCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "city_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
