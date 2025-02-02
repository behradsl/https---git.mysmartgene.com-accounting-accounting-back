import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Session,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
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
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportRegistryService } from './import-registry.service';

@ApiTags('registry')
@UseGuards(LocalGuard, RolesGuard)
@Controller('registry')
export class RegistryController {
  constructor(
    private readonly registryService: RegistryService,
    private readonly importRegistryService: ImportRegistryService,
  ) {}

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

  @Roles('ADMIN', 'DATA_ENTRY')
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadRegistryData(
    @UploadedFile() file: Express.Multer.File,
    @Session() session: UserSessionType,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return await this.importRegistryService.importRegistryData(
      file,
      session.passport.user.id,
    );
  }
}
