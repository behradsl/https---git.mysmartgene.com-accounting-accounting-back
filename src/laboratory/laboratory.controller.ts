import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { LaboratoryService } from './laboratory.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { LocalGuard } from 'src/auth/guards/local.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import {
  CreateLaboratoryDto,
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
  @Post('/update')
  async updateLaboratory(@Body() args: UpdateLaboratoryDto) {
    return await this.laboratoryService.updateLaboratory(args);
  }


  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 15,
    description: 'Number of records per page (default: 15)',
  })
  @Get('/all')
  async findMany(
    @Session() session: UserSessionType,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      const position = session.passport.user.position;
      const pageNumber = page ? parseInt(page, 10) : 1;
      const limitNumber = limit ? parseInt(limit, 10) : 15;

      if (pageNumber < 1)
        throw new BadRequestException('Page number must be at least 1');
      if (limitNumber < 1)
        throw new BadRequestException('Limit must be at least 1');

      return await this.laboratoryService.findMany(
        pageNumber,
        limitNumber,
        position,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  

  @Roles('ADMIN', 'FINANCE_MANAGER')
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.laboratoryService.findOne(id);
  }
}
