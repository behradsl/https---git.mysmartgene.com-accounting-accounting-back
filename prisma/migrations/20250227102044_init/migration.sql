/*
  Warnings:

  - The values [RECEIVED_AT_LIBRARY] on the enum `Registry_sampleStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `updatedAt` on the `RegistryFieldAccess` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Registry` MODIFY `sampleStatus` ENUM('PENDING', 'SHIPMENT', 'SHIPPED', 'RECEIVED_AT_LABORATORY', 'IN_TESTING', 'READY_FOR_DELIVERY', 'DELIVERED') NOT NULL;

-- AlterTable
ALTER TABLE `RegistryFieldAccess` DROP COLUMN `updatedAt`;
