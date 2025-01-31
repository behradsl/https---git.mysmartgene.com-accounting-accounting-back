import { Controller, UseGuards } from '@nestjs/common';

import { UserService } from './user.service';
import { LocalGuard } from 'src/auth/guards/local.guard';

import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(LocalGuard)
@UseGuards(RolesGuard)
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
}
