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

import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { LocalGuard } from 'src/auth/guards/local.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import {
  CreateRegistryDto,
  RegistryIdDto,
  UpdateRegistryDto,
} from './dtos/registry.dto';

import { UserSessionType } from 'src/types/global-types';
import { RegistryService } from './registry.service';

import { FieldVisibilityInterceptor } from 'src/common/FieldVisibility.interceptor';




@ApiTags('registry')
@UseGuards(LocalGuard, RolesGuard)
@Controller('/registry')
export class RegistryController {
  constructor(private readonly registryService: RegistryService) {}




  @ApiOperation({description:"roles :ADMIN , DATA_ENTRY "})
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

  @ApiOperation({description:"roles :'ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'SALES_REPRESENTATIVE' "})
  @Roles('ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'SALES_REPRESENTATIVE')
  @Post('/update')
  async updateRegistry(
    @Body() args: UpdateRegistryDto,
    @Session() session: UserSessionType,
  ) {
    const userId = session.passport.user.id;
    const position = session.passport.user.position;
    return await this.registryService.updateRegistry(args, userId, position);
  }


  @ApiOperation({description:"roles :'ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'SALES_REPRESENTATIVE' "})
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
  @UseInterceptors(FieldVisibilityInterceptor)
  @Roles('ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'SALES_REPRESENTATIVE')
  @Get('/all')
  async findMany(@Query('page') page?: string, @Query('limit') limit?: string) {
    try {
      const pageNumber = page?parseInt(page, 10) : 1;
      const limitNumber =limit? parseInt(limit, 10) : 15;
      if (pageNumber < 1)
        throw new BadRequestException('Page number must be at least 1');
      if (limitNumber < 1)
        throw new BadRequestException('Limit must be at least 1');

      return await this.registryService.findMany(pageNumber, limitNumber);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOperation({description:"roles :'ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'SALES_REPRESENTATIVE' "})
  @UseInterceptors(FieldVisibilityInterceptor)
  @Roles('ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'SALES_REPRESENTATIVE')
  @Get('/:id')
  async findOne(@Param() args: RegistryIdDto) {
    return await this.registryService.findOne(args);
  }
}
