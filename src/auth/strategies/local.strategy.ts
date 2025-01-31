import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string) {
    try {
      const authByPassword = await this.authService.authByPassword({
        username,
        password,
      });

      return authByPassword;
    } catch (error) {
      throw new InternalServerErrorException(
        'Unable to validate user credentials!',
      );
    }

    throw new UnauthorizedException('Invalid User Credentials!');
  }
}
