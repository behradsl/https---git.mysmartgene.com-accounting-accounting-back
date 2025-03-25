import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { OrmProvider } from 'src/providers/orm.provider';
import {
  BulkRegistryIds,
  RegistryIdDto,
  UpdateRegistryDto,
} from '../dtos/registry.dto';
import { Position } from '@prisma/client';
import { OrderBy } from 'src/types/global-types';
import { sampleStatusCalculate } from '../utilities/sampleStatusCal.utilitiels';

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
        where: { id: args.id, final: false },
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

      return {
        registries: existingRegistry,
        totalCount: existingRegistry ? 1 : 0,
      };
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
        where: { final: false },
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
   
    args: Partial<UpdateRegistryDto>,
    userId: string,
    position: Position,
  ) {
    try {
      const existingRegistries = await this.ormProvider.registry.findMany({
        where: { id: { in: args.ids }, final: false },
      });

      if (existingRegistries.length === 0) {
        throw new BadRequestException('Registry not found');
      }

      const updatedRegistries: {}[] = [];

      for (const existingRegistry of existingRegistries) {
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

        const newRegistry = await this.ormProvider.registry.update({
          where: { id: existingRegistry.id },
          data: {
            personName: args.personName,
            Laboratory: args.laboratoryId
              ? { connect: { id: args.laboratoryId } }
              : undefined,
            serviceType: args.serviceType,
            kitType: args.kitType,
            urgentStatus: args.urgentStatus,
            productPriceUsd: args.productPriceUsd,
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
            sendSeries: args.sendSeries ? Number(args.sendSeries) : undefined,
            sampleStatus: sampleStatus,
            registryUpdatedBy: { connect: { id: userId } },
            updatedAt: new Date(),
          },
        });

        updatedRegistries.push(newRegistry);
      }

      return updatedRegistries;
    } catch (error) {
      throw error instanceof BadRequestException
        ? error
        : new InternalServerErrorException('Unexpected error occurred');
    }
  }

  async finalizeRegistry(
    { ids }: BulkRegistryIds,
    userId: string,
    position: Position,
  ) {
    try {
      const existingRegistries = await this.ormProvider.registry.findMany({
        where: { id: { in: ids } },
        select: { userIdRegistryCreatedBy: true, final: true, id: true },
      });

      if (existingRegistries.length === 0) {
        throw new BadRequestException('Registry not found');
      }

      const updatedRegistries: {}[] = [];

      for (const existingRegistry of existingRegistries) {
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

        const newRegistry = await this.ormProvider.registry.update({
          where: { id: existingRegistry.id },
          data: {
            final: true,
            registryUpdatedBy: { connect: { id: userId } },
            updatedAt: new Date(),
          },
        });

        updatedRegistries.push(newRegistry);
      }

      return updatedRegistries;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
