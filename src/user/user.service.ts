import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { OrmProvider } from 'src/providers/orm.provider';
import {
  CreateUserDto,
  UpdateUserDto,
  UserFindDto,
  UserIdDto,
} from './dtos/user.dto';
import { hashPassword } from 'src/utilities/hash';
import { Position, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private ormProvider: OrmProvider) {}

  async createUser(args: CreateUserDto) {
    try {
      const hashedPassword = await hashPassword(args.password);
  
      return await this.ormProvider.user.create({
        data: {
          email: args.email,
          hashPassword: hashedPassword,
          phoneNumber: args.phoneNumber,
          name: args.name,
          position: args.position as Position,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          position: true,
        },
      });
    } catch (error) {
      console.error('Error creating user:', error);
      throw new BadRequestException(error.message || 'Failed to create user');
    }
  }

  async UpdateUser(args: UpdateUserDto) {
    try {
      const hashedPassword = await hashPassword(args.password);
      return await this.ormProvider.user.update({
        where: { id: args.id },
        data: {
          email: args.email,

          hashPassword: hashedPassword,
          position: args.position,
          phoneNumber: args.phoneNumber,
          name: args.name,

          updatedAt: new Date(),
        },
      });
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async findOne({ id }: UserIdDto) {
    try {
      return await this.ormProvider.user.findFirst({
        where: { id: id },
        select: {
          email: true,
          createdAt: true,
          removedAt: true,
          id: true,
          LaboratoryAccountManager: true,
          LaboratoryCreatedBy: { select: { id: true } },
          RegistryCreatedBy: { select: { id: true } },
          RegistryUpdatedBy: { select: { id: true } },

          phoneNumber: true,
          name: true,
          position: true,
        },
      });
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async deleteUser({ id }: UserIdDto) {
    try {
      return await this.ormProvider.user.update({
        where: { id: id },
        data: {
          removedAt: new Date(),
        },
      });
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async findMany(page: number = 1, limit: number = 15) {
    try {
      const skip = (page - 1) * limit;
      const users = await this.ormProvider.user.findMany({
        skip: skip,
        take: limit,
        select: {
          email: true,
          createdAt: true,
          removedAt: true,
          id: true,
          LaboratoryAccountManager: true,
          LaboratoryCreatedBy: { select: { id: true } },
          RegistryCreatedBy: { select: { id: true } },
          RegistryUpdatedBy: { select: { id: true } },

          phoneNumber: true,
          name: true,
          position: true,
        },
        where: {
          removedAt: null,
        },
      });

      return users;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
}
