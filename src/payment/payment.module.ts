import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { OrmProvider } from 'src/providers/orm.provider';
import { InvoiceModule } from 'src/invoice/invoice.module';
import { PaymentExportService } from './payment-export/payment-export.service';
import { PaymentExportController } from './payment-export/payment-export.controller';

@Module({
  imports: [InvoiceModule],
  providers: [PaymentService, OrmProvider , PaymentExportService],
  controllers: [PaymentController ,PaymentExportController ],
})
export class PaymentModule {}
