import { Injectable } from '@nestjs/common';
import { OrmProvider } from 'src/providers/orm.provider';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { RegistryFieldAccessService } from 'src/registry-field-access/registry-field-access.service';
import { Position } from '@prisma/client';

@Injectable()
export class RegistryExportService {
  constructor(
    private readonly ormProvider: OrmProvider,
    private readonly registryFieldAccessService: RegistryFieldAccessService,
  ) {}

  async generateExcel(res: Response, position: Position) {
    const registries = await this.ormProvider.registry.findMany({
      include: { Laboratory: { select: { name: true } } },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Registry Data');

    const visibleFields =
      await this.registryFieldAccessService.findVisibleFields(position);

    console.log(visibleFields);

    if (!Array.isArray(visibleFields) || visibleFields.length === 0)
      return 'no visible fields!';

    const headerRow = visibleFields.map(
      (field) => PersianRegistryFieldNames[field],
    );
    
    worksheet.addRow(headerRow);

    registries.forEach((registry) => {
      const rowData = visibleFields.map((field) => {
        if (!(field in registry)) return 'N/A';

        const value = registry[field];
        return value instanceof Date ? value.toISOString() : (value ?? 'N/A');
      });

      worksheet.addRow(rowData);
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

const PersianRegistryFieldNames = {
  MotId: 'شناسه MOT',
  name: 'نام',
  Laboratory: 'آزمایشگاه',
  laboratoryId: 'شناسه آزمایشگاه',
  serviceType: 'نوع خدمات',
  kitType: 'نوع کیت',
  urgentStatus: 'وضعیت اضطراری',
  price: 'قیمت',
  description: 'توضیحات',
  costumerRelationInfo: 'اطلاعات ارتباط با مشتری',
  KoreaSendDate: 'تاریخ ارسال به کره',
  resultReady: 'نتیجه آماده',
  resultReadyTime: 'زمان آماده بودن نتیجه',
  settlementStatus: 'وضعیت تسویه حساب',
  invoiceStatus: 'وضعیت فاکتور',
  proformaSent: 'ارسال پیش‌فاکتور',
  proformaSentDate: 'تاریخ ارسال پیش‌فاکتور',
  totalInvoiceAmount: 'مبلغ کل فاکتور',
  installmentOne: 'قسط اول',
  installmentOneDate: 'تاریخ قسط اول',
  installmentTwo: 'قسط دوم',
  installmentTwoDate: 'تاریخ قسط دوم',
  installmentThree: 'قسط سوم',
  installmentThreeDate: 'تاریخ قسط سوم',
  totalPaid: 'مجموع پرداختی',
  paymentPercentage: 'درصد پرداخت',
  settlementDate: 'تاریخ تسویه حساب',
  officialInvoiceSent: 'ارسال فاکتور رسمی',
  officialInvoiceSentDate: 'تاریخ ارسال فاکتور رسمی',
  sampleStatus: 'وضعیت نمونه',
  sendSeries: 'سری ارسال',
  createdAt: 'تاریخ ایجاد',
  updatedAt: 'تاریخ بروزرسانی',
  registryCreatedBy: 'ایجاد شده توسط',
  userIdRegistryCreatedBy: 'شناسه کاربر ایجاد کننده',
  registryUpdatedBy: 'بروزرسانی شده توسط',
  userIdRegistryUpdatedBy: 'شناسه کاربر بروزرسانی کننده',
};
