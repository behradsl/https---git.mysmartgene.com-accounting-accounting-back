import { Module, ValidationPipe } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { LaboratoryModule } from './laboratory/laboratory.module';
import { RegistryModule } from './registry/registry.module';
import { RegistryFieldAccessModule } from './registry-field-access/registry-field-access.module';
import { APP_PIPE } from '@nestjs/core';
import { InvoiceModule } from './invoice/invoice.module';
import { PaymentModule } from './payment/payment.module';

import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    AuthModule,
    LaboratoryModule,
    RegistryModule,
    RegistryFieldAccessModule,
    InvoiceModule,
    PaymentModule,
    ScheduleModule.forRoot()
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
