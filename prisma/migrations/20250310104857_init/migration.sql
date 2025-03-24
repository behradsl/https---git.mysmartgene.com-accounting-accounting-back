/*
  Warnings:

  - You are about to drop the column `KoreaSendDate` on the `Registry` table. All the data in the column will be lost.
  - You are about to drop the column `costumerRelationInfo` on the `Registry` table. All the data in the column will be lost.
  - You are about to drop the column `installmentOne` on the `Registry` table. All the data in the column will be lost.
  - You are about to drop the column `installmentOneDate` on the `Registry` table. All the data in the column will be lost.
  - You are about to drop the column `installmentThree` on the `Registry` table. All the data in the column will be lost.
  - You are about to drop the column `installmentThreeDate` on the `Registry` table. All the data in the column will be lost.
  - You are about to drop the column `installmentTwo` on the `Registry` table. All the data in the column will be lost.
  - You are about to drop the column `installmentTwoDate` on the `Registry` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Registry` table. All the data in the column will be lost.
  - You are about to drop the column `officialInvoiceSent` on the `Registry` table. All the data in the column will be lost.
  - You are about to drop the column `officialInvoiceSentDate` on the `Registry` table. All the data in the column will be lost.
  - You are about to drop the column `paymentPercentage` on the `Registry` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Registry` table. All the data in the column will be lost.
  - You are about to drop the column `proformaSent` on the `Registry` table. All the data in the column will be lost.
  - You are about to drop the column `proformaSentDate` on the `Registry` table. All the data in the column will be lost.
  - You are about to drop the column `resultReady` on the `Registry` table. All the data in the column will be lost.
  - You are about to drop the column `settlementDate` on the `Registry` table. All the data in the column will be lost.
  - You are about to drop the column `totalInvoiceAmount` on the `Registry` table. All the data in the column will be lost.
  - You are about to drop the column `totalPaid` on the `Registry` table. All the data in the column will be lost.
  - The values [NOT_ISSUED] on the enum `Registry_invoiceStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [PENDING,SHIPMENT,SHIPPED,RECEIVED_AT_LABORATORY,IN_TESTING,READY_FOR_DELIVERY,DELIVERED] on the enum `Registry_sampleStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `sendSeries` on the `Registry` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - Added the required column `personName` to the `Registry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sampleType` to the `Registry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Registry` DROP COLUMN `KoreaSendDate`,
    DROP COLUMN `costumerRelationInfo`,
    DROP COLUMN `installmentOne`,
    DROP COLUMN `installmentOneDate`,
    DROP COLUMN `installmentThree`,
    DROP COLUMN `installmentThreeDate`,
    DROP COLUMN `installmentTwo`,
    DROP COLUMN `installmentTwoDate`,
    DROP COLUMN `name`,
    DROP COLUMN `officialInvoiceSent`,
    DROP COLUMN `officialInvoiceSentDate`,
    DROP COLUMN `paymentPercentage`,
    DROP COLUMN `price`,
    DROP COLUMN `proformaSent`,
    DROP COLUMN `proformaSentDate`,
    DROP COLUMN `resultReady`,
    DROP COLUMN `settlementDate`,
    DROP COLUMN `totalInvoiceAmount`,
    DROP COLUMN `totalPaid`,
    ADD COLUMN `DataSentToKorea` DATETIME(3) NULL,
    ADD COLUMN `analysisCompletionDate` DATETIME(3) NULL,
    ADD COLUMN `costumerRelationId` VARCHAR(191) NULL,
    ADD COLUMN `dataSampleReceived` DATETIME(3) NULL,
    ADD COLUMN `personName` TINYTEXT NOT NULL,
    ADD COLUMN `productPriceUsd` DECIMAL(65, 30) NULL,
    ADD COLUMN `rawFileReceivedDate` DATETIME(3) NULL,
    ADD COLUMN `sampleExtractionDate` DATETIME(3) NULL,
    ADD COLUMN `sampleType` ENUM('BLOOD_DNA', 'TISSUE', 'EMBRYO') NOT NULL,
    ADD COLUMN `totalPriceRial` DECIMAL(65, 30) NULL,
    ADD COLUMN `usdExchangeRate` DECIMAL(65, 30) NULL,
    MODIFY `invoiceStatus` ENUM('DRAFT', 'ISSUED', 'PAID', 'OVERDUE', 'CANCELLED') NOT NULL,
    MODIFY `sampleStatus` ENUM('SAMPLE_RECEIVED', 'DNA_EXTRACTED', 'SENT_TO_KOREA', 'RAW_FILE_RECEIVED', 'ANALYZED') NOT NULL,
    MODIFY `sendSeries` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Registry` ADD CONSTRAINT `Registry_costumerRelationId_fkey` FOREIGN KEY (`costumerRelationId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
