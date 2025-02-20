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
  Res,
} from '@nestjs/common';
import { LocalGuard } from './guards/local.guard';
import { ApiTags } from '@nestjs/swagger';
import { UserSessionType } from 'src/types/global-types';
import { Request, Response } from 'express';
import { AuthSigninDto } from './dtos/auth.dto';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  @HttpCode(HttpStatus.OK)
  @Get('/user')
  getCurrentUser(@Session() session: UserSessionType) {
    return session?.passport?.user;
  }

  @UseGuards(LocalGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/sign-in')
  signin(@Body() args: AuthSigninDto, @Session() session: UserSessionType) {
    return session?.passport?.user;
  }

  @Post('/sign-out')
  signout(@Req() request: Request, @Res() response: Response) {
    request.session.destroy((err) => {
      if (err) {
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'sign out failed',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
      response.clearCookie('connect.sid');
      return response.json({
        message: 'sign out successful',
        statusCode: HttpStatus.OK,
      });
    });
  }
}
