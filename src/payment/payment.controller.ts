import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { LocalGuard } from 'src/auth/guards/local.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import {
  CreatePaymentDto,
  DateRangeDto,
  PaymentFindManyDto,
  PaymentIdDto,
  UpdatePaymentDto,
} from './dtos/payment.dto';
import { OrderBy, UserSessionType } from 'src/types/global-types';
import { UpdateInvoiceDto } from 'src/invoice/dtos/invoice.dto';
import { Currency } from '@prisma/client';

@ApiTags('/payment')
@UseGuards(LocalGuard, RolesGuard)
@Controller('/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

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
    @Body() { id: paymentId, ...args }: UpdatePaymentDto & PaymentIdDto,
    @Session() session: UserSessionType,
  ) {
    const userId = session.passport.user.id;
    return await this.paymentService.update(
      args,
      { id: userId },
      { id: paymentId },
    );
  }

  @ApiOperation({
    description: "roles :'ADMIN', 'FINANCE_MANAGER' ",
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 15,
    description: 'Number of records per page (default: 15)',
  })
  @ApiQuery({
    name: 'sortingBy',
    required: false,
    example: 'createdAt',
    description: 'Field name by which records are sorted (default: createdAt)',
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    example: OrderBy.asc,
    description: 'Order of registry sorting (default: asc)',
  })
  @ApiQuery({
    name: 'laboratoryId',
    required: false,
    example: '',
    description: 'ID of the laboratory',
  })
  @ApiQuery({
    name: 'currency',
    required: false,
    enum: Currency,
    description: 'Payment currency',
  })
  @ApiQuery({
    name: 'start',
    required: false,
    example: '2025-03-01',
    description: 'Start date for payment due range',
  })
  @ApiQuery({
    name: 'end',
    required: false,
    example: '2025-03-31',
    description: 'End date for payment due range',
  })
  @Roles('ADMIN', 'FINANCE_MANAGER')
  @Get('/find/all')
  async findAllFiltered(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortingBy') sortingBy?: string,
    @Query('orderBy') orderBy?: OrderBy,
    @Query('laboratoryId') laboratoryId?: string,
    @Query('currency') currency?: Currency,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    try {
      const pageNumber = page ? parseInt(page, 10) : 1;
      const limitNumber = limit ? parseInt(limit, 10) : 15;

      if (pageNumber < 1)
        throw new BadRequestException('Page number must be at least 1');
      if (limitNumber < 1)
        throw new BadRequestException('Limit must be at least 1');

      const paymentDueDateRange: DateRangeDto = { start: start, end: end };

      return await this.paymentService.findAllFiltered(
        {
          laboratoryId: laboratoryId,
          currency: currency,
          paymentDueDateRange: paymentDueDateRange,
        },
        pageNumber,
        limitNumber,
        sortingBy,
        orderBy,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
