/*
  Warnings:

  - You are about to drop the `FieldAccess` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `FieldAccess`;

-- CreateTable
CREATE TABLE `RegistryFieldAccess` (
    `id` VARCHAR(191) NOT NULL,
    `position` ENUM('ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'SALES_REPRESENTATIVE', 'DATA_ENTRY') NOT NULL,
    `registryField` VARCHAR(255) NOT NULL,
    `access` ENUM('EDITABLE', 'VISIBLE', 'HIDDEN') NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `RegistryFieldAccess_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
