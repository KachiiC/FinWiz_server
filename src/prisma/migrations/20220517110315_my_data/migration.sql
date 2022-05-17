/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `SingleCommodity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "CommoditiesSummary" (
    "id" SERIAL NOT NULL,
    "sub" TEXT NOT NULL,
    "totalValueOf" DOUBLE PRECISION,
    "highestInvestedCommodity" TEXT,
    "highestValuePerCommodity" TEXT,

    CONSTRAINT "CommoditiesSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCommodities" (
    "id" SERIAL NOT NULL,
    "sub" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantityOfCommoditiy" INTEGER NOT NULL,
    "averageBuyPrice" DOUBLE PRECISION NOT NULL,
    "totalCommodityValue" DOUBLE PRECISION NOT NULL,
    "firstBought" TIMESTAMP(3) NOT NULL,
    "lastBought" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCommodities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommoditiesSummary_sub_key" ON "CommoditiesSummary"("sub");

-- CreateIndex
CREATE UNIQUE INDEX "SingleCommodity_name_key" ON "SingleCommodity"("name");

-- AddForeignKey
ALTER TABLE "CommoditiesSummary" ADD CONSTRAINT "CommoditiesSummary_sub_fkey" FOREIGN KEY ("sub") REFERENCES "User"("sub") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCommodities" ADD CONSTRAINT "UserCommodities_sub_fkey" FOREIGN KEY ("sub") REFERENCES "CommoditiesSummary"("sub") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCommodities" ADD CONSTRAINT "UserCommodities_name_fkey" FOREIGN KEY ("name") REFERENCES "SingleCommodity"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
