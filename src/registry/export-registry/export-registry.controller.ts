import { Controller, Get, Res, Session, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocalGuard } from 'src/auth/guards/local.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RegistryExportService } from './registry-export.service';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UserSessionType } from 'src/types/global-types';
import { Response } from 'express';

@ApiTags('registry')
@UseGuards(LocalGuard, RolesGuard)
@Controller('export-registry')
export class ExportRegistryController {
  constructor(private readonly registryExportService: RegistryExportService) {}

  @Roles('ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'SALES_REPRESENTATIVE')
  @Get('export')
  @ApiOperation({ summary: 'Export Registry data to an Excel file' })
  @ApiResponse({
    status: 200,
    description: 'Excel file containing registry data',
    content: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {},
    },
  })
  async exportToExcel(
    @Res() res: Response,
    @Session() session: UserSessionType,
  ) {
    const position = session.passport.user.position;
    await this.registryExportService.generateExcel(res, position);
  }

  @Roles('ADMIN', 'DATA_ENTRY')
  @Get('exportEmpty')
  @ApiOperation({ summary: 'Export empty correct columns Excel file' })
  @ApiResponse({
    status: 200,
    description: 'empty correct columns Excel file',
    content: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {},
    },
  })
  async generateEmptyExcel(@Res() res: Response) {
    await this.registryExportService.generateEmptyExcel(res);
  }
}
