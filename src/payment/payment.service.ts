import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrmProvider } from 'src/providers/orm.provider';
import {
  CreatePaymentDto,
  PaymentIdDto,
  UpdatePaymentDto,
} from './dtos/payment.dto';
import { InvoiceService } from 'src/invoice/invoice.service';
import { UserIdDto } from 'src/user/dtos/user.dto';

import { InvoiceIdDto } from 'src/invoice/dtos/invoice.dto';

import Big from 'big.js';
import { InvoiceStatus, PaymentStatus } from '@prisma/client';
import { OrderBy } from 'src/types/global-types';

@Injectable()
export class PaymentService {
  constructor(
    private readonly ormProvider: OrmProvider,
    private readonly invoiceService: InvoiceService,
  ) {}

  async create(args: CreatePaymentDto, userId: UserIdDto) {
    try {
      const { LaboratoryInvoiceId, ...paymentInfo } = args;

      const invoice = await this.invoiceService.findOne({
        id: LaboratoryInvoiceId,
      });

      if (!invoice) throw new NotFoundException('invoice not Found!');

      const payment = await this.ormProvider.payment.create({
        data: {
          Laboratory: { connect: { id: invoice.LaboratoryId } },
          LaboratoryInvoice: { connect: { id: LaboratoryInvoiceId } },
          createdBy: { connect: { id: userId.id } },
          ...paymentInfo,
        },
        include: { LaboratoryInvoice: true },
      });

      const invoicePaymentsSum = await this.sumOfInvoicePayments({
        id: args.LaboratoryInvoiceId,
      });

      const totalUsdPrice = new Big(payment.LaboratoryInvoice.totalUsdPrice);
      const usdPaymentsSum = new Big(invoicePaymentsSum.usdPaymentsSum);
      const rialPaymentsSum = new Big(invoicePaymentsSum.rialPaymentsSum);
      const usdExchangeRate = new Big(
        payment.LaboratoryInvoice.usdExchangeRate,
      );

      const outstandingAmount = totalUsdPrice.minus(
        usdPaymentsSum.plus(rialPaymentsSum.div(usdExchangeRate)),
      );

      const invoicePaymentStatus: PaymentStatus =
        outstandingAmount > 0 ? 'PARTIALLY_PAID' : 'PAID';

      const invoiceStatus: InvoiceStatus =
        invoicePaymentStatus === 'PAID' ? 'PAID' : invoice.status;
      await this.ormProvider.payment.update({
        where: { id: payment.id },
        data: {
          LaboratoryInvoice: {
            update: {
              paymentStatus: invoicePaymentStatus,
              outstandingAmount: outstandingAmount,
              status: invoiceStatus,
            },
          },
        },
      });
      return payment;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(
    args: Partial<UpdatePaymentDto>,
    userId: UserIdDto,
    { id }: PaymentIdDto,
  ) {
    try {
      const { LaboratoryInvoiceId, ...paymentInfo } = args;

      const invoice = LaboratoryInvoiceId
        ? await this.invoiceService.findOne({
            id: LaboratoryInvoiceId,
          })
        : undefined;

      if (LaboratoryInvoiceId && !invoice)
        throw new NotFoundException('invoice not Found!');

      const payment = await this.ormProvider.payment.update({
        where: { id: id },
        data: {
          Laboratory: invoice
            ? { connect: { id: invoice.LaboratoryId } }
            : undefined,
          LaboratoryInvoice: LaboratoryInvoiceId
            ? { connect: { id: LaboratoryInvoiceId } }
            : undefined,
          updatedBy: { connect: { id: userId.id } },
          updatedAt: new Date(),
          ...paymentInfo,
        },
        include: { LaboratoryInvoice: true },
      });

      const invoicePaymentsSum = await this.sumOfInvoicePayments({
        id: payment.LaboratoryInvoiceId,
      });

      const totalUsdPrice = new Big(payment.LaboratoryInvoice.totalUsdPrice);
      const usdPaymentsSum = new Big(invoicePaymentsSum.usdPaymentsSum);
      const rialPaymentsSum = new Big(invoicePaymentsSum.rialPaymentsSum);
      const usdExchangeRate = new Big(
        payment.LaboratoryInvoice.usdExchangeRate,
      );

      const outstandingAmount = totalUsdPrice.minus(
        usdPaymentsSum.plus(rialPaymentsSum.div(usdExchangeRate)),
      );

      const invoicePaymentStatus: PaymentStatus =
        outstandingAmount > 0 ? 'PARTIALLY_PAID' : 'PAID';
      await this.ormProvider.payment.update({
        where: { id: payment.id },
        data: {
          LaboratoryInvoice: {
            update: {
              paymentStatus: invoicePaymentStatus,
              outstandingAmount: outstandingAmount,
            },
          },
        },
      });
      return payment;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne({ id }: PaymentIdDto) {
    try {
      const payment = await this.ormProvider.laboratoryInvoice.findUnique({
        where: { id: id },
      });
      return payment;
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

      const paymentsCount = await this.ormProvider.payment.count({});

      const payments = await this.ormProvider.payment.findMany({
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
      return { payments: payments, totalCount: paymentsCount };
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async sumOfInvoicePayments({ id }: InvoiceIdDto) {
    try {
      const usdPaymentsSum = await this.ormProvider.payment.aggregate({
        where: { LaboratoryInvoiceId: id, currency: 'DOLLAR' },
        _sum: { amountPaid: true },
      });
      const rialPaymentsSum = await this.ormProvider.payment.aggregate({
        where: { LaboratoryInvoiceId: id, currency: 'RIAL' },
        _sum: { amountPaid: true },
      });

      return {
        usdPaymentsSum: usdPaymentsSum._sum.amountPaid ?? 0,
        rialPaymentsSum: rialPaymentsSum._sum.amountPaid ?? 0,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAByLaboratory(
    { id }: PaymentIdDto,
    page: number = 1,
    limit: number = 15,
    sortingBy: string = 'createdAt',
    orderBy: OrderBy = OrderBy.asc,
  ) {
    try {
      const skip = (page - 1) * limit;

      const paymentsCount = await this.ormProvider.payment.count({
        where: { LaboratoryId: id },
      });

      const payments = await this.ormProvider.payment.findMany({
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

      return { payments: payments, totalCount: paymentsCount };
    } catch (error) {
      throw new NotFoundException(error);
    }
  }
}
