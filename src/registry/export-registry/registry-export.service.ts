import { Injectable } from '@nestjs/common';
import { OrmProvider } from 'src/providers/orm.provider';
import * as ExcelJS from 'exceljs';

import { RegistryFieldAccessService } from 'src/registry-field-access/registry-field-access.service';
import { Position } from '@prisma/client';
import { UserSessionType } from 'src/types/global-types';
import { BulkRegistryIds } from '../dtos/registry.dto';

@Injectable()
export class RegistryExportService {
  constructor(
    private readonly ormProvider: OrmProvider,
    private readonly registryFieldAccessService: RegistryFieldAccessService,
  ) {}

  async generateExcel(
    position: Position,
    { ids }: BulkRegistryIds,
  ): Promise<Buffer> {
    const registries =
      ids.length === 0
        ? await this.ormProvider.registry.findMany({
            where: { final: true },
            include: {
              Laboratory: { select: { name: true } },
              costumerRelation: { select: { phoneNumber: true } },
            },
          })
        : await this.ormProvider.registry.findMany({
            where: {
              id: { in: ids },
              final: true,
            },
            include: {
              Laboratory: { select: { name: true } },
              costumerRelation: { select: { phoneNumber: true } },
            },
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
        // if (!(field in registry)) return 'N/A';
        const value = registry[field];
        return field === 'Laboratory'
          ? value.name
          : value instanceof Date
            ? value.toISOString()
            : field === 'costumerRelation' && value
              ? value.phoneNumber
              : value;
      });

      worksheet.addRow(rowData);
    });

    const uint8Array = await workbook.xlsx.writeBuffer();
    return Buffer.from(uint8Array);
  }

  async generatePreviewExcel(
    session: UserSessionType,
    { ids }: BulkRegistryIds,
  ): Promise<Buffer> {
    const registries =
      session.passport.user.position === 'ADMIN'
        ? ids.length === 0
          ? await this.ormProvider.registry.findMany({
              where: { final: false },
              include: {
                Laboratory: { select: { name: true } },
                costumerRelation: { select: { phoneNumber: true } },
              },
            })
          : await this.ormProvider.registry.findMany({
              where: {
                id: { in: ids },
                final: false,
              },
              include: {
                Laboratory: { select: { name: true } },
                costumerRelation: { select: { phoneNumber: true } },
              },
            })
        : ids.length === 0
          ? await this.ormProvider.registry.findMany({
              where: {
                final: false,
                userIdRegistryCreatedBy: session.passport.user.id,
              },
              include: {
                Laboratory: { select: { name: true } },
                costumerRelation: { select: { phoneNumber: true } },
              },
            })
          : await this.ormProvider.registry.findMany({
              where: {
                id: { in: ids },
                final: false,
                userIdRegistryCreatedBy: session.passport.user.id,
              },
              include: {
                Laboratory: { select: { name: true } },
                costumerRelation: { select: { phoneNumber: true } },
              },
            });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Registry Data');

    const headerRow = Object.keys(PersianRegistryFieldNames);

    worksheet.addRow(Object.values(PersianRegistryFieldNames));

    registries.forEach((registry) => {
      const rowData = headerRow.map((field) => {
        //if (!(field in registry)) return 'N/A';
        const value = registry[field];

        return field === 'Laboratory'
          ? value.name
          : value instanceof Date
            ? value.toISOString()
            : field === 'costumerRelation' && value
              ? value.phoneNumber
              : value;
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
  personName: 'نام شخص',
  Laboratory: 'آزمایشگاه',
  costumerRelation: 'ارتباط مشتری',
  serviceType: 'نوع خدمت',
  kitType: 'نوع کیت',
  sampleType: 'نوع نمونه',
  urgentStatus: 'وضعیت اضطراری',
  description: 'توضیحات',
  productPriceUsd: 'قیمت محصول به دلار',
  dataSampleReceived: 'تاریخ رسیدن نمونه',
  sampleExtractionDate: 'تاریخ استخراج نمونه',
  dataSentToKorea: 'تاریخ ارسال به کره',
  rawFileReceivedDate: 'تاریخ رسیدن داده های خام',
  analysisCompletionDate: 'تاریخ تکمیل آنالیز',
  resultReadyTime: 'زمان آماده بودن نتیجه',
  sendSeries: 'سری ارسال',
};
