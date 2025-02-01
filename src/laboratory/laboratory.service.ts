import { BadRequestException, Injectable } from '@nestjs/common';
import { OrmProvider } from 'src/providers/orm.provider';
import {
  CreateFormalPaymentInfoDto,
  CreateLaboratoryDto,
  UpdateFormalPaymentInfoDto,
  UpdateLaboratoryDto,
} from './dtos/laboratory.dto';

@Injectable()
export class LaboratoryService {
  constructor(private ormProvider: OrmProvider) {}

  async createFormalPaymentInfo(args: CreateFormalPaymentInfoDto) {
    try {
      return await this.ormProvider.laboratory.update({
        where: { id: args.id },
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
        select: this.getLaboratorySelectFields(),
      });
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
          accountManager: { connect: { id: args.accountManager } },
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
        where: { id: args.id },
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
        select: this.getLaboratorySelectFields(),
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
          accountManager: { connect: { id: args.accountManager } },
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

  async findMany() {
    try {
      return await this.ormProvider.laboratory.findMany({
        select: this.getLaboratorySelectFields(),
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  private getLaboratorySelectFields() {
    return {
      accountManager: true,
      address: true,
      code: true,
      contactName: true,
      createdAt: true,
      updatedAt: true,
      createdBy: true,
      email: true,
      fax: true,
      id: true,
      LaboratoryFormalPaymentInfo: true,
      name: true,
      paymentType: true,
      phoneNumber: true,
      Registry: true,
      type: true,
    };
  }
}
