/*
  Warnings:

  - You are about to drop the `Settlement` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `outstandingAmount` to the `LaboratoryInvoice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Settlement` DROP FOREIGN KEY `Settlement_LaboratoryId_fkey`;

-- DropForeignKey
ALTER TABLE `Settlement` DROP FOREIGN KEY `Settlement_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `Settlement` DROP FOREIGN KEY `Settlement_updatedById_fkey`;

-- AlterTable
ALTER TABLE `LaboratoryInvoice` ADD COLUMN `outstandingAmount` DECIMAL(65, 30) NOT NULL;

-- DropTable
DROP TABLE `Settlement`;
