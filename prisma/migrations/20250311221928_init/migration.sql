/*
  Warnings:

  - You are about to drop the column `LaboratoryInvoicesId` on the `Registry` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Registry` DROP FOREIGN KEY `Registry_LaboratoryInvoicesId_fkey`;

-- DropIndex
DROP INDEX `Registry_LaboratoryInvoicesId_fkey` ON `Registry`;

-- AlterTable
ALTER TABLE `Registry` DROP COLUMN `LaboratoryInvoicesId`,
    ADD COLUMN `LaboratoryInvoiceId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Registry` ADD CONSTRAINT `Registry_LaboratoryInvoiceId_fkey` FOREIGN KEY (`LaboratoryInvoiceId`) REFERENCES `LaboratoryInvoice`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
