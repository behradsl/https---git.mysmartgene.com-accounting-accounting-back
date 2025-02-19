import {
  Controller,
  Get,
  Session,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { LocalGuard } from 'src/auth/guards/local.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RegistryExportService } from './registry-export.service';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UserSessionType } from 'src/types/global-types';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('/registry/export')
@UseGuards(LocalGuard, RolesGuard)
@Controller('/registry/export')
export class ExportRegistryController {
  constructor(private readonly registryExportService: RegistryExportService) {}

  @Roles('ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'SALES_REPRESENTATIVE')
  @Get('/all')
  async exportToExcel(@Session() session: UserSessionType): Promise<any> {
    const position = session.passport.user.position;
    const buffer = await this.registryExportService.generateExcel(position);

    return new StreamableFile(buffer, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      disposition: 'attachment; filename=registries.xlsx',
    });
  }

  @Roles('ADMIN',"DATA_ENTRY")
  @Get('/preview/all')
  async exportPreviewToExcel(@Session() session: UserSessionType): Promise<any> {
    
    const buffer = await this.registryExportService.generatePreviewExcel(session);

    return new StreamableFile(buffer, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      disposition: 'attachment; filename=registries.xlsx',
    });
  }

  

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
