import { Injectable } from '@nestjs/common';
import { OrmProvider } from 'src/providers/orm.provider';
import * as ExcelJS from 'exceljs';
import { BulkPaymentIdDto } from '../dtos/payment.dto';

@Injectable()
export class PaymentExportService {
  constructor(private readonly ormProvider: OrmProvider) {}

  async generateExcel({ ids }: BulkPaymentIdDto): Promise<Buffer> {
    const invoices =
      ids.length === 0
        ? await this.ormProvider.laboratoryInvoice.findMany({
            where: { status: { in: ['ISSUED', 'OVERDUE', 'PAID'] } },
            include: {
              Laboratory: { select: { name: true } },
            },
          })
        : await this.ormProvider.laboratoryInvoice.findMany({
            where: {
              id: { in: ids },
              status: { in: ['ISSUED', 'OVERDUE', 'PAID'] },
            },
            include: {
              Laboratory: { select: { name: true } },
            },
          });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('payments Data');

    const headerRow = Object.values(PersianPaymentFieldNames);

    worksheet.addRow(headerRow);

    invoices.forEach((invoice) => {
      const rowData = Object.keys(PersianPaymentFieldNames).map(
        (field) => {
          const value = invoice[field];
          return field === 'Laboratory'
            ? value.name
            : value instanceof Date
              ? value.toISOString()
              : value;
        },
      );

      worksheet.addRow(rowData);
    });

    const uint8Array = await workbook.xlsx.writeBuffer();
    return Buffer.from(uint8Array);
  }
}

const PersianPaymentFieldNames = {
  id: 'شناسه',

  Laboratory: 'آزمایشگاه',

  LaboratoryInvoice: 'فاکتور آزمایشگاه',

  amountPaid: 'مبلغ پرداخت‌شده',

  paymentDate: 'تاریخ پرداخت',

  currency: 'واحد پول',
};
