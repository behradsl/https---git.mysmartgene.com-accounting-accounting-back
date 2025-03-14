-- AlterTable
ALTER TABLE `LaboratoryInvoice` MODIFY `paymentStatus` ENUM('PAID', 'UNPAID', 'PARTIALLY_PAID') NOT NULL DEFAULT 'UNPAID';
