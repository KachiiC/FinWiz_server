/*
  Warnings:

  - You are about to drop the `UserCommodities` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserCommodities" DROP CONSTRAINT "UserCommodities_name_fkey";

-- DropForeignKey
ALTER TABLE "UserCommodities" DROP CONSTRAINT "UserCommodities_sub_fkey";

-- DropTable
DROP TABLE "UserCommodities";

-- CreateTable
CREATE TABLE "UserCommodity" (
    "id" SERIAL NOT NULL,
    "sub" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantityOfCommoditiy" INTEGER NOT NULL,
    "averageBuyPrice" DOUBLE PRECISION NOT NULL,
    "totalCommodityValue" DOUBLE PRECISION NOT NULL,
    "firstBought" TIMESTAMP(3) NOT NULL,
    "lastBought" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCommodity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserCommodity" ADD CONSTRAINT "UserCommodity_sub_fkey" FOREIGN KEY ("sub") REFERENCES "CommoditiesSummary"("sub") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCommodity" ADD CONSTRAINT "UserCommodity_name_fkey" FOREIGN KEY ("name") REFERENCES "SingleCommodity"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
