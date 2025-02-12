import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Session,
  Get,
  Body,
} from '@nestjs/common';
import { LocalGuard } from './guards/local.guard';
import { ApiTags } from '@nestjs/swagger';
import { UserSessionType } from 'src/types/global-types';
import { Request } from 'express';
import { AuthSigninDto } from './dtos/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  
  @HttpCode(HttpStatus.OK)
  @Get('user')
  getCurrentUser(@Session() session: UserSessionType) {
    return session.passport.user;
  }

  @UseGuards(LocalGuard)
  @HttpCode(HttpStatus.OK)
  @Post('user/signin')
  signin(@Body() args: AuthSigninDto, @Session() session: UserSessionType) {
    
    return session.passport.user;
  }

  @Post('user/signout')
  signout(@Req() request: Request) {
    request.session.destroy(() => {
      return {
        message: 'Logout successful',
        statusCode: HttpStatus.OK,
      };
    });
  }
}
