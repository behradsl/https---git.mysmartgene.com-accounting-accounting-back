import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalGuard extends AuthGuard('local') {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const isAuthenticated = request.isAuthenticated();

    if (isAuthenticated) return isAuthenticated;

    const result: boolean = (await super.canActivate(context)) as boolean;

    await super.logIn(context.switchToHttp().getRequest());

    return result;
  }
}
