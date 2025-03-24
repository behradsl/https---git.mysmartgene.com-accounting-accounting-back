/*
  Warnings:

  - Made the column `dataSampleReceived` on table `Registry` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Registry` MODIFY `dataSampleReceived` DATETIME(3) NOT NULL;
