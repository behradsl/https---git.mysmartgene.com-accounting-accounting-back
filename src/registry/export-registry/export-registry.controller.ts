import {
  Body,
  Controller,
  Get,
  Post,
  Session,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { LocalGuard } from 'src/auth/guards/local.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RegistryExportService } from './registry-export.service';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UserSessionType } from 'src/types/global-types';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BulkRegistryIds } from '../dtos/registry.dto';

@ApiTags('/registry/export')
@UseGuards(LocalGuard, RolesGuard)
@Controller('/registry/export')
export class ExportRegistryController {
  constructor(private readonly registryExportService: RegistryExportService) {}

  @ApiOperation({
    description:
      "roles :'ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'SALES_REPRESENTATIVE' ",
  })
  @Roles('ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'SALES_REPRESENTATIVE')
  @Post('/all')
  async exportToExcel(
    @Session() session: UserSessionType,
    @Body() { ids }: BulkRegistryIds,
  ): Promise<any> {
    const position = session.passport.user.position;
    const buffer = await this.registryExportService.generateExcel(position, {
      ids,
    });

    return new StreamableFile(buffer, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      disposition: 'attachment; filename=registries.xlsx',
    });
  }

  @ApiOperation({ description: 'roles :ADMIN , DATA_ENTRY ' })
  @Roles('ADMIN', 'DATA_ENTRY')
  @Post('/preview/all')
  async exportPreviewToExcel(
    @Session() session: UserSessionType,
    @Body() { ids }: BulkRegistryIds,
  ): Promise<any> {
    const buffer = await this.registryExportService.generatePreviewExcel(
      session,
      { ids },
    );

    return new StreamableFile(buffer, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      disposition: 'attachment; filename=registries.xlsx',
    });
  }

  @ApiOperation({ description: 'roles :ADMIN , DATA_ENTRY ' })
  @Roles('ADMIN', 'DATA_ENTRY')
  @Get('/empty')
  async generateEmptyExcel() {
    const buffer = await this.registryExportService.generateEmptyExcel();
    return new StreamableFile(buffer, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      disposition: 'attachment; filename=registries.xlsx',
    });
  }
}
