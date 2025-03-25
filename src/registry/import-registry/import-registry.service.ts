import { BadRequestException, Injectable } from '@nestjs/common';
import { LaboratoryService } from 'src/laboratory/laboratory.service';
import { OrmProvider } from 'src/providers/orm.provider';
import * as XLSX from 'xlsx';

import { Prisma } from '@prisma/client';
import { rawDataToRegistryType } from '../utilities/registryType.utilities';
import { sampleStatusCalculate } from '../utilities/sampleStatusCal.utilitiels';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ImportRegistryService {
  constructor(
    private readonly ormProvider: OrmProvider,
    private readonly laboratoryService: LaboratoryService,
    private readonly userService: UserService,
  ) {}

  async importRegistryData(file: Express.Multer.File, userId: string) {
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const persianHeaders = {
        'شناسه MOT': 'MotId',
        'نام شخص': 'personName',
        آزمایشگاه: 'Laboratory',
        'ارتباط مشتری': 'costumerRelation',
        'نوع خدمت': 'serviceType',
        'نوع کیت': 'kitType',
        'نوع نمونه': 'sampleType',
        'وضعیت اضطراری': 'urgentStatus',
        توضیحات: 'description',
        'قیمت محصول به دلار': 'productPriceUsd',

        'تاریخ رسیدن نمونه': 'dataSampleReceived',
        'تاریخ استخراج نمونه': 'sampleExtractionDate',
        'تاریخ ارسال به کره': 'dataSentToKorea',
        'تاریخ رسیدن داده های خام': 'rawFileReceivedDate',
        'تاریخ تکمیل آنالیز': 'analysisCompletionDate',
        'زمان آماده بودن نتیجه': 'resultReadyTime',
        'سری ارسال': 'sendSeries',
      };

      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: false });
      
      const rawHeaders = jsonData[0] as string[];

      const mappedHeaders = rawHeaders.map(
        (header) => persianHeaders[header] || header,
      );

      const dataRows = jsonData.slice(1);

      const parsedData = dataRows.map((row: any) => {
        const rowData: Record<string, any> = {};
        row.forEach((value, index) => {
          const key = mappedHeaders[index];
          if (key) rowData[key] = value;
        });
        return rowData;
      });

      const correctParsedData = rawDataToRegistryType(parsedData);

      if (correctParsedData) {
        const dataToImport: Prisma.RegistryCreateManyInput[] = [];
        const skippedMotIds: string[] = [];

        for (const data of correctParsedData) {
          const existingMot = await this.ormProvider.registry.findFirst({
            where: { MotId: data.MotId },
          });

          if (existingMot) {
            skippedMotIds.push(data.MotId);
            continue;
          }
          const laboratory = await this.laboratoryService.findByName(
            String(data.Laboratory),
          );
          if (!laboratory) {
            throw new BadRequestException(
              `There is no laboratory with name ${data.Laboratory}`,
            );
          }

          const userCostumerRelation = data.costumerRelation
            ? await this.userService.findByContactInfo(
                String(data.costumerRelation),
              )
            : null;

          const sampleStatus = sampleStatusCalculate(
            data.dataSampleReceived,
            data.sampleExtractionDate,
            data.dataSentToKorea,
            data.rawFileReceivedDate,
            data.analysisCompletionDate,
          );

          const { Laboratory, costumerRelation, ...filteredData } = data;

          dataToImport.push({
            laboratoryId: laboratory.id,
            sampleStatus: sampleStatus,
            userIdRegistryCreatedBy: userId,
            costumerRelationId: userCostumerRelation?.id,

            createdAt: new Date(),

            ...filteredData,
          });
        }

        await this.ormProvider.registry.createMany({
          data: dataToImport,
        });
        return {
          message: 'Import completed successfully.',
          skippedRows:
            skippedMotIds.length > 0
              ? `Rows with MotId(s) ${skippedMotIds.join(', ')} already exist in the database and were skipped.`
              : 'No duplicates found.',
        };
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
