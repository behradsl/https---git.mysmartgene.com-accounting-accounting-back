/*
  Warnings:

  - Added the required column `settlementStatus` to the `Registry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Registry` ADD COLUMN `settlementStatus` ENUM('SETTLED', 'PENDING', 'OVERDUE') NOT NULL;
