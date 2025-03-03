import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { LocalGuard } from 'src/auth/guards/local.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

import { Roles } from 'src/auth/decorators/role.decorator';
import { UserService } from './user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UserFindDto,
  UserIdDto,
} from './dtos/user.dto';

@ApiTags('user')
@UseGuards(LocalGuard, RolesGuard)
@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({description:"roles :ADMIN "})
  @Roles('ADMIN')
  @Post('/create')
  async create(@Body() args: CreateUserDto) {
    return this.userService.createUser(args);
  }

  @ApiOperation({description:"roles :ADMIN "})
  @Roles('ADMIN')
  @Post('/update')
  async update(@Body() args: UpdateUserDto) {
    return this.userService.UpdateUser(args);
  }

  @ApiOperation({description:"roles :ADMIN "})
  @Roles('ADMIN')
  @Post('/delete')
  async deleteUser(@Body('id') id: string) {
    return this.userService.deleteUser({ id });
  }

  @ApiOperation({description:"roles :ADMIN "})
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
  @Roles('ADMIN')
  @Get('/all')
  async findMany(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 15;
    if (pageNumber < 1)
      throw new BadRequestException('Page number must be at least 1');
    if (limitNumber < 1)
      throw new BadRequestException('Limit must be at least 1');

    return this.userService.findMany(pageNumber, limitNumber);
  }

  @ApiOperation({description:"roles :ADMIN "})
  @Roles('ADMIN')
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne({ id });
  }
}
