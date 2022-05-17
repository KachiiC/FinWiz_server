-- CreateTable
CREATE TABLE "SingleCommodity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "change" DOUBLE PRECISION,
    "change_percentage" DOUBLE PRECISION,
    "high" DOUBLE PRECISION,
    "low" DOUBLE PRECISION,
    "last" DOUBLE PRECISION,
    "last_close" DOUBLE PRECISION,

    CONSTRAINT "SingleCommodity_pkey" PRIMARY KEY ("id")
);
