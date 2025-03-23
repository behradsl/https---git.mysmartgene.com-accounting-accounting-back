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
import { CreatePaymentDto, PaymentFindManyDto, PaymentIdDto, UpdatePaymentDto } from './dtos/payment.dto';
import { OrderBy, UserSessionType } from 'src/types/global-types';
import { UpdateInvoiceDto } from 'src/invoice/dtos/invoice.dto';

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
  @Post('/update/:id')
  async update(
    @Param() paymentId: PaymentIdDto,
    @Body() args: UpdatePaymentDto,
    @Session() session: UserSessionType,
  ) {
    const userId = session.passport.user.id;
    return await this.paymentService.update(args, { id: userId }, paymentId);
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
    description: 'fieldNAme registries would be sorted by (default: createdAt)',
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    example: OrderBy.asc,
    description: 'order of registry sorting (default: asd )',
  })
  @Roles('ADMIN', 'FINANCE_MANAGER')
  @Post('/find/all')
  async findAllFiltered(
    @Body() args: PaymentFindManyDto,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortingBy') sortingBy?: string,
    @Query('orderBy') orderBy?: OrderBy,
  ) {
    try {
      const pageNumber = page ? parseInt(page, 10) : 1;
      const limitNumber = limit ? parseInt(limit, 10) : 15;
      if (pageNumber < 1)
        throw new BadRequestException('Page number must be at least 1');
      if (limitNumber < 1)
        throw new BadRequestException('Limit must be at least 1');
      return await this.paymentService.findAllFiltered(
        args,
        pageNumber,
        limitNumber,
        sortingBy,
        orderBy,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOperation({
    description: "roles :'ADMIN', 'FINANCE_MANAGER' ",
  })
  @Roles('ADMIN', 'FINANCE_MANAGER')
  @Get('/find/:id')
  async findOne(@Param() { id }: PaymentIdDto) {
    return await this.paymentService.findOne({ id });
  }
}
