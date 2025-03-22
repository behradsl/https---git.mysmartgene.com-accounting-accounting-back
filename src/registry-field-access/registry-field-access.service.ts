import { BadRequestException, Injectable } from '@nestjs/common';
import { OrmProvider } from 'src/providers/orm.provider';
import {
  CreateRegistryFieldAccessArrayDto,
  CreateRegistryFieldAccessDto,
  RegistryFieldAccessFindByPositionNameDto,
} from './dtos/registry-field-access.dto';
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

  async upsertMany(data: CreateRegistryFieldAccessArrayDto) {
    try {
      return await this.ormProvider.$transaction(
        data.registryFieldAccesses.map(({ access, position, registryField }) =>
          this.ormProvider.registryFieldAccess.upsert({
            where: {
              position_registryField: {
                position,
                registryField,
              },
            },
            update: { access },
            create: { position, registryField, access },
          }),
        ),
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findByPosition(args: RegistryFieldAccessFindByPositionNameDto) {
    try {
      const fieldAccess = await this.ormProvider.registryFieldAccess.findMany({
        where: { position: args.position },
      });
      return fieldAccess;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll() {
    try {
      return await this.ormProvider.registryFieldAccess.findMany({});
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
