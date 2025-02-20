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
import { RegistryPreviewService } from './registry-preview.service';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UserSessionType } from 'src/types/global-types';
import { RegistryIdDto, UpdateRegistryDto } from '../dtos/registry.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { LocalGuard } from 'src/auth/guards/local.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('registry/preview')
@UseGuards(LocalGuard, RolesGuard)
@Controller('registry/preview')
export class RegistryPreviewController {
  constructor(
    private readonly registryPreviewService: RegistryPreviewService,
  ) {}

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
  @Roles('ADMIN', 'DATA_ENTRY')
  @Get('/all')
  async findAllNotFinals(
    @Session() session: UserSessionType,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 15;

    if (pageNumber < 1)
      throw new BadRequestException('Page number must be at least 1');
    if (limitNumber < 1)
      throw new BadRequestException('Limit must be at least 1');
    const userId = session.passport.user.id;
    const position = session.passport.user.position;
    return await this.registryPreviewService.findAllNotFinals(
      userId,
      position,
      limitNumber,
      pageNumber,
    );
  }

  @Roles('ADMIN', 'DATA_ENTRY')
  @Get('/find/one/:id')
  async findOneNotFinal(
    @Param() args: RegistryIdDto,
    @Session() session: UserSessionType,
  ) {
    const userId = session.passport.user.id;
    const position = session.passport.user.position;
    return await this.registryPreviewService.findOneNotFinal(
      args,
      userId,
      position,
    );
  }

  @Roles('ADMIN', 'DATA_ENTRY')
  @Post('/update')
  async updateNotFinal(
    @Body() args: UpdateRegistryDto,
    @Session() session: UserSessionType,
  ) {
    const userId = session.passport.user.id;
    const position = session.passport.user.position;

    return await this.registryPreviewService.updateNotFinalRegistry(
      args,
      userId,
      position,
    );
  }

  @Roles('ADMIN', 'DATA_ENTRY')
  @Post('/finalize')
  async finalizeRegistry(
    @Body() args: RegistryIdDto,
    @Session() session: UserSessionType,
  ) {
    const userId = session.passport.user.id;
    const position = session.passport.user.position;

    return await this.registryPreviewService.finalizeRegistry(
      args,
      userId,
      position,
    );
  }
}
