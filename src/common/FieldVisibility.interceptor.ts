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

    if (userPosition === 'ADMIN') {
      return next.handle().pipe(
        map((data) => this.makeAllFieldsEditable(data))
      );
    }

    const allowedFields = await this.getAllowedFields(userPosition);

    return next.handle().pipe(
      map((data) => this.filterFields(data, allowedFields))
    );
  }

  private async getAllowedFields(
    position: Position,
  ): Promise<{ field: string; editable: boolean }[]> {
    const fieldAccess = await this.ormProvider.registryFieldAccess.findMany({
      where: {
        OR: [
          { position, access: 'VISIBLE' },
          { position, access: 'EDITABLE' },
        ],
      },
      select: { registryField: true, access: true },
    });

    const allowedFields = fieldAccess.map((fa) => ({
      field: fa.registryField,
      editable: fa.access === 'EDITABLE',
    }));

    allowedFields.push({field:"id" , editable:false})

    return allowedFields;
  }

  private filterFields(
    data: any,
    allowedFields: { field: string; editable: boolean }[],
  ): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.filterObject(item, allowedFields));
    }
    return this.filterObject(data, allowedFields);
  }

  private filterObject(
    obj: any,
    allowedFields: { field: string; editable: boolean }[],
  ): any {
    if (!obj || typeof obj !== 'object') return obj;

    const allowedFieldMap = Object.fromEntries(
      allowedFields.map(({ field, editable }) => [field, editable])
    );

    return Object.fromEntries(
      Object.entries(obj)
        .filter(([key]) => allowedFieldMap.hasOwnProperty(key))
        .map(([key, value]) => [
          key,
          { value, editable: allowedFieldMap[key] },
        ])
    );
  }

  private makeAllFieldsEditable(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.makeObjectEditable(item));
    }
    return this.makeObjectEditable(data);
  }

  private makeObjectEditable(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;

    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        { value, editable: true },
      ])
    );
  }
}
