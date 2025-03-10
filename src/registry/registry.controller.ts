import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { LocalGuard } from 'src/auth/guards/local.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import {
  BulkRegistryIds,
  CreateRegistryDto,
  RegistryIdDto,
  UpdateRegistryDto,
} from './dtos/registry.dto';

import { OrderBy, UserSessionType } from 'src/types/global-types';
import { RegistryService } from './registry.service';

import { FieldVisibilityInterceptor } from 'src/common/FieldVisibility.interceptor';

@ApiTags('registry')
@UseGuards(LocalGuard, RolesGuard)
@Controller('/registry')
export class RegistryController {
  constructor(private readonly registryService: RegistryService) {}

  @ApiOperation({ description: 'roles :ADMIN , DATA_ENTRY ' })
  @Roles('ADMIN', 'DATA_ENTRY')
  @Post('/create')
  async createRegistry(
    @Body() args: CreateRegistryDto,
    @Session() session: UserSessionType,
  ) {
    return await this.registryService.createRegistry(
      args,
      session.passport.user.id,
    );
  }

  @ApiOperation({
    description:
      "roles :'ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'SALES_REPRESENTATIVE' ",
  })
  @Roles('ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'SALES_REPRESENTATIVE')
  @Post('/update')
  async updateRegistry(
    @Body() ids: BulkRegistryIds,
    @Body() args: UpdateRegistryDto,
    @Session() session: UserSessionType,
  ) {
    const userId = session.passport.user.id;
    const position = session.passport.user.position;
    return await this.registryService.updateRegistry(
      ids,
      args,
      userId,
      position,
    );
  }

  @ApiOperation({
    description:
      "roles :'ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'SALES_REPRESENTATIVE' ",
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
    example: 'MotId',
    description: 'fieldNAme registries would be sorted by (default: createdAt)',
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    example: OrderBy.asc,
    description: 'order of registry sorting (default: asd )',
  })
  @UseInterceptors(FieldVisibilityInterceptor)
  @Roles('ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'SALES_REPRESENTATIVE')
  @Get('/all')
  async findMany(
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
      return await this.registryService.findMany(
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
    description:
      "roles :'ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'SALES_REPRESENTATIVE' ",
  })
  @UseInterceptors(FieldVisibilityInterceptor)
  @Roles('ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'SALES_REPRESENTATIVE')
  @Get('/:id')
  async findOne(@Param() args: RegistryIdDto) {
    return await this.registryService.findOne(args);
  }

  @ApiOperation({
    description: "roles :'ADMIN' ",
  })
  @Roles('ADMIN')
  @Delete('/update')
  async deleteRegistry(
    @Body() { ids }: BulkRegistryIds,
    @Session() session: UserSessionType,
  ) {
    const userId = session.passport.user.id;
    return await this.registryService.deleteRegistry({ ids }, userId);
  }
}
