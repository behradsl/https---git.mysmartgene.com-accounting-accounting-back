import { Body, Controller, Post, Session, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalGuard } from 'src/auth/guards/local.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { CreatePaymentDto } from './dtos/payment.dto';
import { UserSessionType } from 'src/types/global-types';
import { UpdateInvoiceDto } from 'src/invoice/dtos/invoice.dto';


@ApiTags('/payment')
@UseGuards(LocalGuard, RolesGuard)
@Controller('/payment')
export class PaymentController {
    constructor(private readonly paymentService:PaymentService){}

    @ApiOperation({
        description: "roles :'ADMIN', 'FINANCE_MANAGER' ",
      })
      @Roles('ADMIN', 'FINANCE_MANAGER')
      @Post('/create')
      async create(
        @Body() args: CreatePaymentDto,
        @Session() session: UserSessionType,
      ) {
        const userId = session.passport.user.id;
        return await this.paymentService.create(args, { id: userId });
      }  

      @ApiOperation({
        description: "roles :'ADMIN', 'FINANCE_MANAGER' ",
      })
      @Roles('ADMIN', 'FINANCE_MANAGER')
      @Post('/update')
      async update(
        @Body() args: UpdateInvoiceDto,
        @Session() session: UserSessionType,
      ) {
        const userId = session.passport.user.id;
        return await this.paymentService.update(args, { id: userId });
      }
    

}
