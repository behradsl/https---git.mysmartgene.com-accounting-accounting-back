import { Injectable } from '@nestjs/common';
import { UserAuthByPassword } from 'src/user/dtos/user-auth.dto';
import { UserAuthService } from 'src/user/user-auth.service';

@Injectable()
export class AuthService {
  constructor(private userAuthService: UserAuthService) {}

  async authByPassword(args: UserAuthByPassword) {
    const { checkPassword, user } =
      await this.userAuthService.authByPassword(args);

    return checkPassword ? user : checkPassword;
  }
}
