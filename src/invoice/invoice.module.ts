import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { RegistryModule } from 'src/registry/registry.module';
import { OrmProvider } from 'src/providers/orm.provider';
import { InvoiceExportService } from './invoice-export/invoice-export.service';
import { InvoiceExportController } from './invoice-export/invoice-export.controller';

@Module({
  imports: [RegistryModule],
  providers: [InvoiceService, OrmProvider, InvoiceExportService],
  controllers: [InvoiceController, InvoiceExportController],
  exports: [InvoiceService],
})
export class InvoiceModule {}
