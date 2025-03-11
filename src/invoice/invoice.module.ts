import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { RegistryModule } from 'src/registry/registry.module';

@Module({
  imports:[RegistryModule],
  providers: [InvoiceService],
  controllers: [InvoiceController]
})
export class InvoiceModule {}
