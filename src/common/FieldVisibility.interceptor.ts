import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Position } from '@prisma/client';
import { Observable, map } from 'rxjs';
import { OrmProvider } from 'src/providers/orm.provider';
import { UserSessionType } from 'src/types/global-types';

@Injectable()
export class FieldVisibilityInterceptor implements NestInterceptor {
  constructor(private readonly ormProvider: OrmProvider) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const session: UserSessionType = request.session;
    const user = session.passport.user;
    const userPosition = user.position;

    const allowedFields = await this.getAllowedFields(userPosition);

    if (allowedFields === 'ADMIN') {
      return next.handle();
    }

    if (Array.isArray(allowedFields)) {
      return next
        .handle()
        .pipe(map((data) => this.filterFields(data, allowedFields)));
    }

    return next.handle();
  }

  private async getAllowedFields(
    position: Position,
  ): Promise<string[] | 'ADMIN'> {
    if (position === 'ADMIN') {
      return 'ADMIN';
    }
    const fieldAccess = await this.ormProvider.registryFieldAccess.findMany({
      where: {
        OR: [
          { position, access: 'VISIBLE' },
          { position, access: 'EDITABLE' },
        ],
      },
      select: { registryField: true },
    });

    return fieldAccess.map((fa) => fa.registryField);
  }

  private filterFields(data: any, allowedFields: string[]): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.filterObject(item, allowedFields));
    }
    return this.filterObject(data, allowedFields);
  }

  private filterObject(obj: any, allowedFields: string[]): any {
    if (!obj || typeof obj !== 'object') return obj;
    const kir = Object.fromEntries(
      Object.entries(obj).filter(([key]) => allowedFields.includes(key)),
    );

    return kir;
  }
}
