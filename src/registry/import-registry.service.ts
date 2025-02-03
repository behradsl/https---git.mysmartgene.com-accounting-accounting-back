import { BadRequestException, Injectable } from '@nestjs/common';
import { LaboratoryService } from 'src/laboratory/laboratory.service';
import { OrmProvider } from 'src/providers/orm.provider';
import * as XLSX from 'xlsx';
import { RegistryType } from 'src/types/global-types';
import { InvoiceStatus, Prisma, SampleStatus, SettlementStatus } from '@prisma/client';
import { rawDataToRegistryType } from './utilities/registryType.utilities';

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

      const parsedData = XLSX.utils.sheet_to_json(sheet, {
        header: headers,
        range: 1,
      });
      const correctPArsedData =rawDataToRegistryType(parsedData)

      console.log(correctPArsedData);

      if(correctPArsedData){const dataToImport: Prisma.RegistryCreateManyInput[] = await Promise.all(
        correctPArsedData.map(async (data) => {
          
          
          const laboratory = await  this.laboratoryService.findByName(
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

      return await  this.ormProvider.registry.createMany({ data: dataToImport });
    }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  

  

  
}
