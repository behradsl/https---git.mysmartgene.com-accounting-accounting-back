import { BadRequestException, Injectable } from '@nestjs/common';
import { OrmProvider } from 'src/providers/orm.provider';
import { RegistryIdDto, UpdateRegistryDto } from '../dtos/registry.dto';
import { Position } from '@prisma/client';
import { OrderBy } from 'src/types/global-types';

@Injectable()
export class RegistryPreviewService {
  constructor(private readonly ormProvider: OrmProvider) {}

  async findOneNotFinal(
    args: RegistryIdDto,
    userId: string,
    position: Position,
  ) {
    try {
      const existingRegistry = await this.ormProvider.registry.findUnique({
        where: { id: args.id , final:false},
        include: {
          Laboratory: { select: { name: true } },
          registryCreatedBy: {
            select: { name: true, id: true, email: true, position: true },
          },
          registryUpdatedBy: {
            select: { name: true, id: true, email: true, position: true },
          },
        },
      });

      if (!existingRegistry) {
        throw new BadRequestException('Registry not found');
      }

      if (
        position === 'DATA_ENTRY' &&
        !(
          existingRegistry.userIdRegistryCreatedBy === userId &&
          !existingRegistry.final
        )
      ) {
        throw new BadRequestException(
          'You do not have permission to update this registry',
        );
      }

      return { registries: existingRegistry, totalCount: existingRegistry?1:0 };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAllNotFinals(
    userId: string,
    position: Position,
    page: number = 1,
    limit: number = 15,
    sortingBy: string = 'createdAt',
    orderBy: OrderBy = OrderBy.asc,
  ) {
    try {
      const registriesCount = await this.ormProvider.registry.count({
        where: { final: true },
      });
      const skip = (page - 1) * limit;
      if (position === 'ADMIN') {
        const registries = await this.ormProvider.registry.findMany({
          skip: skip,
          take: limit,
          orderBy: { [sortingBy]: orderBy },
          where: { final: false },
          include: {
            Laboratory: { select: { name: true } },
            registryCreatedBy: {
              select: { name: true, id: true, email: true, position: true },
            },
            registryUpdatedBy: {
              select: { name: true, id: true, email: true, position: true },
            },
          },
        });

        return { registries: registries, totalCount: registriesCount };
      }

      const registries = await this.ormProvider.registry.findMany({
        skip: skip,
        take: limit,
        orderBy: { [sortingBy]: orderBy },
        where: { final: false, userIdRegistryCreatedBy: userId },
        include: {
          Laboratory: { select: { name: true } },
          registryCreatedBy: {
            select: { name: true, id: true, email: true, position: true },
          },
          registryUpdatedBy: {
            select: { name: true, id: true, email: true, position: true },
          },
        },
      });
      return { registries: registries, totalCount: registriesCount };
    } catch (error) {}
  }

  async updateNotFinalRegistry(
    args: UpdateRegistryDto,
    userId: string,
    position: Position,
  ) {
    try {
      const existingRegistry = await this.ormProvider.registry.findUnique({
        where: { id: args.id },
        select: { userIdRegistryCreatedBy: true, final: true },
      });

      if (!existingRegistry) {
        throw new BadRequestException('Registry not found');
      }

      if (
        position === 'DATA_ENTRY' &&
        !(
          existingRegistry.userIdRegistryCreatedBy === userId &&
          !existingRegistry.final
        )
      ) {
        throw new BadRequestException(
          'You do not have permission to update this registry',
        );
      }

      return await this.ormProvider.registry.update({
        where: { id: args.id },
        data: {
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

  async finalizeRegistry(
    { id }: RegistryIdDto,
    userId: string,
    position: Position,
  ) {
    try {
      const existingRegistry = await this.ormProvider.registry.findUnique({
        where: { id: id },
        select: { userIdRegistryCreatedBy: true, final: true },
      });

      if (!existingRegistry) {
        throw new BadRequestException('Registry not found');
      }

      if (
        position === 'DATA_ENTRY' &&
        !(
          existingRegistry.userIdRegistryCreatedBy === userId &&
          !existingRegistry.final
        )
      ) {
        throw new BadRequestException(
          'You do not have permission to update this registry',
        );
      }

      return await this.ormProvider.registry.update({
        where: { id: id },
        data: {
          final: true,
          updatedAt: new Date(),
          registryUpdatedBy: { connect: { id: userId } },
        },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
