/*
  Warnings:

  - You are about to drop the column `DataSentToKorea` on the `Registry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Registry` DROP COLUMN `DataSentToKorea`,
    ADD COLUMN `dataSentToKorea` DATETIME(3) NULL;
