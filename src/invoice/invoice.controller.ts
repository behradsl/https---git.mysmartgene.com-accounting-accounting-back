import { Body, Controller, Post, Session, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalGuard } from 'src/auth/guards/local.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { CreateInvoiceDto } from './dtos/invoice.dto';
import { UserSessionType } from 'src/types/global-types';

@ApiTags('/invoice')
@UseGuards(LocalGuard, RolesGuard)
@Controller('/invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @ApiOperation({
    description: "roles :'ADMIN', 'FINANCE_MANAGER' ",
  })
  @Roles('ADMIN', 'FINANCE_MANAGER')
  @Post('/create')
  async create(
    @Body() args: CreateInvoiceDto,
    @Session() session: UserSessionType,
  ) {
    const userId = session.passport.user.id;
    return this.invoiceService.create(args, userId);
  }
}
