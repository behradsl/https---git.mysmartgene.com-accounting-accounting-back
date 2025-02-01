import { Body, Controller, Get, Param, Post, Session, UseGuards } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { LocalGuard } from 'src/auth/guards/local.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { CreateRegistryDto, RegistryIdDto, UpdateRegistryDto } from './dtos/registry.dto';

import { UserSessionType } from 'src/types/global-types';
import { RegistryService } from './registry.service';




@ApiTags('registry')
@UseGuards(LocalGuard, RolesGuard)
@Controller('registry')
export class RegistryController {
  constructor(private readonly registryService: RegistryService) {}

  @Roles('ADMIN', 'DATA_ENTRY')
  @Post('create')
  async createRegistry(
    @Body() args: CreateRegistryDto,
    @Session() session: UserSessionType,
  ) {
    return await this.registryService.createRegistry(
      args,
      session.passport.user.id,
    );
  }

  @Roles('ADMIN', 'DATA_ENTRY')
  @Post('update')
  async updateRegistry(
    @Body() args: UpdateRegistryDto,
    @Session() session: UserSessionType,
  ) {
    return await this.registryService.updateRegistry(
      args,
      session.passport.user.id,
    );
  }

  @Roles('ADMIN', 'DATA_ENTRY')
  @Get('findOne/:id')
  async findOne(@Param() args: RegistryIdDto) {
    return await this.registryService.findOne(args);
  }

  @Roles('ADMIN', 'DATA_ENTRY')
  @Get('findMany')
  async findMany() {
    return await this.registryService.findMany();
  }
}
