/*
  Warnings:

  - A unique constraint covering the columns `[position,registryField]` on the table `RegistryFieldAccess` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `RegistryFieldAccess_position_registryField_access_key` ON `RegistryFieldAccess`;

-- CreateIndex
CREATE UNIQUE INDEX `RegistryFieldAccess_position_registryField_key` ON `RegistryFieldAccess`(`position`, `registryField`);
