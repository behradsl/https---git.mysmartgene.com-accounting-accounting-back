import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrmProvider } from 'src/providers/orm.provider';
import {
  CreateInvoiceDto,
  InvoiceIdDto,
  UpdateInvoiceDto,
} from './dtos/invoice.dto';
import { RegistryService } from 'src/registry/registry.service';
import { UserIdDto } from 'src/user/dtos/user.dto';
import { OrderBy } from 'src/types/global-types';
import { LaboratoryIdDto } from 'src/laboratory/dtos/laboratory.dto';
import { Position } from '@prisma/client';

import Big from 'big.js';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly ormProvider: OrmProvider,
    private readonly registryService: RegistryService,
  ) {}

  async create(args: CreateInvoiceDto, userId: UserIdDto) {
    try {
      const { registryIds, ...invoiceInfo } = args;
      const laboratoryId = await this.registryService.checkLaboratory({
        ids: registryIds,
      });

      const totalPrices = await this.registryService.calculateTotalPrices({
        ids: registryIds,
      });

      const totalRialPrice = new Big(totalPrices.totalUsdPrice).times(
        new Big(invoiceInfo.usdExchangeRate),
      );

      const invoice = await this.ormProvider.laboratoryInvoice.create({
        data: {
          ...invoiceInfo,
          totalPriceRial: totalRialPrice.toString(),
          totalUsdPrice: totalPrices.totalUsdPrice,
          status: 'DRAFT',
          Laboratory: { connect: { id: laboratoryId } },
          createdBy: { connect: { id: userId.id } },
        },
      });

      await this.registryService.assignInvoice({
        ids: registryIds,
        invoiceId: invoice.id,
        invoiceStatus: invoice.status,
      });
      return invoice;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(
    args: Partial<UpdateInvoiceDto>,
    { id }: InvoiceIdDto,
    userId: UserIdDto,
    position: Position,
  ) {
    try {
      const existingInvoice =
        await this.ormProvider.laboratoryInvoice.findUnique({
          where: { id },
        });

      if (!existingInvoice) {
        throw new NotFoundException('invoice not found!');
      }

      if (existingInvoice.status !== 'DRAFT' && position !== 'ADMIN') {
        throw new BadRequestException('invoice is already issued!');
      }

      const { registryIds, ...updateData } = args;
      const laboratoryId = registryIds
        ? await this.registryService.checkLaboratory({ ids: registryIds })
        : undefined;
      const totalPrices = registryIds
        ? await this.registryService.calculateTotalPrices({ ids: registryIds })
        : undefined;

      const totalRialPrice = totalPrices
        ? new Big(totalPrices.totalUsdPrice)
            .times(new Big(existingInvoice.usdExchangeRate))
            .toString()
        : undefined;

      const updatePayload: any = {
        ...updateData,
        updatedAt: new Date(),
        updatedBy: { connect: { id: userId.id } },
      };

      if (laboratoryId) {
        updatePayload.Laboratory = { connect: { id: laboratoryId } };
      }
      if (registryIds) {
        updatePayload.Registries = { set: registryIds.map((id) => ({ id })) };
      }
      if (totalRialPrice) {
        updatePayload.totalPriceRial = totalRialPrice;
      }
      if (totalPrices) {
        updatePayload.totalUsdPrice = totalPrices.totalUsdPrice;
      }

      const newInvoice = await this.ormProvider.laboratoryInvoice.update({
        where: { id },
        data: updatePayload,
      });

      return newInvoice;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        error?.message || 'An error occurred while updating the invoice.',
      );
    }
  }

  async findOne({ id }: InvoiceIdDto) {
    try {
      const invoice = await this.ormProvider.laboratoryInvoice.findUnique({
        where: { id: id },
      });

      return invoice;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 15,
    sortingBy: string = 'createdAt',
    orderBy: OrderBy = OrderBy.asc,
  ) {
    try {
      const skip = (page - 1) * limit;

      const invoicesCount = await this.ormProvider.laboratoryInvoice.count({});

      const invoices = await this.ormProvider.laboratoryInvoice.findMany({
        take: limit,
        skip: skip,
        orderBy: { [sortingBy]: orderBy },
        include: {
          createdBy: {
            select: { name: true, id: true, email: true, position: true },
          },
          updatedBy: {
            select: { name: true, id: true, email: true, position: true },
          },
          Laboratory: { select: { name: true } },
        },
      });

      return { invoices: invoices, totalCount: invoicesCount };
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async findAByLaboratory(
    { id }: LaboratoryIdDto,
    page: number = 1,
    limit: number = 15,
    sortingBy: string = 'createdAt',
    orderBy: OrderBy = OrderBy.asc,
  ) {
    try {
      const skip = (page - 1) * limit;

      const invoicesCount = await this.ormProvider.laboratoryInvoice.count({
        where: { LaboratoryId: id },
      });

      const invoices = await this.ormProvider.laboratoryInvoice.findMany({
        where: { LaboratoryId: id },
        take: limit,
        skip: skip,
        orderBy: { [sortingBy]: orderBy },
        include: {
          createdBy: {
            select: { name: true, id: true, email: true, position: true },
          },
          updatedBy: {
            select: { name: true, id: true, email: true, position: true },
          },
          Laboratory: { select: { name: true } },
        },
      });

      return { invoices: invoices, totalCount: invoicesCount };
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async invoiceIssuance({ id }: InvoiceIdDto, userId: string) {
    try {
      const invoice = await this.ormProvider.laboratoryInvoice.findUnique({
        where: { id: id },
      });

      if (!invoice) {
        throw new NotFoundException('invoice not found!');
      }

      if (invoice.status != 'DRAFT') {
        throw new BadRequestException('invoice is already issued!');
      }

      const issuedInvoice = await this.ormProvider.laboratoryInvoice.update({
        where: { id: id },
        data: {
          status: 'ISSUED',
          updatedAt: new Date(),
          updatedBy: { connect: { id: userId } },
        },
      });

      return issuedInvoice;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async invoiceCancellation({ id }: InvoiceIdDto, userId: string) {
    try {
      const invoice = await this.ormProvider.laboratoryInvoice.findUnique({
        where: { id: id },
      });

      if (!invoice) {
        throw new NotFoundException('invoice not found!');
      }

      if (invoice.status != 'CANCELLED') {
        throw new BadRequestException('invoice is already Cancelled!');
      }

      const cancelledInvoice = await this.ormProvider.laboratoryInvoice.update({
        where: { id: id },
        data: {
          status: 'CANCELLED',
          updatedAt: new Date(),
          updatedBy: { connect: { id: userId } },
        },
      });

      return cancelledInvoice;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
