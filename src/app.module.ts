import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { LaboratoryModule } from './laboratory/laboratory.module';
import { RegistryModule } from './registry/registry.module';
import { RegistryFieldAccessModule } from './registry-field-access/registry-field-access.module';

@Module({
  imports: [AuthModule, LaboratoryModule, RegistryModule, RegistryFieldAccessModule],
})
export class AppModule {}
