/*
  Warnings:

  - You are about to drop the column `market_value_per_crypto` on the `SingleCrypto` table. All the data in the column will be lost.
  - You are about to drop the column `market_value_per_share` on the `SingleStock` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `average_value_per_crypto` on the `UserCrypto` table. All the data in the column will be lost.
  - You are about to drop the column `first_bought` on the `UserCrypto` table. All the data in the column will be lost.
  - You are about to drop the column `last_bought` on the `UserCrypto` table. All the data in the column will be lost.
  - You are about to drop the column `quantity_of_crypto` on the `UserCrypto` table. All the data in the column will be lost.
  - You are about to drop the column `single_crypto_id` on the `UserCrypto` table. All the data in the column will be lost.
  - You are about to drop the column `total_crypto_value` on the `UserCrypto` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `UserCrypto` table. All the data in the column will be lost.
  - You are about to drop the column `entry_value_per_share` on the `UserStock` table. All the data in the column will be lost.
  - You are about to drop the column `first_bought` on the `UserStock` table. All the data in the column will be lost.
  - You are about to drop the column `last_bought` on the `UserStock` table. All the data in the column will be lost.
  - You are about to drop the column `number_of_shares` on the `UserStock` table. All the data in the column will be lost.
  - You are about to drop the column `single_stock_id` on the `UserStock` table. All the data in the column will be lost.
  - You are about to drop the column `total_value_of_shares` on the `UserStock` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `UserStock` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[symbol]` on the table `SingleCrypto` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[symbol]` on the table `SingleStock` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sub]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sub]` on the table `UserCrypto` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `marketValuePerCrypto` to the `SingleCrypto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marketValuePerShare` to the `SingleStock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sub` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `averageValuePerCrypto` to the `UserCrypto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstBought` to the `UserCrypto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastBought` to the `UserCrypto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantityOfCrypto` to the `UserCrypto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sub` to the `UserCrypto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbol` to the `UserCrypto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalCryptoValue` to the `UserCrypto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entryValuePerShare` to the `UserStock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstBought` to the `UserStock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastBought` to the `UserStock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfShares` to the `UserStock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sub` to the `UserStock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbol` to the `UserStock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalValueOfShares` to the `UserStock` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserCrypto" DROP CONSTRAINT "UserCrypto_single_crypto_id_fkey";

-- DropForeignKey
ALTER TABLE "UserCrypto" DROP CONSTRAINT "UserCrypto_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserStock" DROP CONSTRAINT "UserStock_single_stock_id_fkey";

-- DropForeignKey
ALTER TABLE "UserStock" DROP CONSTRAINT "UserStock_user_id_fkey";

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "SingleCrypto" DROP COLUMN "market_value_per_crypto",
ADD COLUMN     "marketValuePerCrypto" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "SingleStock" DROP COLUMN "market_value_per_share",
ADD COLUMN     "marketValuePerShare" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "name",
ADD COLUMN     "sub" TEXT NOT NULL,
ADD COLUMN     "totalInvestmentValue" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "UserCrypto" DROP COLUMN "average_value_per_crypto",
DROP COLUMN "first_bought",
DROP COLUMN "last_bought",
DROP COLUMN "quantity_of_crypto",
DROP COLUMN "single_crypto_id",
DROP COLUMN "total_crypto_value",
DROP COLUMN "user_id",
ADD COLUMN     "averageValuePerCrypto" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "firstBought" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "lastBought" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "quantityOfCrypto" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "sub" TEXT NOT NULL,
ADD COLUMN     "symbol" TEXT NOT NULL,
ADD COLUMN     "totalCryptoValue" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "UserStock" DROP COLUMN "entry_value_per_share",
DROP COLUMN "first_bought",
DROP COLUMN "last_bought",
DROP COLUMN "number_of_shares",
DROP COLUMN "single_stock_id",
DROP COLUMN "total_value_of_shares",
DROP COLUMN "user_id",
ADD COLUMN     "entryValuePerShare" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "firstBought" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "lastBought" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "numberOfShares" INTEGER NOT NULL,
ADD COLUMN     "sub" TEXT NOT NULL,
ADD COLUMN     "symbol" TEXT NOT NULL,
ADD COLUMN     "totalValueOfShares" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "UserInvestmentValues" (
    "id" SERIAL NOT NULL,
    "sub" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "UserInvestmentValues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockSummary" (
    "id" SERIAL NOT NULL,
    "sub" TEXT NOT NULL,
    "currentTotalAmount" DOUBLE PRECISION NOT NULL,
    "oldestStock" TEXT NOT NULL,
    "newestStock" TEXT NOT NULL,
    "stockWithMostShares" TEXT NOT NULL,
    "highestInvestmentStock" TEXT NOT NULL,

    CONSTRAINT "StockSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CryptoSummary" (
    "id" SERIAL NOT NULL,
    "sub" TEXT NOT NULL,
    "totalValueOf" DOUBLE PRECISION NOT NULL,
    "numberOfDifferent" INTEGER NOT NULL,
    "highestInvestedCurrency" TEXT NOT NULL,
    "highestValuePerCurrency" TEXT NOT NULL,
    "lowestValuePerCurrency" TEXT NOT NULL,
    "highestOwnedVolume" TEXT NOT NULL,
    "lowestOwnedVolume" TEXT NOT NULL,
    "newestBoughtCurrency" TEXT NOT NULL,
    "oldestBoughtCurrency" TEXT NOT NULL,

    CONSTRAINT "CryptoSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StockSummary_sub_key" ON "StockSummary"("sub");

-- CreateIndex
CREATE UNIQUE INDEX "CryptoSummary_sub_key" ON "CryptoSummary"("sub");

-- CreateIndex
CREATE UNIQUE INDEX "SingleCrypto_symbol_key" ON "SingleCrypto"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "SingleStock_symbol_key" ON "SingleStock"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "User_sub_key" ON "User"("sub");

-- CreateIndex
CREATE UNIQUE INDEX "UserCrypto_sub_key" ON "UserCrypto"("sub");

-- AddForeignKey
ALTER TABLE "UserInvestmentValues" ADD CONSTRAINT "UserInvestmentValues_sub_fkey" FOREIGN KEY ("sub") REFERENCES "User"("sub") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockSummary" ADD CONSTRAINT "StockSummary_sub_fkey" FOREIGN KEY ("sub") REFERENCES "User"("sub") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStock" ADD CONSTRAINT "UserStock_sub_fkey" FOREIGN KEY ("sub") REFERENCES "StockSummary"("sub") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStock" ADD CONSTRAINT "UserStock_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "SingleStock"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CryptoSummary" ADD CONSTRAINT "CryptoSummary_sub_fkey" FOREIGN KEY ("sub") REFERENCES "User"("sub") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCrypto" ADD CONSTRAINT "UserCrypto_sub_fkey" FOREIGN KEY ("sub") REFERENCES "CryptoSummary"("sub") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCrypto" ADD CONSTRAINT "UserCrypto_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "SingleCrypto"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;
