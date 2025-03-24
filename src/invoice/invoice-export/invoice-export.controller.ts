import {
  Body,
  Controller,
  Post,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { LocalGuard } from 'src/auth/guards/local.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

import { Roles } from 'src/auth/decorators/role.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InvoiceExportService } from './invoice-export.service';
import { BulkInvoiceIdDto } from '../dtos/invoice.dto';

@ApiTags('/invoice/export')
@UseGuards(LocalGuard, RolesGuard)
@Controller('/invoice/export')
export class InvoiceExportController {
  constructor(private readonly invoiceExportService: InvoiceExportService) {}

  @ApiOperation({
    description: "roles :'ADMIN', 'FINANCE_MANAGER' ",
  })
  @Roles('ADMIN', 'FINANCE_MANAGER')
  @Post('/all')
  async exportToExcel(@Body() { ids }: BulkInvoiceIdDto): Promise<any> {
    const buffer = await this.invoiceExportService.generateExcel({
      ids,
    });

    return new StreamableFile(buffer, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      disposition: 'attachment; filename=invoices.xlsx',
    });
  }
}
