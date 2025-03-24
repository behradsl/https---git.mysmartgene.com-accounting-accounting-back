import { Injectable } from '@nestjs/common';
import { OrmProvider } from 'src/providers/orm.provider';
import * as ExcelJS from 'exceljs';


import { BulkInvoiceIdDto } from '../dtos/invoice.dto';

@Injectable()
export class InvoiceExportService {
  constructor(
    private readonly ormProvider: OrmProvider,
    
  ) {}

  async generateExcel({ ids }: BulkInvoiceIdDto): Promise<Buffer> {
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
    const worksheet = workbook.addWorksheet('invoice Data');

    const headerRow = Object.values(PersianLaboratoryInvoiceFieldNames);

    worksheet.addRow(headerRow);

    invoices.forEach((invoice) => {
      const rowData = Object.keys(PersianLaboratoryInvoiceFieldNames).map(
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

const PersianLaboratoryInvoiceFieldNames = {
  invoiceNumber: 'شماره فاکتور',
  invoiceDate: 'تاریخ فاکتور',

  Laboratory: 'آزمایشگاه',

  status: 'وضعیت فاکتور',

  paymentDueDate: 'تاریخ سررسید پرداخت',
  paymentStatus: 'وضعیت پرداخت',

  totalUsdPrice: 'مجموع قیمت به دلار',
  usdExchangeRate: 'نرخ تبدیل دلار',
  totalPriceRial: 'مجموع قیمت به ریال',

  outstandingAmount: 'مبلغ باقی‌مانده',
};
