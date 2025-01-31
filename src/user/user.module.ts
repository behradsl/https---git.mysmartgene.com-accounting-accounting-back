import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserAuthService } from './user-auth.service';
import { OrmProvider } from 'src/providers/orm.provider';

@Module({
  providers: [UserService, UserAuthService, OrmProvider],
  controllers: [UserController],
  exports: [UserService, UserAuthService],
})
export class UserModule {}
