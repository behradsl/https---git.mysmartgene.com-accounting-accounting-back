import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { LaboratoryModule } from './laboratory/laboratory.module';
import { RegistryModule } from './registry/registry.module';

@Module({
  imports: [AuthModule, LaboratoryModule, RegistryModule],
})
export class AppModule {}
