import { BadRequestException, flatten, Injectable } from '@nestjs/common';
import { OrmProvider } from 'src/providers/orm.provider';
import {
  CreateRegistryDto,
  RegistryIdDto,
  UpdateRegistryDto,
} from './dtos/registry.dto';

import { Position, Prisma } from '@prisma/client';

@Injectable()
export class RegistryService {
  constructor(private readonly ormProvider: OrmProvider) {}

  async createRegistry(args: CreateRegistryDto, userId: string) {
    try {
      return await this.ormProvider.registry.create({
        data: {
          MotId: args.MotId,
          name: args.name,
          serviceType: args.serviceType,
          kitType: args.kitType,
          urgentStatus: args.urgentStatus ?? false,

          price: args.price,
          description: args.description,

          costumerRelationInfo: args.costumerRelationInfo,
          KoreaSendDate: args.KoreaSendDate
            ? new Date(args.KoreaSendDate)
            : null,
          resultReady: args.resultReady ?? false,
          resultReadyTime: args.resultReadyTime
            ? new Date(args.resultReadyTime)
            : null,

          settlementStatus: args.settlementStatus,
          invoiceStatus: args.invoiceStatus,

          proformaSent: args.proformaSent ?? false,
          proformaSentDate: args.proformaSentDate
            ? new Date(args.proformaSentDate)
            : null,

          totalInvoiceAmount: args.totalInvoiceAmount,
          installmentOne: args.installmentOne,
          installmentOneDate: args.installmentOneDate
            ? new Date(args.installmentOneDate)
            : null,
          installmentTwo: args.installmentTwo,
          installmentTwoDate: args.installmentTwoDate
            ? new Date(args.installmentTwoDate)
            : null,
          installmentThree: args.installmentThree,
          installmentThreeDate: args.installmentThreeDate
            ? new Date(args.installmentThreeDate)
            : null,

          totalPaid: args.totalPaid,
          paymentPercentage:
            (Number(args.totalPaid) / Number(args.totalInvoiceAmount)) * 100,
          settlementDate: args.settlementDate
            ? new Date(args.settlementDate)
            : null,

          officialInvoiceSent: args.officialInvoiceSent ?? false,
          officialInvoiceSentDate: args.officialInvoiceSentDate
            ? new Date(args.officialInvoiceSentDate)
            : null,

          sampleStatus: args.sampleStatus,
          sendSeries: args.sendSeries,

          createdAt: new Date(),
          updatedAt: null,

          Laboratory: { connect: { id: args.laboratoryId } },
          registryCreatedBy: { connect: { id: userId } },
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateRegistry(
    args: UpdateRegistryDto,userId:string
    
  ) {
    try {
      
      return await this.ormProvider.registry.update({
        where: { id: args.id },
        data: {
          MotId: args.MotId,
          name: args.name,
          serviceType: args.serviceType,
          kitType: args.kitType,
          urgentStatus: args.urgentStatus,

          price: args.price,
          description: args.description,

          costumerRelationInfo: args.costumerRelationInfo,
          KoreaSendDate: args.KoreaSendDate
            ? new Date(args.KoreaSendDate)
            : null,
          resultReady: args.resultReady,
          resultReadyTime: args.resultReadyTime
            ? new Date(args.resultReadyTime)
            : null,

          settlementStatus: args.settlementStatus,
          invoiceStatus: args.invoiceStatus,

          proformaSent: args.proformaSent,
          proformaSentDate: args.proformaSentDate
            ? new Date(args.proformaSentDate)
            : null,

          totalInvoiceAmount: args.totalInvoiceAmount,
          installmentOne: args.installmentOne,
          installmentOneDate: args.installmentOneDate
            ? new Date(args.installmentOneDate)
            : null,
          installmentTwo: args.installmentTwo,
          installmentTwoDate: args.installmentTwoDate
            ? new Date(args.installmentTwoDate)
            : null,
          installmentThree: args.installmentThree,
          installmentThreeDate: args.installmentThreeDate
            ? new Date(args.installmentThreeDate)
            : null,

          totalPaid: args.totalPaid,
          paymentPercentage: args.totalInvoiceAmount
            ? (Number(args.totalPaid) / Number(args.totalInvoiceAmount)) * 100
            : 0,
          settlementDate: args.settlementDate
            ? new Date(args.settlementDate)
            : null,

          officialInvoiceSent: args.officialInvoiceSent,
          officialInvoiceSentDate: args.officialInvoiceSentDate
            ? new Date(args.officialInvoiceSentDate)
            : null,

          sampleStatus: args.sampleStatus,
          sendSeries: args.sendSeries,

          updatedAt: new Date(),
          registryUpdatedBy: { connect: { id: userId } },
        },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findMany() {
    try {
      return await this.ormProvider.registry.findMany();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(args: RegistryIdDto) {
    try {
      const existingRegistry = await this.ormProvider.registry.findUnique({
        where: { id: args.id },
      });

      return existingRegistry;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
