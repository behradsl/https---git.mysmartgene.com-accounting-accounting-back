/*
  Warnings:

  - A unique constraint covering the columns `[MotId]` on the table `Registry` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Registry` MODIFY `MotId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Registry_MotId_key` ON `Registry`(`MotId`);
