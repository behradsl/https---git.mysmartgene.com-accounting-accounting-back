import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './serializer/session.serializer';

import { LocalGuard } from './guards/local.guard';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ session: true }),
    ],
  providers: [
    AuthService,
    LocalStrategy,
    LocalGuard,
    SessionSerializer,
    ],
  controllers: [AuthController],
})
export class AuthModule {}
