-- DropForeignKey
ALTER TABLE `Registry` DROP FOREIGN KEY `Registry_userIdUpdatedBy_fkey`;

-- AlterTable
ALTER TABLE `Registry` MODIFY `userIdUpdatedBy` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Registry` ADD CONSTRAINT `Registry_userIdUpdatedBy_fkey` FOREIGN KEY (`userIdUpdatedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
