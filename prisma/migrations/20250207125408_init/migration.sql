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
    `registryPermissions` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `RegistryFieldAccess_id_key`(`id`),
    UNIQUE INDEX `RegistryFieldAccess_position_key`(`position`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
