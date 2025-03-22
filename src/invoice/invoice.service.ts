import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrmProvider } from 'src/providers/orm.provider';
import {
  CreateInvoiceDto,
  InvoiceFindManyDto,
  InvoiceIdDto,
  UpdateInvoiceDto,
} from './dtos/invoice.dto';
import { RegistryService } from 'src/registry/registry.service';
import { UserIdDto } from 'src/user/dtos/user.dto';
import { OrderBy } from 'src/types/global-types';
import { Position } from '@prisma/client';

import Big from 'big.js';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly ormProvider: OrmProvider,
    private readonly registryService: RegistryService,
  ) {}

  async create(args: CreateInvoiceDto, userId: UserIdDto) {
    try {
      const { registryIds, ...invoiceInfo } = args;

      const registriesInfo = await this.registryService.registriesPreChecks({
        ids: registryIds,
      });

      const totalRialPrice = new Big(registriesInfo.totalUsdPrice).times(
        new Big(invoiceInfo.usdExchangeRate),
      );

      const invoice = await this.ormProvider.laboratoryInvoice.create({
        data: {
          ...invoiceInfo,

          totalPriceRial: totalRialPrice.toString(),
          totalUsdPrice: registriesInfo.totalUsdPrice,
          outstandingAmount: registriesInfo.totalUsdPrice,
          status: 'DRAFT',
          Laboratory: { connect: { id: registriesInfo.laboratoryId } },
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
          include: { Registries: { select: { id: true } } }, // Fetch current registry IDs
        });

      if (!existingInvoice) {
        throw new NotFoundException('Invoice not found!');
      }

      if (existingInvoice.status !== 'DRAFT' && position !== 'ADMIN') {
        throw new BadRequestException('Invoice is already issued!');
      }

      const { registryIds, ...updateData } = args;
      const currentRegistryIds = existingInvoice.Registries.map((r) => r.id);

      const newRegistryIds = registryIds || [];
      const addedRegistryIds = newRegistryIds.filter(
        (id) => !currentRegistryIds.includes(id),
      );
      const removedRegistryIds = currentRegistryIds.filter(
        (id) => !newRegistryIds.includes(id),
      );

      const newRegistriesInfo = newRegistryIds.length
        ? await this.registryService.registriesPreChecks({
            ids: newRegistryIds,
          })
        : undefined;
      const usdExchangeRate = updateData.usdExchangeRate
        ? updateData.usdExchangeRate
        : existingInvoice.usdExchangeRate;

      const totalRialPrice = newRegistriesInfo?.totalUsdPrice
        ? new Big(newRegistriesInfo.totalUsdPrice)
            .times(new Big(usdExchangeRate))
            .toString()
        : new Big(existingInvoice.totalUsdPrice)
            .times(new Big(usdExchangeRate))
            .toString();

      const updatePayload: any = {
        ...updateData,
        updatedAt: new Date(),
        updatedBy: { connect: { id: userId.id } },
      };

      if (newRegistriesInfo?.laboratoryId) {
        updatePayload.Laboratory = {
          connect: { id: newRegistriesInfo.laboratoryId },
        };
      }
      if (registryIds) {
        updatePayload.Registries = { set: registryIds.map((id) => ({ id })) };
      }
      if (totalRialPrice) {
        updatePayload.totalPriceRial = totalRialPrice;
      }
      if (newRegistriesInfo) {
        updatePayload.totalUsdPrice = newRegistriesInfo.totalUsdPrice;
      }

      const newInvoice = await this.ormProvider.laboratoryInvoice.update({
        where: { id },
        data: updatePayload,
      });

      await this.registryService.updateAssignedInvoices(
        { ids: addedRegistryIds },
        { ids: removedRegistryIds },
        newInvoice.status,
      );
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

  async findAllFiltered(
    args: InvoiceFindManyDto,
    page: number = 1,
    limit: number = 15,
    sortingBy: string = 'createdAt',
    orderBy: OrderBy = OrderBy.asc,
  ) {
    try {
      const skip = (page - 1) * limit;

      const filters = {
        LaboratoryId: args.laboratoryId ? args.laboratoryId : undefined,
        status: args.status,
        paymentDueDate: {
          lte: args.paymentDueDateRange?.end,
          gte: args.paymentDueDateRange?.start,
        },
      };

      const invoicesCount = await this.ormProvider.laboratoryInvoice.count({
        where: filters,
      });

      const invoices = await this.ormProvider.laboratoryInvoice.findMany({
        where: filters,
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

      if (args.status === 'CANCELLED' || args.status === 'DRAFT') {
        return { invoices: invoices, totalCount: invoicesCount };
      }

      const invoicesByStatus = await this.ormProvider.laboratoryInvoice.groupBy(
        {
          by: ['paymentStatus'],
          where: filters,
          _count: true,
        },
      );

      const paidCount =
        invoicesByStatus.find((i) => i.paymentStatus === 'PAID')?._count || 0;
      const unpaidCount =
        invoicesByStatus.find((i) => i.paymentStatus === 'UNPAID')?._count || 0;
      const partiallyPaidCount =
        invoicesByStatus.find((i) => i.paymentStatus === 'PARTIALLY_PAID')
          ?._count || 0;

      const issuedInvoicesAmount =
        await this.ormProvider.laboratoryInvoice.aggregate({
          where: {
            LaboratoryId: args.laboratoryId ? args.laboratoryId : undefined,
            status: args.status,
            paymentDueDate: {
              lte: args.paymentDueDateRange?.end,
              gte: args.paymentDueDateRange?.start,
            },
          },
          _sum: {
            totalUsdPrice: true,
            totalPriceRial: true,
            outstandingAmount: true,
          },
        });

      return {
        invoices: invoices,
        totalCount: invoicesCount,
        totalUsdPrice: issuedInvoicesAmount._sum.totalUsdPrice,
        totalPriceRial: issuedInvoicesAmount._sum.totalPriceRial,
        outstandingAmount: issuedInvoicesAmount._sum.outstandingAmount,
        paidCount: paidCount,
        unpaidCount: unpaidCount,
        partiallyPaidCount: partiallyPaidCount,
        paymentPercentage:
          issuedInvoicesAmount._sum.totalUsdPrice &&
          issuedInvoicesAmount._sum.outstandingAmount
            ? new Big(1)
                .minus(
                  new Big(issuedInvoicesAmount._sum.outstandingAmount).div(
                    issuedInvoicesAmount._sum.totalUsdPrice,
                  ),
                )
                .times(100)
                .toFixed(2)
            : null,
      };
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

      if (invoice.status === 'CANCELLED') {
        throw new BadRequestException('invoice is already Cancelled!');
      }

      if (invoice.paymentStatus === 'UNPAID') {
        const cancelledInvoice =
          await this.ormProvider.laboratoryInvoice.update({
            where: { id: id },
            data: {
              status: 'CANCELLED',
              updatedAt: new Date(),
              updatedBy: { connect: { id: userId } },
            },
          });

        return cancelledInvoice;
      }

      throw new BadRequestException('invoice has payment records!');
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Cron('0 0 * * *')
  async markOverdueInvoices() {
    await this.ormProvider.laboratoryInvoice.updateMany({
      where: {
        paymentDueDate: { not: null, lt: new Date() },
        status: 'ISSUED',
      },
      data: { status: 'OVERDUE' },
    });
  }
}
