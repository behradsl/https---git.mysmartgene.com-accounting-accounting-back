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
  @Post('/assign')
  async upsert(@Body() args: CreateRegistryFieldAccessDto) {
    return await this.registryFieldAccessService.upsert(args);
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
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 15;

    if (pageNumber < 1)
      throw new BadRequestException('Page number must be at least 1');
    if (limitNumber < 1)
      throw new BadRequestException('Limit must be at least 1');
    return await this.registryFieldAccessService.findAll(
      pageNumber,
      limitNumber,
    );
  }
}
