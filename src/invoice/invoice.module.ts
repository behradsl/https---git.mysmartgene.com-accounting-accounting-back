import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { RegistryModule } from 'src/registry/registry.module';
import { OrmProvider } from 'src/providers/orm.provider';

@Module({
  imports: [RegistryModule],
  providers: [InvoiceService, OrmProvider],
  controllers: [InvoiceController],
  exports: [InvoiceService],
})
export class InvoiceModule {}
