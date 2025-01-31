import { ForbiddenException, Injectable } from '@nestjs/common';
import { OrmProvider } from 'src/providers/orm.provider';
import {
  CreateUserDto,
  PositionDto,
  UpdateUserDto,
  UserFindDto,
  UserIdDto,
} from './dtos/user.dto';
import { hashPassword } from 'src/utilities/hash';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private ormProvider: OrmProvider) {}

  async createUser(args: CreateUserDto, { Position }: PositionDto) {
    try {
      const hashedPassword = await hashPassword(args.password);
      return await this.ormProvider.user.create({
        data: {
          email: args.email,

          hashPassword: hashedPassword,

          phoneNumber: args.phoneNumber,
          name: args.name,
          position: Position,
        },
      });
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async UpdateUser(args: UpdateUserDto, { Position }: PositionDto) {
    try {
      const hashedPassword = await hashPassword(args.password);
      return await this.ormProvider.user.update({
        where: { id: args.id },
        data: {
          email: args.email,

          hashPassword: hashedPassword,

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

  async findMany(args: UserFindDto) {
    try {
      const whereInput: Prisma.UserWhereInput = {
        email: args.email,

        name: args.name,
        phoneNumber: args.phoneNumber,
      };
      return await this.ormProvider.user.findMany({
        where: whereInput,
        select: {
          email: true,

          phoneNumber: true,
          name: true,
          position: true,
        },
      });
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
}
