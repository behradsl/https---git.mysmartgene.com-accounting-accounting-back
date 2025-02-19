import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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

  @Roles('ADMIN')
  @Post('/create')
  async create(@Body() args: CreateUserDto) {
    return this.userService.createUser(args);
  }

  @Roles('ADMIN')
  @Post('/update')
  async update(@Body() args: UpdateUserDto) {
    return this.userService.UpdateUser(args);
  }

  @Roles('ADMIN')
  @Delete('/delete')
  async deleteUser(@Body() args: UserIdDto) {
    return this.userService.deleteUser(args);
  }

  @Roles('ADMIN')
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne({ id });
  }

  @Roles('ADMIN')
  @Post('/all')
  async findMany() {
    return this.userService.findMany();
  }
}
