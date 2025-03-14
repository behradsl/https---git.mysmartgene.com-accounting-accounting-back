/*
  Warnings:

  - You are about to drop the column `totalPriceRial` on the `Registry` table. All the data in the column will be lost.
  - You are about to drop the column `usdExchangeRate` on the `Registry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Registry` DROP COLUMN `totalPriceRial`,
    DROP COLUMN `usdExchangeRate`;
