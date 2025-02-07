import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  Session,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
import { RegistryExportService } from './registry-export.service';
import { Response } from 'express';
import { FieldVisibilityInterceptor } from 'src/common/FieldVisibility.interceptor';


@ApiTags('registry')
@UseGuards(LocalGuard, RolesGuard)
@Controller('registry')
export class RegistryController {
  constructor(
    private readonly registryService: RegistryService,
    private readonly importRegistryService: ImportRegistryService,
    private readonly registryExportService: RegistryExportService,
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

  @UseInterceptors(FieldVisibilityInterceptor)
  @Roles('ADMIN', 'FINANCE_MANAGER' , 'SALES_MANAGER' ,'SALES_REPRESENTATIVE')
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

  @Roles('ADMIN', 'FINANCE_MANAGER')
  @Get('export')
  @ApiOperation({ summary: 'Export Registry data to an Excel file' })
  @ApiResponse({
    status: 200,
    description: 'Excel file containing registry data',
    content: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {},
    },
  })
  async exportToExcel(@Res() res: Response, @Session() session:UserSessionType ) {
    const position = session.passport.user.position
    await this.registryExportService.generateExcel(res ,position );
  }
}
