import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrmProvider } from 'src/providers/orm.provider';
import {
  CreateFormalPaymentInfoDto,
  CreateLaboratoryDto,
  LaboratoryIdDto,
  UpdateFormalPaymentInfoDto,
  UpdateLaboratoryDto,
} from './dtos/laboratory.dto';
import { Position } from '@prisma/client';
import { connect } from 'http2';

@Injectable()
export class LaboratoryService {
  constructor(private ormProvider: OrmProvider) {}

  async createFormalPaymentInfo(args: CreateFormalPaymentInfoDto) {
    try {
      return await this.ormProvider.laboratory.update({
        where: { id: args.laboratoryId },
        data: {
          paymentType: 'FORMAL',
          LaboratoryFormalPaymentInfo: {
            create: {
              city: args.city,
              economicNumber: args.economicNumber,
              fullAddress: args.fullAddress,
              legalEntityName: args.legalEntityName,
              nationalId: args.nationalId,
              postalCode: args.postalCode,
              province: args.province,
              registrationNumber: args.registrationNumber,
            },
          },
        },
        select: { LaboratoryFormalPaymentInfo: true, name: true },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async laboratoryFormalPaymentInfoFind({ id }: LaboratoryIdDto) {
    try {
      const FormalPaymentInfo = this.ormProvider.laboratory.findUnique({
        where: { id: id },
        select: { LaboratoryFormalPaymentInfo: true, name: true },
      });
      return FormalPaymentInfo;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async createLaboratory(args: CreateLaboratoryDto, userId: string) {
    try {
      return await this.ormProvider.laboratory.create({
        data: {
          address: args.address,
          code: args.code,
          contactName: args.contactName,
          email: args.email,
          name: args.name,
          paymentType: 'INFORMAL',
          phoneNumber: args.phoneNumber,
          type: args.type,
          createdAt: new Date(),
          createdBy: { connect: { id: userId } },
          accountManager: { connect: { id: args.accountManagerId } },
        },
        select: this.getLaboratorySelectFields(),
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateFormalPaymentInfo(args: UpdateFormalPaymentInfoDto) {
    try {
      return await this.ormProvider.laboratory.update({
        where: { id: args.laboratoryId },
        data: {
          LaboratoryFormalPaymentInfo: {
            update: {
              city: args.city,
              economicNumber: args.economicNumber,
              fullAddress: args.fullAddress,
              legalEntityName: args.legalEntityName,
              nationalId: args.nationalId,
              postalCode: args.postalCode,
              province: args.province,
              registrationNumber: args.registrationNumber,
            },
          },
        },
        select: { LaboratoryFormalPaymentInfo: true, name: true },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateLaboratory(args: UpdateLaboratoryDto) {
    try {
      return await this.ormProvider.laboratory.update({
        where: { id: args.id },
        data: {
          address: args.address,
          code: args.code,
          contactName: args.contactName,
          email: args.email,
          name: args.name,
          paymentType: 'INFORMAL',
          phoneNumber: args.phoneNumber,
          type: args.type,
          updatedAt: new Date(),
          accountManager: { connect: { id: args.accountManagerId } },
          fax: args.fax,
        },
        select: this.getLaboratorySelectFields(),
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(id: string) {
    try {
      return await this.ormProvider.laboratory.findUnique({
        where: { id },
        select: this.getLaboratorySelectFields(),
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findMany(page: number = 1, limit: number = 15, position: Position) {
    try {
      const skip = (page - 1) * limit;
      if (position === 'ADMIN') {
        const laboratories = await this.ormProvider.laboratory.findMany({
          skip: skip,
          take: limit,
          select: this.getLaboratorySelectFields(),
        });
        return laboratories;
      }

      const laboratories = await this.ormProvider.laboratory.findMany({
        skip: skip,
        take: limit,
        select: { id: true, name: true },
      });
      return laboratories;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  private getLaboratorySelectFields() {
    return {
      accountManager: { select: { name: true, position: true } },
      accountManagerId: true,
      address: true,
      code: true,
      contactName: true,
      createdAt: true,
      updatedAt: true,
      createdBy: { select: { name: true, position: true } },
      email: true,
      fax: true,
      id: true,
      LaboratoryFormalPaymentInfo: { select: { id: true } },
      name: true,
      paymentType: true,
      phoneNumber: true,
      Registry: { select: { MotId: true, id: true } },
      type: true,
    };
  }

  async findByName(name: string) {
    try {
      return await this.ormProvider.laboratory.findFirst({
        where: { name: name },
        select: { id: true },
      });
    } catch (error) {
      throw new NotFoundException(error);
    }
  }
}
