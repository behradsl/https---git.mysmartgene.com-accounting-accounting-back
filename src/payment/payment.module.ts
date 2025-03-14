import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { OrmProvider } from 'src/providers/orm.provider';
import { InvoiceModule } from 'src/invoice/invoice.module';

@Module({
  imports: [InvoiceModule],
  providers: [PaymentService, OrmProvider],
  controllers: [PaymentController],
})
export class PaymentModule {}
