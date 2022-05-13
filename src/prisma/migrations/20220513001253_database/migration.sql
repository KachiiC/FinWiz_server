-- AlterTable
ALTER TABLE "StockSummary" ALTER COLUMN "currentTotalAmount" DROP NOT NULL,
ALTER COLUMN "oldestStock" DROP NOT NULL,
ALTER COLUMN "newestStock" DROP NOT NULL,
ALTER COLUMN "stockWithMostShares" DROP NOT NULL,
ALTER COLUMN "highestInvestmentStock" DROP NOT NULL;
