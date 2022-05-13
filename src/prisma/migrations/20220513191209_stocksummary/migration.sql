-- DropForeignKey
ALTER TABLE "StockSummary" DROP CONSTRAINT "StockSummary_sub_fkey";

-- AlterTable
ALTER TABLE "StockSummary" ALTER COLUMN "currentTotalAmount" DROP NOT NULL,
ALTER COLUMN "oldestStock" DROP NOT NULL,
ALTER COLUMN "newestStock" DROP NOT NULL,
ALTER COLUMN "stockWithMostShares" DROP NOT NULL,
ALTER COLUMN "highestInvestmentStock" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_sub_fkey" FOREIGN KEY ("sub") REFERENCES "StockSummary"("sub") ON DELETE RESTRICT ON UPDATE CASCADE;
