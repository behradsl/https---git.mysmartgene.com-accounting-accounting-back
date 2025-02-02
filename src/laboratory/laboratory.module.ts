import { Module } from '@nestjs/common';
import { LaboratoryService } from './laboratory.service';
import { LaboratoryController } from './laboratory.controller';
import { OrmProvider } from 'src/providers/orm.provider';

@Module({
  providers: [LaboratoryService ,OrmProvider],
  controllers: [LaboratoryController],
  exports:[LaboratoryService]
})
export class LaboratoryModule {}
