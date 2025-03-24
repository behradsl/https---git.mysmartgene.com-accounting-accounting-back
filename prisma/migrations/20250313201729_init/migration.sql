/*
  Warnings:

  - You are about to drop the column `currency` on the `LaboratoryInvoice` table. All the data in the column will be lost.
  - You are about to drop the column `totalRialPrice` on the `LaboratoryInvoice` table. All the data in the column will be lost.
  - Added the required column `totalPriceRial` to the `LaboratoryInvoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usdExchangeRate` to the `LaboratoryInvoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `LaboratoryInvoice` DROP COLUMN `currency`,
    DROP COLUMN `totalRialPrice`,
    ADD COLUMN `totalPriceRial` DECIMAL(65, 30) NOT NULL,
    ADD COLUMN `usdExchangeRate` DECIMAL(65, 30) NOT NULL;
