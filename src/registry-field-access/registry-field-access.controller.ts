import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RegistryFieldAccessService } from './registry-field-access.service';
import { ApiTags } from '@nestjs/swagger';
import { LocalGuard } from 'src/auth/guards/local.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { CreateRegistryFieldAccessDto, UpdateRegistryFieldAccessDto } from './dtos/registry-field-access.dto';

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

  

  @Roles("ADMIN")
  @Get('/all')
  async findAll(){
    return await this.registryFieldAccessService.findAll();
  }
}
