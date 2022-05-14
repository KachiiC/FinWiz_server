-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_sub_fkey";

-- AddForeignKey
ALTER TABLE "StockSummary" ADD CONSTRAINT "StockSummary_sub_fkey" FOREIGN KEY ("sub") REFERENCES "User"("sub") ON DELETE RESTRICT ON UPDATE CASCADE;
