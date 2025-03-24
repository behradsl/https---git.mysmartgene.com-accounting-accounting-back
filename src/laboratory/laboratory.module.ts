import { Module } from '@nestjs/common';
import { LaboratoryService } from './laboratory.service';
import { LaboratoryController } from './laboratory.controller';
import { OrmProvider } from 'src/providers/orm.provider';
import { PaymentInfoController } from './payment-info/payment-info.controller';

@Module({
  providers: [LaboratoryService, OrmProvider],
  controllers: [LaboratoryController, PaymentInfoController],
  exports: [LaboratoryService],
})
export class LaboratoryModule {}
