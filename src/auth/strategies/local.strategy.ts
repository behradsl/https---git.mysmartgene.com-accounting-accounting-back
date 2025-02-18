import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true, // Allows access to request
    });
  }

  async validate(req: Request, username: string, password: string) {
    try {
      const authByPassword = await this.authService.authByPassword({
        username,
        password,
      });

      if (!authByPassword) {
        throw new UnauthorizedException('Invalid User Credentials!');
      }

      

      const rememberMe = req.body.rememberMe === true;

      req.session.cookie.maxAge = rememberMe
        ? 30 * 24 * 60 * 60 * 1000 // 30 days
        : 24 * 60 * 60 * 1000; // 24 hours

     



      req.session.save((err) => {
        if (err) console.error('Session save error:', err);
      });

      return authByPassword;
    } catch (error) {
      throw new InternalServerErrorException(
        'Unable to validate user credentials!',
      );
    }
  }
}
