import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { LaboratoryModule } from './laboratory/laboratory.module';

@Module({
  imports: [AuthModule, LaboratoryModule],
  })
export class AppModule {}
