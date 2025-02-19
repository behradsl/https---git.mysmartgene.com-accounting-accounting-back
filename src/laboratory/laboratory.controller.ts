import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { LaboratoryService } from './laboratory.service';
import { ApiTags } from '@nestjs/swagger';
import { LocalGuard } from 'src/auth/guards/local.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import {
  CreateFormalPaymentInfoDto,
  CreateLaboratoryDto,
  UpdateFormalPaymentInfoDto,
  UpdateLaboratoryDto,
} from './dtos/laboratory.dto';
import { UserSessionType } from 'src/types/global-types';

@ApiTags('laboratory')
@UseGuards(LocalGuard, RolesGuard)
@Controller('/laboratory')
export class LaboratoryController {
  constructor(private readonly laboratoryService: LaboratoryService) {}

  @Roles('ADMIN', 'FINANCE_MANAGER')
  @Post('/create')
  async createLaboratory(
    @Body() args: CreateLaboratoryDto,
    @Session() session: UserSessionType,
  ) {
    return await this.laboratoryService.createLaboratory(
      args,
      session.passport.user.id,
    );
  }

  @Roles('ADMIN', 'FINANCE_MANAGER')
  @Post('/create/payment-info')
  async createFormalPaymentInfo(@Body() args: CreateFormalPaymentInfoDto) {
    return await this.laboratoryService.createFormalPaymentInfo(args);
  }

  @Roles('ADMIN', 'FINANCE_MANAGER')
  @Post('/update')
  async updateLaboratory(@Body() args: UpdateLaboratoryDto) {
    return await this.laboratoryService.updateLaboratory(args);
  }

  @Roles('ADMIN', 'FINANCE_MANAGER')
  @Post('/Update/payment-info')
  async updateFormalPaymentInfo(@Body() args: UpdateFormalPaymentInfoDto) {
    return await this.laboratoryService.updateFormalPaymentInfo(args);
  }

  @Roles('ADMIN', 'FINANCE_MANAGER')
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.laboratoryService.findOne(id);
  }

  @Roles('ADMIN', 'FINANCE_MANAGER')
  @Get('/all')
  async findMany() {
    return await this.laboratoryService.findMany();
  }
}
