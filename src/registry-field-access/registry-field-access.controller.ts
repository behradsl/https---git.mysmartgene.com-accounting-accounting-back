import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RegistryFieldAccessService } from './registry-field-access.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { LocalGuard } from 'src/auth/guards/local.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import {
  CreateRegistryFieldAccessDto,
  UpdateRegistryFieldAccessDto,
} from './dtos/registry-field-access.dto';

@ApiTags('setting/registry/access')
@UseGuards(LocalGuard, RolesGuard)
@Controller('setting/registry/access')
export class RegistryFieldAccessController {
  constructor(
    private readonly registryFieldAccessService: RegistryFieldAccessService,
  ) {}

  @Roles('ADMIN')
  @Post('/assign/one')
  async upsert(@Body() args: CreateRegistryFieldAccessDto) {
    return await this.registryFieldAccessService.upsert(args);
  }

  @Roles('ADMIN')
  @Post('/assign')
  async upsertMany(@Body() args: CreateRegistryFieldAccessDto[]) {
    return await this.registryFieldAccessService.upsertMany(args);
  }

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
  @Roles('ADMIN')
  @Get('/all')
  async findAll() {
    return await this.registryFieldAccessService.findAll();
  }
}
