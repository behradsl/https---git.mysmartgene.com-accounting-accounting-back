-- DropForeignKey
ALTER TABLE `Registry` DROP FOREIGN KEY `Registry_laboratoryId_fkey`;

-- DropIndex
DROP INDEX `Registry_laboratoryId_key` ON `Registry`;

-- AddForeignKey
ALTER TABLE `Registry` ADD CONSTRAINT `Registry_laboratoryId_fkey` FOREIGN KEY (`laboratoryId`) REFERENCES `Laboratory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
