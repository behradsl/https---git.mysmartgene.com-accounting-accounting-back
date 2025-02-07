/*
  Warnings:

  - A unique constraint covering the columns `[position,registryField,access]` on the table `RegistryFieldAccess` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `RegistryFieldAccess_position_registryField_access_key` ON `RegistryFieldAccess`(`position`, `registryField`, `access`);
