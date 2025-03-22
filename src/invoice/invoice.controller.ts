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
  UseInterceptors,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { LocalGuard } from 'src/auth/guards/local.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import {
  CreateInvoiceDto,
  InvoiceFindManyDto,
  InvoiceIdDto,
  UpdateInvoiceDto,
} from './dtos/invoice.dto';
import { OrderBy, UserSessionType } from 'src/types/global-types';
import { LaboratoryIdDto } from 'src/laboratory/dtos/laboratory.dto';

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
    return  this.invoiceService.create(args, { id: userId });
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
  @Get('/find/all')
  async findAll(
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
      return await this.invoiceService.findAll(
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
  @Post('/find/all/filtered')
  async findAllFiltered(
    @Body() args: InvoiceFindManyDto,
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
      return await this.invoiceService.findAllFiltered(
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
  async findOne(@Param() { id }: InvoiceIdDto) {
    return await this.invoiceService.findOne({ id });
  }

  @ApiOperation({
    description: "roles :'ADMIN', 'FINANCE_MANAGER' ",
  })
  @ApiBody({ type: UpdateInvoiceDto, description: 'Partial update of invoice' })
  @Roles('ADMIN', 'FINANCE_MANAGER')
  @Post('/update/:id')
  async update(
    @Param() invoiceId: InvoiceIdDto,
    @Body() args: Partial<UpdateInvoiceDto>,
    @Session() session: UserSessionType,
  ) {
    const userId = session.passport.user.id;
    const position = session.passport.user.position;

    return this.invoiceService.update(
      args,
      invoiceId,
      { id: userId },
      position,
    );
  }

  @ApiOperation({
    description: "roles :'ADMIN', 'FINANCE_MANAGER' ",
  })
  @Roles('ADMIN', 'FINANCE_MANAGER')
  @Post('/issuance/:id')
  async invoiceIssuance(
    @Param() args: InvoiceIdDto,
    @Session() session: UserSessionType,
  ) {
    const userId = session.passport.user.id;
    return this.invoiceService.invoiceIssuance(args, userId);
  }

  @ApiOperation({
    description: "roles :'ADMIN', 'FINANCE_MANAGER' ",
  })
  @Roles('ADMIN', 'FINANCE_MANAGER')
  @Post('/cancellation/:id')
  async invoiceCancellation(
    @Param() args: InvoiceIdDto,
    @Session() session: UserSessionType,
  ) {
    const userId = session.passport.user.id;
    return this.invoiceService.invoiceCancellation(args, userId);
  }
}
