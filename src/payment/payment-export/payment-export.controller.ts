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
import { PaymentExportService } from './payment-export.service';
import { BulkPaymentIdDto } from '../dtos/payment.dto';

@ApiTags('payment/export')
@UseGuards(LocalGuard, RolesGuard)
@Controller('/payment/export')
export class PaymentExportController {
  constructor(private readonly paymentExportService: PaymentExportService) {}

  @ApiOperation({
    description: "roles :'ADMIN', 'FINANCE_MANAGER' ",
  })
  @Roles('ADMIN', 'FINANCE_MANAGER')
  @Post('/all')
  async exportToExcel(@Body() { ids }: BulkPaymentIdDto): Promise<any> {
    const buffer = await this.paymentExportService.generateExcel({
      ids,
    });

    return new StreamableFile(buffer, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      disposition: 'attachment; filename=payment.xlsx',
    });
  }
}
