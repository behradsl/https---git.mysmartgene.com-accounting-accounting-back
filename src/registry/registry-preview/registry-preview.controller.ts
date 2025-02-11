import { Body, Controller, Get, Param, Post, Session, UseGuards } from '@nestjs/common';
import { RegistryPreviewService } from './registry-preview.service';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UserSessionType } from 'src/types/global-types';
import { RegistryIdDto, UpdateRegistryDto } from '../dtos/registry.dto';
import { ApiTags } from '@nestjs/swagger';
import { LocalGuard } from 'src/auth/guards/local.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';


@ApiTags('registry-preview')
@UseGuards(LocalGuard, RolesGuard)
@Controller('registry-preview')
export class RegistryPreviewController {
  constructor(
    private readonly registryPreviewService: RegistryPreviewService,
  ) {}

  @Roles('ADMIN', 'DATA_ENTRY')
  @Get('findManyNotFInal')
  async findAllNotFinals(@Session() session: UserSessionType) {
    const userId = session.passport.user.id;
    const position = session.passport.user.position;
    return await this.registryPreviewService.findAllNotFinals(userId, position);
  }

  @Roles('ADMIN', 'DATA_ENTRY')
  @Get('findOneNotFInal/:id')
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
  @Post('updateNotFinal')
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
  @Post('finalizeRegistry')
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
