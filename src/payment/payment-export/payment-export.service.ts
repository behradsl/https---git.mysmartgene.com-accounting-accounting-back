import { Injectable } from '@nestjs/common';
import { OrmProvider } from 'src/providers/orm.provider';
import * as ExcelJS from 'exceljs';
import { BulkPaymentIdDto } from '../dtos/payment.dto';

@Injectable()
export class PaymentExportService {
  constructor(private readonly ormProvider: OrmProvider) {}

  async generateExcel({ ids }: BulkPaymentIdDto): Promise<Buffer> {
    const payments =
      ids.length === 0
        ? await this.ormProvider.payment.findMany({
            include: {
              Laboratory: { select: { name: true } },
              LaboratoryInvoice: { select: { invoiceNumber: true } },
            },
          })
        : await this.ormProvider.payment.findMany({
            where: {
              id: { in: ids },
            },
            include: {
              Laboratory: { select: { name: true } },
              LaboratoryInvoice: { select: { invoiceNumber: true } },
            },
          });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('payments Data');

    const headerRow = Object.values(PersianPaymentFieldNames);

    worksheet.addRow(headerRow);

    payments.forEach((payment) => {
      const rowData = Object.keys(PersianPaymentFieldNames).map((field) => {
        const value = payment[field];
        return field === 'Laboratory'
          ? value.name
          : value instanceof Date
            ? value.toISOString()
            : field === 'LaboratoryInvoice'
              ? value.invoiceNumber
              : value;
      });

      worksheet.addRow(rowData);
    });

    const uint8Array = await workbook.xlsx.writeBuffer();
    return Buffer.from(uint8Array);
  }
}

const PersianPaymentFieldNames = {
  Laboratory: 'آزمایشگاه',

  LaboratoryInvoice: 'شماره فاکتور',

  amountPaid: 'مبلغ پرداخت‌شده',

  paymentDate: 'تاریخ پرداخت',

  currency: 'واحد پول',
};
