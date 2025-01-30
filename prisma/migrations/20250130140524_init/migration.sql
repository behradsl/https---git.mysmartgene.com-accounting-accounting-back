-- CreateTable
CREATE TABLE `Laboratory` (
    `id` VARCHAR(191) NOT NULL,
    `name` TINYTEXT NOT NULL,
    `type` ENUM('LABORATORY', 'RESEARCH_CENTER', 'INDIVIDUAL') NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `address` TEXT NOT NULL,
    `contactName` TINYTEXT NOT NULL,
    `phoneNumber` TINYTEXT NOT NULL,
    `email` TINYTEXT NOT NULL,
    `paymentType` ENUM('FORMAL', 'INFORMAL') NOT NULL,
    `fax` VARCHAR(50) NULL,
    `accountManagerId` VARCHAR(191) NOT NULL,
    `UserIdCreatedBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Laboratory_id_key`(`id`),
    UNIQUE INDEX `Laboratory_code_key`(`code`),
    UNIQUE INDEX `Laboratory_accountManagerId_key`(`accountManagerId`),
    UNIQUE INDEX `Laboratory_UserIdCreatedBy_key`(`UserIdCreatedBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LaboratoryFormalPaymentInfo` (
    `id` VARCHAR(191) NOT NULL,
    `laboratoryId` VARCHAR(191) NOT NULL,
    `legalEntityName` TINYTEXT NOT NULL,
    `economicNumber` TINYTEXT NOT NULL,
    `nationalId` TINYTEXT NOT NULL,
    `fullAddress` TEXT NOT NULL,
    `province` VARCHAR(100) NOT NULL,
    `city` TINYTEXT NOT NULL,
    `registrationNumber` TINYTEXT NOT NULL,
    `postalCode` TINYTEXT NOT NULL,

    UNIQUE INDEX `LaboratoryFormalPaymentInfo_id_key`(`id`),
    UNIQUE INDEX `LaboratoryFormalPaymentInfo_laboratoryId_key`(`laboratoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Registry` (
    `id` VARCHAR(191) NOT NULL,
    `MotId` TINYTEXT NOT NULL,
    `name` TINYTEXT NOT NULL,
    `laboratoryId` VARCHAR(191) NOT NULL,
    `serviceType` TINYTEXT NOT NULL,
    `kitType` TINYTEXT NOT NULL,
    `urgentStatus` BOOLEAN NULL,
    `price` DECIMAL(65, 30) NOT NULL,
    `description` TEXT NULL,
    `costumerRelationInfo` VARCHAR(191) NULL,
    `KoreaSendDate` DATETIME(3) NULL,
    `resultReady` BOOLEAN NULL,
    `resultReadyTime` DATETIME(3) NULL,
    `settlementStatus` ENUM('SETTLED', 'PENDING', 'OVERDUE') NOT NULL,
    `invoiceStatus` ENUM('ISSUED', 'NOT_ISSUED') NOT NULL,
    `proformaSent` BOOLEAN NULL,
    `proformaSentDate` DATETIME(3) NULL,
    `totalInvoiceAmount` DECIMAL(65, 30) NOT NULL,
    `installmentOne` DECIMAL(65, 30) NULL,
    `installmentOneDate` DATETIME(3) NULL,
    `installmentTwo` DECIMAL(65, 30) NULL,
    `installmentTwoDate` DATETIME(3) NULL,
    `installmentThree` DECIMAL(65, 30) NULL,
    `installmentThreeDate` DATETIME(3) NULL,
    `totalPaid` DECIMAL(65, 30) NOT NULL,
    `paymentPercentage` DECIMAL(65, 30) NOT NULL,
    `settlementDate` DATETIME(3) NULL,
    `officialInvoiceSent` BOOLEAN NULL,
    `officialInvoiceSentDate` DATETIME(3) NULL,
    `sampleStatus` ENUM('PENDING', 'SHIPMENT', 'SHIPPED', 'RECEIVED_AT_LIBRARY', 'IN_TESTING', 'READY_FOR_DELIVERY', 'DELIVERED') NOT NULL,
    `sendSeries` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `userIdCreatedBy` VARCHAR(191) NOT NULL,
    `userIdUpdatedBy` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Registry_id_key`(`id`),
    UNIQUE INDEX `Registry_laboratoryId_key`(`laboratoryId`),
    UNIQUE INDEX `Registry_userIdCreatedBy_key`(`userIdCreatedBy`),
    UNIQUE INDEX `Registry_userIdUpdatedBy_key`(`userIdUpdatedBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Laboratory` ADD CONSTRAINT `Laboratory_accountManagerId_fkey` FOREIGN KEY (`accountManagerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Laboratory` ADD CONSTRAINT `Laboratory_UserIdCreatedBy_fkey` FOREIGN KEY (`UserIdCreatedBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaboratoryFormalPaymentInfo` ADD CONSTRAINT `LaboratoryFormalPaymentInfo_laboratoryId_fkey` FOREIGN KEY (`laboratoryId`) REFERENCES `Laboratory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Registry` ADD CONSTRAINT `Registry_laboratoryId_fkey` FOREIGN KEY (`laboratoryId`) REFERENCES `Laboratory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Registry` ADD CONSTRAINT `Registry_userIdCreatedBy_fkey` FOREIGN KEY (`userIdCreatedBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Registry` ADD CONSTRAINT `Registry_userIdUpdatedBy_fkey` FOREIGN KEY (`userIdUpdatedBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
