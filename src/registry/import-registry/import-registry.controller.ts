import {
  BadRequestException,
  Controller,
  Post,
  Session,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ImportRegistryService } from './import-registry.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';
import { UserSessionType } from 'src/types/global-types';
import { Roles } from 'src/auth/decorators/role.decorator';
import { LocalGuard } from 'src/auth/guards/local.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('import-registry')
@UseGuards(LocalGuard, RolesGuard)
@Controller('import-registry')
export class ImportRegistryController {
  constructor(private readonly importRegistryService: ImportRegistryService) {}
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
