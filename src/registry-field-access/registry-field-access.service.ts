import { BadRequestException, Injectable } from '@nestjs/common';
import { OrmProvider } from 'src/providers/orm.provider';
import { CreateRegistryFieldAccessDto } from './dtos/registry-field-access.dto';
import { Position } from '@prisma/client';

@Injectable()
export class RegistryFieldAccessService {
  constructor(private readonly ormProvider: OrmProvider) {}

  async upsert({
    access,
    position,
    registryField,
  }: CreateRegistryFieldAccessDto) {
    try {
      return await this.ormProvider.registryFieldAccess.upsert({
        where: {
          position_registryField: {
            position: position,
            registryField: registryField,
          },
        },
        update: {
          access: access,
        },
        create: {
          position: position,
          registryField: registryField,
          access: access,
        },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll(page: number = 1, limit: number = 15) {
    try {
      const skip = (page - 1) * limit;
      return await this.ormProvider.registryFieldAccess.findMany({
        skip: skip,
        take: limit,
      });
    } catch (error) {
      throw new BadRequestException(
        'Failed to retrieve registry field access records',
      );
    }
  }

  async findVisibleFields(position: Position) {
    try {
      const fieldAccess = await this.ormProvider.registryFieldAccess.findMany({
        where: {
          OR: [
            { position: position, access: 'VISIBLE' },
            { position: position, access: 'EDITABLE' },
          ],
        },
      });

      return fieldAccess.map((item) => {
        return item.registryField;
      });
    } catch (error) {}
  }
}
