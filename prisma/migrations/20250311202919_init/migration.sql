-- AlterTable
ALTER TABLE `Registry` ADD COLUMN `LaboratoryInvoicesId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `LaboratoryInvoice` (
    `id` VARCHAR(191) NOT NULL,
    `invoiceNumber` INTEGER NOT NULL AUTO_INCREMENT,
    `invoiceDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `LaboratoryId` VARCHAR(191) NOT NULL,
    `currency` ENUM('DOLLAR', 'RIAL') NOT NULL,
    `status` ENUM('DRAFT', 'ISSUED', 'PAID', 'OVERDUE', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
    `paymentDueDate` DATETIME(3) NULL,
    `paymentStatus` ENUM('PAID', 'UNPAID', 'PARTIALLY_PAID') NOT NULL,
    `notes` VARCHAR(191) NULL,
    `totalUsdPrice` DECIMAL(65, 30) NULL,
    `totalRialPrice` DECIMAL(65, 30) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `updatedById` VARCHAR(191) NULL,

    UNIQUE INDEX `LaboratoryInvoice_id_key`(`id`),
    UNIQUE INDEX `LaboratoryInvoice_invoiceNumber_key`(`invoiceNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(191) NOT NULL,
    `LaboratoryId` VARCHAR(191) NOT NULL,
    `LaboratoryInvoiceId` VARCHAR(191) NOT NULL,
    `amountPaid` DECIMAL(65, 30) NOT NULL,
    `paymentDate` DATETIME(3) NOT NULL,
    `currency` ENUM('DOLLAR', 'RIAL') NOT NULL,
    `notes` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `updatedById` VARCHAR(191) NULL,

    UNIQUE INDEX `Payment_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Settlement` (
    `id` VARCHAR(191) NOT NULL,
    `LaboratoryId` VARCHAR(191) NOT NULL,
    `totalInvoiceAmount` DECIMAL(65, 30) NOT NULL,
    `totalPaidAmount` DECIMAL(65, 30) NOT NULL,
    `outStandingAmount` DECIMAL(65, 30) NOT NULL,
    `status` ENUM('PENDING', 'PARTIALLY_SETTLED', 'FULLY_SETTLED', 'OVERDUE') NOT NULL,
    `dueDate` DATETIME(3) NULL,
    `installmentPlan` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `UpdatedAt` DATETIME(3) NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `updatedById` VARCHAR(191) NULL,

    UNIQUE INDEX `Settlement_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Registry` ADD CONSTRAINT `Registry_LaboratoryInvoicesId_fkey` FOREIGN KEY (`LaboratoryInvoicesId`) REFERENCES `LaboratoryInvoice`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaboratoryInvoice` ADD CONSTRAINT `LaboratoryInvoice_LaboratoryId_fkey` FOREIGN KEY (`LaboratoryId`) REFERENCES `Laboratory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaboratoryInvoice` ADD CONSTRAINT `LaboratoryInvoice_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaboratoryInvoice` ADD CONSTRAINT `LaboratoryInvoice_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_LaboratoryId_fkey` FOREIGN KEY (`LaboratoryId`) REFERENCES `Laboratory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_LaboratoryInvoiceId_fkey` FOREIGN KEY (`LaboratoryInvoiceId`) REFERENCES `LaboratoryInvoice`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Settlement` ADD CONSTRAINT `Settlement_LaboratoryId_fkey` FOREIGN KEY (`LaboratoryId`) REFERENCES `Laboratory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Settlement` ADD CONSTRAINT `Settlement_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Settlement` ADD CONSTRAINT `Settlement_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
