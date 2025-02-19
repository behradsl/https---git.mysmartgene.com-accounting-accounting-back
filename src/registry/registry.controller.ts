import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
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

  @Roles('ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'SALES_REPRESENTATIVE')
  @Post('/update')
  async updateRegistry(
    @Body() args: UpdateRegistryDto,
    @Session() session: UserSessionType,
  ) {
    const userId = session.passport.user.id;
    const position = session.passport.user.position;
    return await this.registryService.updateRegistry(args, userId , position);
  }

  @UseInterceptors(FieldVisibilityInterceptor)
  @Roles('ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'SALES_REPRESENTATIVE')
  @Get('/:id')
  async findOne(@Param() args: RegistryIdDto) {
    return await this.registryService.findOne(args);
  }

  @UseInterceptors(FieldVisibilityInterceptor)
  @Roles('ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'SALES_REPRESENTATIVE')
  @Get('/all')
  async findMany() {
    return await this.registryService.findMany();
  }
}
