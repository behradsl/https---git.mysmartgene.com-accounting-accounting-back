import { InvoiceStatus, Position, SampleStatus, SettlementStatus } from '@prisma/client';

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
  name: string;

  Laboratory: string
  

  serviceType: string;
  kitType: string;
  urgentStatus?: boolean;

  price: number; 

  description?: string;

  costumerRelationInfo?: string;
  KoreaSendDate?: Date;

  resultReady?: boolean;
  resultReadyTime?: Date;

  settlementStatus: SettlementStatus; 
  invoiceStatus: InvoiceStatus;

  proformaSent?: boolean;
  proformaSentDate?: Date;

  totalInvoiceAmount: number; 

  installmentOne?: number; 
  installmentOneDate?: Date;

  installmentTwo?: number; 
  installmentTwoDate?: Date;

  installmentThree?: number; 
  installmentThreeDate?: Date;

  totalPaid: number; 
   

  settlementDate?: Date;

  officialInvoiceSent?: boolean;
  officialInvoiceSentDate?: Date;

  sampleStatus: SampleStatus;

  sendSeries: string;

  
}




