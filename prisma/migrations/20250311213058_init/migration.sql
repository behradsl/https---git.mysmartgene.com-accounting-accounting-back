/*
  Warnings:

  - Made the column `totalUsdPrice` on table `LaboratoryInvoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `totalRialPrice` on table `LaboratoryInvoice` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `LaboratoryInvoice` MODIFY `totalUsdPrice` DECIMAL(65, 30) NOT NULL,
    MODIFY `totalRialPrice` DECIMAL(65, 30) NOT NULL;

-- AlterTable
ALTER TABLE `Payment` MODIFY `notes` VARCHAR(191) NULL;
