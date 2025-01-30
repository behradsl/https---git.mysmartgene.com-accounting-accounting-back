/*
  Warnings:

  - Added the required column `phoneNumber` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `phoneNumber` VARCHAR(20) NOT NULL,
    ADD COLUMN `position` ENUM('ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'SALES_REPRESENTATIVE', 'DATA_ENTRY') NOT NULL,
    MODIFY `email` VARCHAR(255) NOT NULL,
    MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `updatedAt` DATETIME(3) NULL,
    ADD PRIMARY KEY (`id`);
