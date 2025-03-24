import { Module } from '@nestjs/common';
import { RegistryFieldAccessService } from './registry-field-access.service';
import { RegistryFieldAccessController } from './registry-field-access.controller';
import { OrmProvider } from 'src/providers/orm.provider';

@Module({
  providers: [RegistryFieldAccessService, OrmProvider],
  controllers: [RegistryFieldAccessController],
  exports: [RegistryFieldAccessService],
})
export class RegistryFieldAccessModule {}
