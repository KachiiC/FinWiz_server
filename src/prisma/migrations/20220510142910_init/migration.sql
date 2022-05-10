-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStock" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "entry_value_per_share" DOUBLE PRECISION NOT NULL,
    "number_of_shares" INTEGER NOT NULL,
    "total_value_of_shares" DOUBLE PRECISION NOT NULL,
    "first_bought" TIMESTAMP(3) NOT NULL,
    "last_bought" TIMESTAMP(3) NOT NULL,
    "single_stock_id" INTEGER NOT NULL,

    CONSTRAINT "UserStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SingleStock" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "market_value_per_share" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SingleStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCrypto" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "quantity_of_crypto" DOUBLE PRECISION NOT NULL,
    "average_value_per_crypto" DOUBLE PRECISION NOT NULL,
    "total_crypto_value" DOUBLE PRECISION NOT NULL,
    "first_bought" TIMESTAMP(3) NOT NULL,
    "last_bought" TIMESTAMP(3) NOT NULL,
    "single_crypto_id" INTEGER NOT NULL,

    CONSTRAINT "UserCrypto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SingleCrypto" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "market_value_per_crypto" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SingleCrypto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "UserStock" ADD CONSTRAINT "UserStock_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStock" ADD CONSTRAINT "UserStock_single_stock_id_fkey" FOREIGN KEY ("single_stock_id") REFERENCES "SingleStock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCrypto" ADD CONSTRAINT "UserCrypto_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCrypto" ADD CONSTRAINT "UserCrypto_single_crypto_id_fkey" FOREIGN KEY ("single_crypto_id") REFERENCES "SingleCrypto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
