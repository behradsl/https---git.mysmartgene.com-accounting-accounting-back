import { ForbiddenException, Injectable } from '@nestjs/common';
import { OrmProvider } from 'src/providers/orm.provider';

import { Prisma } from '@prisma/client';
import {
  UserAuthByPassword,
  userAuthComparePasswordDto,
} from './dtos/user-auth.dto';
import { verifyPassword } from 'src/utilities/hash';

@Injectable()
export class UserAuthService {
  constructor(private ormProvider: OrmProvider) {}

  private async getUserFullInfo(args: Prisma.UserWhereInput) {
    if (Object.values(args).filter((i) => i).length === 0)
      throw new ForbiddenException();
    else {
      const user = await this.ormProvider.user.findFirstOrThrow({
        where: args,
      });

      return user;
    }
  }

  private async comparePassword({
    password,
    passwordHash,
  }: userAuthComparePasswordDto) {
    return verifyPassword(password, passwordHash);
  }

  async authByPassword({ username, password }: UserAuthByPassword) {
    const { hashPassword, ...user } = await this.getUserFullInfo({
      OR: [{ email: username }],
    });

    const checkPassword = await this.comparePassword({
      password: password,
      passwordHash: hashPassword,
    });

    return { checkPassword, user };
  }
}
