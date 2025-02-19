import { Injectable } from '@nestjs/common';
import { OrmProvider } from 'src/providers/orm.provider';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { RegistryFieldAccessService } from 'src/registry-field-access/registry-field-access.service';
import { Position } from '@prisma/client';
import { UserSessionType } from 'src/types/global-types';

@Injectable()
export class RegistryExportService {
  constructor(
    private readonly ormProvider: OrmProvider,
    private readonly registryFieldAccessService: RegistryFieldAccessService,
  ) {}

  async generateExcel(position: Position): Promise<Buffer> {
    const registries = await this.ormProvider.registry.findMany({
      where: { final: true },
      include: { Laboratory: { select: { name: true } } },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Registry Data');

    const visibleFields =
      position === 'ADMIN'
        ? Object.keys(PersianRegistryFieldNames)
        : await this.registryFieldAccessService.findVisibleFields(position);

    if (!Array.isArray(visibleFields) || visibleFields.length === 0)
      throw new Error('No visible fields!');

    const headerRow = visibleFields.map(
      (field) => PersianRegistryFieldNames[field],
    );

    worksheet.addRow(headerRow);

    registries.forEach((registry) => {
      const rowData = visibleFields.map((field) => {
        if (!(field in registry)) return 'N/A';
        const value = registry[field];
        return field === 'Laboratory'
          ? value.name
          : value instanceof Date
            ? value.toISOString()
            : (value ?? 'N/A');
      });

      worksheet.addRow(rowData);
    });

    const uint8Array = await workbook.xlsx.writeBuffer();
    return Buffer.from(uint8Array);
  }

  async generatePreviewExcel(session: UserSessionType): Promise<Buffer> {
    const registries =
      session.passport.user.position === 'ADMIN'
        ? await this.ormProvider.registry.findMany({
            where: { final: false },
            include: { Laboratory: { select: { name: true } } },
          })
        : await this.ormProvider.registry.findMany({
            where: {
              final: false,
              userIdRegistryCreatedBy: session.passport.user.id,
            },
            include: { Laboratory: { select: { name: true } } },
          });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Registry Data');

    const headerRow = Object.keys(PersianRegistryFieldNames);

    worksheet.addRow(headerRow);

    registries.forEach((registry) => {
      const rowData = headerRow.map((field) => {
        if (!(field in registry)) return 'N/A';
        const value = registry[field];
        return field === 'Laboratory'
          ? value.name
          : value instanceof Date
            ? value.toISOString()
            : (value ?? 'N/A');
      });

      worksheet.addRow(rowData);
    });

    const uint8Array = await workbook.xlsx.writeBuffer();
    return Buffer.from(uint8Array);
  }

  async generateEmptyExcel(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Registry Data');

    worksheet.addRow(Object.values(PersianRegistryFieldNames));

    const uint8Array = await workbook.xlsx.writeBuffer();
    return Buffer.from(uint8Array);
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
};
