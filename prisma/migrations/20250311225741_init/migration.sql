-- AlterTable
ALTER TABLE `Registry` MODIFY `invoiceStatus` ENUM('DRAFT', 'ISSUED', 'PAID', 'OVERDUE', 'CANCELLED') NULL;
