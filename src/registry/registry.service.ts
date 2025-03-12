import {
  BadRequestException,
  flatten,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { OrmProvider } from 'src/providers/orm.provider';
import {
  BulkRegistryIds,
  CreateRegistryDto,
  RegistryAssignInvoiceDto,
  RegistryIdDto,
  UpdateRegistryDto,
} from './dtos/registry.dto';

import { Position, Prisma } from '@prisma/client';
import { OrderBy } from 'src/types/global-types';
import { sampleStatusCalculate } from './utilities/sampleStatusCal.utilitiels';
import { InvoiceIdDto } from 'src/invoice/dtos/invoice.dto';

@Injectable()
export class RegistryService {
  constructor(private readonly ormProvider: OrmProvider) {}

  async createRegistry(args: CreateRegistryDto, userId: string) {
    try {
      const sampleStatus = sampleStatusCalculate(
        args.dataSampleReceived,
        args.sampleExtractionDate,
        args.dataSentToKorea,
        args.rawFileReceivedDate,
        args.analysisCompletionDate,
      );
      return await this.ormProvider.registry.create({
        data: {
          MotId: args.MotId,
          personName: args.personName,
          costumerRelation: { connect: { id: args.costumerRelationId } },
          serviceType: args.serviceType,
          kitType: args.kitType,
          urgentStatus: args.urgentStatus ?? false,
          sampleType: args.sampleType,
          productPriceUsd: args.productPriceUsd,
          usdExchangeRate: args.usdExchangeRate,
          totalPriceRial: args.totalPriceRial,
          description: args.description,
          dataSampleReceived: new Date(args.dataSampleReceived),
          sampleExtractionDate: args.sampleExtractionDate
            ? new Date(args.sampleExtractionDate)
            : null,

          dataSentToKorea: args.dataSentToKorea
            ? new Date(args.dataSentToKorea)
            : null,

          rawFileReceivedDate: args.rawFileReceivedDate
            ? new Date(args.rawFileReceivedDate)
            : null,

          analysisCompletionDate: args.analysisCompletionDate
            ? new Date(args.analysisCompletionDate)
            : null,

          resultReadyTime: args.resultReadyTime
            ? new Date(args.resultReadyTime)
            : null,

          sampleStatus: sampleStatus,
          sendSeries: args.sendSeries,
          settlementStatus: 'PENDING',

          createdAt: new Date(),
          updatedAt: null,

          Laboratory: { connect: { id: args.laboratoryId } },
          registryCreatedBy: { connect: { id: userId } },
          final: false,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateRegistry(
    { ids }: BulkRegistryIds,
    args: Partial<UpdateRegistryDto>,
    userId: string,
    position: Position,
  ) {
    try {
      const editableFields =
        position === 'ADMIN'
          ? null
          : await this.ormProvider.registryFieldAccess.findMany({
              where: { position, access: 'EDITABLE' },
              select: { registryField: true },
            });

      const allowedFields = editableFields
        ? editableFields.map((field) => field.registryField)
        : null;

      const existingRegistries = await this.ormProvider.registry.findMany({
        where: { id: { in: ids } },
      });

      if (existingRegistries.length === 0) {
        throw new BadRequestException('No matching registries found.');
      }

      const updatedRegistries: {}[] = [];
      const fieldMappings: Record<string, any> = {
        personName: args.personName,
        Laboratory: args.laboratoryId
          ? { connect: { id: args.laboratoryId } }
          : undefined,
        serviceType: args.serviceType,
        kitType: args.kitType,
        urgentStatus: args.urgentStatus,
        productPriceUsd: args.productPriceUsd,
        usdExchangeRate: args.usdExchangeRate,
        totalPriceRial: args.totalPriceRial,
        description: args.description,
        costumerRelation: args.costumerRelationId
          ? { connect: { id: args.costumerRelationId } }
          : undefined,
        dataSentToKorea: args.dataSentToKorea
          ? new Date(args.dataSentToKorea)
          : undefined,
        dataSampleReceived: args.dataSampleReceived
          ? new Date(args.dataSampleReceived)
          : undefined,
        sampleExtractionDate: args.sampleExtractionDate
          ? new Date(args.sampleExtractionDate)
          : undefined,
        rawFileReceivedDate: args.rawFileReceivedDate
          ? new Date(args.rawFileReceivedDate)
          : undefined,
        analysisCompletionDate: args.analysisCompletionDate
          ? new Date(args.analysisCompletionDate)
          : undefined,
        resultReadyTime: args.resultReadyTime
          ? new Date(args.resultReadyTime)
          : undefined,
        sendSeries: args.sendSeries,
      };

      const updateData: Record<string, any> = {};

      if (!allowedFields) {
        Object.assign(updateData, fieldMappings);
      } else {
        for (const field of Object.keys(fieldMappings)) {
          if (
            allowedFields.includes(field) &&
            args[field as keyof UpdateRegistryDto] !== undefined
          ) {
            updateData[field] = fieldMappings[field];
          }
        }
      }

      if (Object.keys(updateData).length === 0) {
        throw new BadRequestException(`No permitted fields to update`);
      }
      for (const existingRegistry of existingRegistries) {
        const sampleStatus = sampleStatusCalculate(
          args.dataSampleReceived ??
            String(existingRegistry.dataSampleReceived),
          args.sampleExtractionDate ??
            String(existingRegistry.sampleExtractionDate),
          args.dataSentToKorea ?? String(existingRegistry.dataSentToKorea),
          args.rawFileReceivedDate ??
            String(existingRegistry.rawFileReceivedDate),
          args.analysisCompletionDate ??
            String(existingRegistry.analysisCompletionDate),
        );

        const updatedRegistry = await this.ormProvider.registry.update({
          where: { id: existingRegistry.id, final: true },
          data: {
            registryUpdatedBy: { connect: { id: userId } },
            updatedAt: new Date(),
            sampleStatus,
            ...updateData,
          },
        });

        updatedRegistries.push(updatedRegistry);
      }

      return updatedRegistries;
    } catch (error) {
      throw error instanceof BadRequestException
        ? error
        : new InternalServerErrorException('Unexpected error occurred');
    }
  }

  async findMany(
    page: number = 1,
    limit: number = 15,
    sortingBy: string = 'createdAt',
    orderBy: OrderBy = OrderBy.asc,
  ) {
    try {
      const skip = (page - 1) * limit;

      const registriesCount = await this.ormProvider.registry.count({
        where: { final: true },
      });

      const registries = await this.ormProvider.registry.findMany({
        where: { final: true },
        take: limit,
        skip: skip,
        orderBy: { [sortingBy]: orderBy },
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
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(args: RegistryIdDto) {
    try {
      const existingRegistry = await this.ormProvider.registry.findUnique({
        where: { id: args.id, final: true },
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

      return {
        registries: existingRegistry,
        totalCount: existingRegistry ? 1 : 0,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteRegistry({ ids }: BulkRegistryIds, userId: string) {
    try {
      const deletedRegistries = await this.ormProvider.registry.updateMany({
        where: { id: { in: ids } },
        data: { removedAt: new Date(), userIdRegistryUpdatedBy: userId },
      });

      return deletedRegistries;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async calculateTotalPrices(ids: BulkRegistryIds) {
    try {
      const registries = await this.ormProvider.registry.findMany({
        where: {
          id: { in: ids.ids },
        },
      });

      const registryNullPrice = registries.map((registry) => {
        if (
          registry.totalPriceRial === null ||
          registry.usdExchangeRate === null ||
          registry.productPriceUsd === null
        ) {
          return registry.MotId;
        }
      });

      if (registryNullPrice.length > 0) {
        throw new BadRequestException(
          `Registries with MOT ID(s) ${registryNullPrice.join(', ')} have empty prices.`,
        );
      }

      const totalPrices = await this.ormProvider.registry.aggregate({
        where: { id: { in: ids.ids } },
        _sum: {
          productPriceUsd: true,
          totalPriceRial: true,
        },
      });

      const totalUsdPrice =
        totalPrices._sum.productPriceUsd ??
        (() => {
          throw new BadRequestException('Could not calculate total USD price');
        })();
      const totalRialPrice =
        totalPrices._sum.totalPriceRial ??
        (() => {
          throw new BadRequestException('Could not calculate total Rial price');
        })();

      return { totalUsdPrice: totalUsdPrice, totalRialPrice: totalRialPrice };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async assignInvoice({
    ids,
    invoiceId,
    invoiceStatus,
  }: RegistryAssignInvoiceDto) {
    try {
      await this.ormProvider.registry.updateMany({
        where: { id: { in: ids } },
        data: { LaboratoryInvoiceId: invoiceId, invoiceStatus: invoiceStatus },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
