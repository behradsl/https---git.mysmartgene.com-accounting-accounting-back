import { KitType, ServiceType } from '@prisma/client';
import { RegistryType } from 'src/types/global-types';

export function checkRequiredProps(data, index: number) {
  const requiredFields: (keyof RegistryType)[] = [
    'MotId',
    'personName',
    'Laboratory',
    'serviceType',
    'kitType',
    'sampleType',
    'dataSampleReceived',
    'sendSeries',
  ];

  const missedRequiredProps: string[] = [];
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || !data[field]) {
      missedRequiredProps.push(field);
    }
  }
  return missedRequiredProps;
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

export function isValidEnumValue<T extends Record<string, string>>(
  enumObj: T,
  value: any,
): boolean {
  return Object.values(enumObj).includes(value);
}

export function rawDataToRegistryType(
  rawData,
  
): RegistryType[] {
  return rawData.map((data: RegistryType, index: number) => {
    const missedRequiredProps = checkRequiredProps(data, index);

    if (missedRequiredProps.length > 0) {
      throw new Error(
        `Missing required fields in row ${index}: ${missedRequiredProps.join(', ')}`,
      );
    }

    if (!isValidEnumValue(ServiceType, data.serviceType)) {
      throw new Error(
        `Invalid serviceType "${data.serviceType}" in row ${index}`,
      );
    }

    if (!isValidEnumValue(KitType, data.kitType)) {
      throw new Error(`Invalid kitType "${data.kitType}" in row ${index}`);
    }

    return {
      ...data,
    };
  });
}
