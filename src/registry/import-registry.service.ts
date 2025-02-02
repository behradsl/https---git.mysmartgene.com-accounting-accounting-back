import { BadRequestException, Injectable } from '@nestjs/common';
import { LaboratoryService } from 'src/laboratory/laboratory.service';
import { OrmProvider } from 'src/providers/orm.provider';
import * as XLSX from 'xlsx';
import { RegistryType } from 'src/types/global-types';
import { Prisma } from '@prisma/client';

@Injectable()
export class ImportRegistryService {
  constructor(
    private readonly ormProvider: OrmProvider,
    private readonly laboratoryService: LaboratoryService,
  ) {}

  async importRegistryData(file: Express.Multer.File, userId: string) {
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const headers = [
        'MotId',
        'name',
        'Laboratory',
        'serviceType',
        'kitType',
        'urgentStatus',
        'price',
        'description',
        'costumerRelationInfo',
        'KoreaSendDate',
        'resultReady',
        'resultReadyTime',
        'settlementStatus',
        'invoiceStatus',
        'proformaSent',
        'proformaSentDate',
        'totalInvoiceAmount',
        'installmentOne',
        'installmentOneDate',
        'installmentTwo',
        'installmentTwoDate',
        'installmentThree',
        'installmentThreeDate',
        'totalPaid',
        'settlementDate',
        'officialInvoiceSent',
        'officialInvoiceSentDate',
        'sampleStatus',
        'sendSeries',
      ];

      const parsedData: RegistryType[] = XLSX.utils
        .sheet_to_json(sheet, {
          header: headers,
          range: 1,
        })
        .map((data: any) => {
          return {
            ...data,
            price: parseFloat(data.price) || 0,
            totalInvoiceAmount: parseFloat(data.totalInvoiceAmount) || 0,
            installmentOne: data.installmentOne
              ? parseFloat(data.installmentOne)
              : null,
            installmentTwo: data.installmentTwo
              ? parseFloat(data.installmentTwo)
              : null,
            installmentThree: data.installmentThree
              ? parseFloat(data.installmentThree)
              : null,
            totalPaid: parseFloat(data.totalPaid) || 0,
            KoreaSendDate: this.parseDate(data.KoreaSendDate),
            resultReadyTime: this.parseDate(data.resultReadyTime),
            proformaSentDate: this.parseDate(data.proformaSentDate),
            installmentOneDate: this.parseDate(data.installmentOneDate),
            installmentTwoDate: this.parseDate(data.installmentTwoDate),
            installmentThreeDate: this.parseDate(data.installmentThreeDate),
            settlementDate: this.parseDate(data.settlementDate),
            officialInvoiceSentDate: this.parseDate(
              data.officialInvoiceSentDate,
            ),
            sendSeries: String(data.sentSeries),
          };
        });

      console.log(parsedData);

      const dataToImport: Prisma.RegistryCreateManyInput[] = await Promise.all(
        parsedData.map(async (data) => {
          const laboratory = await this.laboratoryService.findByName(
            data.Laboratory,
          );
          if (!laboratory) {
            throw new BadRequestException(
              `There is no laboratory with name ${data.Laboratory}`,
            );
          }

          return {
            MotId: data.MotId,
            name: data.name,
            laboratoryId: laboratory.id,
            serviceType: data.serviceType,
            kitType: data.kitType,
            urgentStatus: data.urgentStatus,
            price: data.price,
            description: data.description,
            costumerRelationInfo: data.costumerRelationInfo,
            KoreaSendDate: data.KoreaSendDate,
            resultReady: data.resultReady,
            resultReadyTime: data.resultReadyTime,
            settlementStatus: data.settlementStatus,
            invoiceStatus: data.invoiceStatus,
            proformaSent: data.proformaSent,
            proformaSentDate: data.proformaSentDate,
            totalInvoiceAmount: data.totalInvoiceAmount,
            installmentOne: data.installmentOne,
            installmentOneDate: data.installmentOneDate,
            installmentTwo: data.installmentTwo,
            installmentTwoDate: data.installmentTwoDate,
            installmentThree: data.installmentThree,
            installmentThreeDate: data.installmentThreeDate,
            totalPaid: data.totalPaid,
            paymentPercentage:
              (Number(data.totalPaid) / Number(data.totalInvoiceAmount)) * 100,
            settlementDate: data.settlementDate,
            officialInvoiceSent: data.officialInvoiceSent,
            officialInvoiceSentDate: data.officialInvoiceSentDate,
            sampleStatus: data.sampleStatus,
            sendSeries: data.sendSeries,

            createdAt: new Date(),
            updatedAt: null,
            userIdRegistryCreatedBy: userId,
          };
        }),
      );

      return await this.ormProvider.registry.createMany({ data: dataToImport });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  parseDate(dateString: string | number | Date): Date | null {
    if (!dateString) return null; // Skip empty values
    if (dateString instanceof Date) return dateString; // Already a Date object
    if (typeof dateString === 'number') {
      return new Date((dateString - 25569) * 86400 * 1000);
    }
    if (typeof dateString === 'string') {
      const parsedDate = new Date(dateString);
      return isNaN(parsedDate.getTime()) ? null : parsedDate;
    }
    return null;
  }
}
