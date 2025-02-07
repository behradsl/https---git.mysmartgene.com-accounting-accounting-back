import { BadRequestException, Injectable } from '@nestjs/common';
import { OrmProvider } from 'src/providers/orm.provider';
import {
  CreateRegistryFieldAccessDto,
  RegistryFieldAccessIdDto,
  RegistryFieldAccessPosition,
  UpdateRegistryFieldAccessDto,
} from './dtos/registry-field-access.dto';

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

  async findAll() {
    try {
      return await this.ormProvider.registryFieldAccess.findMany();
    } catch (error) {
      
      throw new BadRequestException('Failed to retrieve registry field access records');
    }
  }
}
