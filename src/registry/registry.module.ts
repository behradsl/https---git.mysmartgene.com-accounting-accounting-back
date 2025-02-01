import { Module } from '@nestjs/common';

import { RegistryController } from './registry.controller';
import { RegistryService } from './registry.service';
import { OrmProvider } from 'src/providers/orm.provider';


@Module({
  providers: [RegistryService ,OrmProvider],
  controllers: [RegistryController]
})
export class RegistryModule {}
