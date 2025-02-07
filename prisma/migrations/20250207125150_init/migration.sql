-- CreateTable
CREATE TABLE `FieldAccess` (
    `id` VARCHAR(191) NOT NULL,
    `position` ENUM('ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'SALES_REPRESENTATIVE', 'DATA_ENTRY') NOT NULL,
    `registryPermissions` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `FieldAccess_id_key`(`id`),
    UNIQUE INDEX `FieldAccess_position_key`(`position`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
