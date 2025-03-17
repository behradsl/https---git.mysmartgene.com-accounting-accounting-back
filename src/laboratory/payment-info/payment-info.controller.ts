import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LocalGuard } from 'src/auth/guards/local.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { LaboratoryService } from '../laboratory.service';
import { Roles } from 'src/auth/decorators/role.decorator';
import {
  CreateFormalPaymentInfoDto,
  UpdateFormalPaymentInfoDto,
} from '../dtos/laboratory.dto';

@ApiTags('laboratory-payment-info')
@UseGuards(LocalGuard, RolesGuard)
@Controller('/laboratory/payment-info')
export class PaymentInfoController {
  constructor(private readonly laboratoryService: LaboratoryService) {}
  @Roles('ADMIN', 'FINANCE_MANAGER')
  

  @Roles('ADMIN', 'FINANCE_MANAGER')
  @Post('/create')
  async createFormalPaymentInfo(@Body() args: CreateFormalPaymentInfoDto) {
    return await this.laboratoryService.createFormalPaymentInfo(args);
  }

  @Roles('ADMIN', 'FINANCE_MANAGER')
  @Post('/Update')
  async updateFormalPaymentInfo(@Body() args: UpdateFormalPaymentInfoDto) {
    return await this.laboratoryService.updateFormalPaymentInfo(args);
  }

  @Get('/:id')
  async LaboratoryFormalPaymentInfoFind(@Param('id') id: string) {
    
    const labInfo = await  this.laboratoryService.laboratoryFormalPaymentInfoFind({ id });
    return labInfo;
   
  }

  
}
