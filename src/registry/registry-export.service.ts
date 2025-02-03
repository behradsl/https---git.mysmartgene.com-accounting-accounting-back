import { Injectable } from '@nestjs/common';
import { OrmProvider } from 'src/providers/orm.provider';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class RegistryExportService {
  constructor(private readonly ormProvider: OrmProvider) {}

  async generateExcel(res: Response) {
    const registries = await this.ormProvider.registry.findMany({
      include: { Laboratory: { select: { name: true } } },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Registry Data');

    worksheet.addRow([
      'MotId',
      'نام',
      'نام آزمایشگاه',
      'توع سرویس',
      'نوع کیت',
      'وضعیت اظطرار',
      'قیمت',
      'توضیحات',
      'اطلاعات مشتری',
      'وضعیت آماده بودن جواب',
      'زمان آماده شدن',
      'وضعیت فاکتور',
      'مقدار کل فاکتور',
      'مجموع پرداختی',
      'زمان تسویه',
    ]);

    registries.forEach((registry) => {
      worksheet.addRow([
        registry.MotId,
        registry.name,
        registry.Laboratory.name,
        registry.serviceType,
        registry.kitType,
        registry.urgentStatus,
        registry.price.toString(),
        registry.description || 'N/A',
        registry.costumerRelationInfo || 'N/A',
        registry.resultReady,
        registry.resultReadyTime
          ? registry.resultReadyTime.toISOString()
          : 'N/A',
        registry.invoiceStatus,
        registry.totalInvoiceAmount.toString(),
        registry.totalPaid.toString(),
        registry.settlementDate ? registry.settlementDate.toISOString() : 'N/A',
      ]);
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=registries.xlsx',
    );

    await workbook.xlsx.write(res);
    res.end();
  }
}
