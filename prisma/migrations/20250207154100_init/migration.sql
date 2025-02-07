/*
  Warnings:

  - You are about to drop the column `createdAt` on the `FieldAccess` table. All the data in the column will be lost.
  - The values [FULL] on the enum `FieldAccess_access` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `updatedAt` on table `FieldAccess` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `FieldAccess` DROP COLUMN `createdAt`,
    MODIFY `access` ENUM('EDITABLE', 'VISIBLE', 'HIDDEN') NOT NULL,
    MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
