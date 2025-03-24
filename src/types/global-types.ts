import {
  InvoiceStatus,
  KitType,
  Position,
  SampleStatus,
  SampleType,
  ServiceType,
  SettlementStatus,
} from '@prisma/client';

export interface UserSessionType {
  cookie: Record<string, any>;
  passport: {
    user: {
      id: string;
      phoneNumber?: string;
      email?: string;

      position: Position;
    };
  };
}

export interface RegistryType {
  MotId: string;
  personName: string;
  Laboratory: string;
  costumerRelation?: string;
  serviceType: ServiceType;
  kitType: KitType;
  sampleType: SampleType;
  urgentStatus?: boolean;
  description?: string;
  productPriceUsd: string;
  dataSampleReceived: Date;
  sampleExtractionDate?: Date;
  dataSentToKorea?: Date;
  rawFileReceivedDate?: Date;
  analysisCompletionDate?: Date;
  resultReadyTime?: Date;
  sendSeries: number;
}

export enum OrderBy {
  asc = 'asc',
  desc = 'desc',
}
