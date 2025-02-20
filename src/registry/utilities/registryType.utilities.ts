import { BadRequestException } from '@nestjs/common';
import { InvoiceStatus, SampleStatus, SettlementStatus } from '@prisma/client';
import { RegistryType } from 'src/types/global-types';

export function validateEnums(data: any, index: number) {
  if (!Object.values(SettlementStatus).includes(data.settlementStatus)) {
    return { enum: 'SettlementStatus' };
  }

  if (!Object.values(InvoiceStatus).includes(data.invoiceStatus)) {
    return { enum: 'InvoiceStatus' };
  }

  if (!Object.values(SampleStatus).includes(data.sampleStatus)) {
    return { enum: 'SampleStatus' };
  }

  return null;
}

export function checkRequiredProps(data, index: number) {
  const requiredFields: (keyof RegistryType)[] = [
    'MotId',
    'name',
    'Laboratory',
    'serviceType',
    'kitType',
    'price',
    'settlementStatus',
    'invoiceStatus',
    'totalInvoiceAmount',
    'totalPaid',
    'sampleStatus',
    'sendSeries',
  ];

  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || !data[field]) {
      return { field: field };
    }
  }
  return null;
}

function parseDate(dateString: string | number | Date): Date | null {
  if (!dateString) return null;
  if (dateString instanceof Date) return dateString;
  if (typeof dateString === 'number') {
    return new Date((dateString - 25569) * 86400 * 1000);
  }
  if (typeof dateString === 'string') {
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  }
  return null;
}

export function rawDataToRegistryType(rawData): RegistryType[] {
  return rawData.map((data: any, index: number) => {
    const missedRequiredProps = checkRequiredProps(data, index);

    if (missedRequiredProps) {
      throw new Error(
        `there is no ${missedRequiredProps.field} in row ${index}`,
      );
    }

    const invalidEnums = validateEnums(data, index);
    if (invalidEnums) {
      throw new Error(`Invalid ${invalidEnums.enum} in row ${index}`);
    }

    return {
      ...data,
      price: parseFloat(data.price),
      totalInvoiceAmount: parseFloat(data.totalInvoiceAmount),
      installmentOne: data.installmentOne
        ? parseFloat(data.installmentOne)
        : null,
      installmentTwo: data.installmentTwo
        ? parseFloat(data.installmentTwo)
        : null,
      installmentThree: data.installmentThree
        ? parseFloat(data.installmentThree)
        : null,
      totalPaid: parseFloat(data.totalPaid),
      KoreaSendDate: parseDate(data.KoreaSendDate),
      resultReadyTime: parseDate(data.resultReadyTime),
      proformaSentDate: parseDate(data.proformaSentDate),
      installmentOneDate: parseDate(data.installmentOneDate),
      installmentTwoDate: parseDate(data.installmentTwoDate),
      installmentThreeDate: parseDate(data.installmentThreeDate),
      settlementDate: parseDate(data.settlementDate),
      officialInvoiceSentDate: parseDate(data.officialInvoiceSentDate),
      sendSeries: String(data.sentSeries),
    };
  });
}
