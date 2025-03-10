import { Module } from '@nestjs/common';

import { RegistryController } from './registry.controller';
import { RegistryService } from './registry.service';
import { OrmProvider } from 'src/providers/orm.provider';
import { LaboratoryModule } from 'src/laboratory/laboratory.module';
import { ImportRegistryService } from './import-registry/import-registry.service';
import { RegistryExportService } from './export-registry/registry-export.service';
import { RegistryFieldAccessModule } from 'src/registry-field-access/registry-field-access.module';
import { RegistryPreviewService } from './registry-preview/registry-preview.service';
import { ImportRegistryController } from './import-registry/import-registry.controller';
import { ExportRegistryController } from './export-registry/export-registry.controller';
import { RegistryPreviewController } from './registry-preview/registry-preview.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [LaboratoryModule, RegistryFieldAccessModule, UserModule],
  providers: [
    RegistryService,
    OrmProvider,
    ImportRegistryService,
    RegistryExportService,
    RegistryPreviewService,
  ],
  controllers: [
    RegistryController,
    ImportRegistryController,
    ExportRegistryController,
    RegistryPreviewController,
  ],
})
export class RegistryModule {}
