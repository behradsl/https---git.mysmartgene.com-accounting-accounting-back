import { ApiProperty } from '@nestjs/swagger';
import { InvoiceStatus, SettlementStatus, SampleStatus } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsISO8601,
  IsString,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class RegistryIdDto {
  @ApiProperty({ description: 'ID of registry', example: '' })
  @IsUUID()
  id: string;
}

export class CreateRegistryDto {
  @ApiProperty({ description: 'MOT ID', example: '123abc' })
  @IsString()
  MotId: string;

  @ApiProperty({ description: 'Registry name', example: 'Test 1' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'ID of laboratory', example: '' })
  @IsUUID()
  laboratoryId: string;

  @ApiProperty({ description: 'Service type', example: 'Service Type 1' })
  @IsString()
  serviceType: string;

  @ApiProperty({ description: 'Kit type', example: 'Kit Type 1' })
  @IsString()
  kitType: string;

  @ApiProperty({ description: 'Urgency status', example: true })
  @IsBoolean()
  @IsOptional()
  urgentStatus?: boolean;

  @ApiProperty({ description: 'Price', example: '100000' })
  @IsString() // Use string to avoid issues with Decimal in DTO
  price: string;

  @ApiProperty({ description: 'Description', example: 'This is a registry' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Customer relation info',
    example: '09391115840',
  })
  @IsString()
  @IsOptional()
  costumerRelationInfo?: string;

  @ApiProperty({
    description: 'Date of sending sample to Korea',
    example: '2025-02-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  KoreaSendDate?: string;

  @ApiProperty({ description: 'Indicates if result is ready', example: false })
  @IsBoolean()
  @IsOptional()
  resultReady?: boolean;

  @ApiProperty({
    description: 'Result ready time',
    example: '2025-02-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  resultReadyTime?: string;

  @ApiProperty({ description: 'Settlement status', example: 'PENDING' })
  @IsEnum(SettlementStatus)
  settlementStatus: SettlementStatus;

  @ApiProperty({ description: 'Invoice status', example: 'ISSUED' })
  @IsEnum(InvoiceStatus)
  invoiceStatus: InvoiceStatus;

  @ApiProperty({
    description: 'Indicates if proforma has been sent',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  proformaSent?: boolean;

  @ApiProperty({
    description: 'Proforma sent date',
    example: '2025-02-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  proformaSentDate?: string;

  @ApiProperty({ description: 'Total invoice amount', example: '100000' })
  @IsString()
  totalInvoiceAmount: string;

  @ApiProperty({ description: 'Installment one amount', example: '100000' })
  @IsString()
  @IsOptional()
  installmentOne?: string;

  @ApiProperty({
    description: 'Installment one date',
    example: '2025-02-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  installmentOneDate?: string;

  @ApiProperty({ description: 'Installment two amount', example: '100000' })
  @IsString()
  @IsOptional()
  installmentTwo?: string;

  @ApiProperty({
    description: 'Installment two date',
    example: '2025-02-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  installmentTwoDate?: string;

  @ApiProperty({ description: 'Installment three amount', example: '100000' })
  @IsString()
  @IsOptional()
  installmentThree?: string;

  @ApiProperty({
    description: 'Installment three date',
    example: '2025-02-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  installmentThreeDate?: string;

  @ApiProperty({ description: 'Total paid', example: '50000' })
  @IsString()
  totalPaid: string;

  @ApiProperty({
    description: 'Settlement date',
    example: '2025-02-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  settlementDate?: string;

  @ApiProperty({
    description: 'Indicates if official invoice was sent',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  officialInvoiceSent?: boolean;

  @ApiProperty({
    description: 'Official invoice sent date',
    example: '2025-02-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  officialInvoiceSentDate?: string;

  @ApiProperty({ description: 'Sample status', example: 'PENDING' })
  @IsEnum(SampleStatus)
  sampleStatus: SampleStatus;

  @ApiProperty({ description: 'Send series', example: 'Series 123' })
  @IsString()
  sendSeries: string;
}

export class UpdateRegistryDto extends RegistryIdDto {
  @ApiProperty({ description: 'Registry name', example: 'Test 1' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'ID of laboratory', example: '' })
  @IsUUID()
  laboratoryId: string;

  @ApiProperty({ description: 'Service type', example: 'Service Type 1' })
  @IsString()
  serviceType: string;

  @ApiProperty({ description: 'Kit type', example: 'Kit Type 1' })
  @IsString()
  kitType: string;

  @ApiProperty({ description: 'Urgency status', example: true })
  @IsBoolean()
  @IsOptional()
  urgentStatus?: boolean;

  @ApiProperty({ description: 'Price', example: '100000' })
  @IsString() // Use string to avoid issues with Decimal in DTO
  price: string;

  @ApiProperty({ description: 'Description', example: 'This is a registry' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Customer relation info',
    example: '09391115840',
  })
  @IsString()
  @IsOptional()
  costumerRelationInfo?: string;

  @ApiProperty({
    description: 'Date of sending sample to Korea',
    example: '2025-02-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  KoreaSendDate?: string;

  @ApiProperty({ description: 'Indicates if result is ready', example: false })
  @IsBoolean()
  @IsOptional()
  resultReady?: boolean;

  @ApiProperty({
    description: 'Result ready time',
    example: '2025-02-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  resultReadyTime?: string;

  @ApiProperty({ description: 'Settlement status', example: 'PENDING' })
  @IsEnum(SettlementStatus)
  settlementStatus: SettlementStatus;

  @ApiProperty({ description: 'Invoice status', example: 'ISSUED' })
  @IsEnum(InvoiceStatus)
  invoiceStatus: InvoiceStatus;

  @ApiProperty({
    description: 'Indicates if proforma has been sent',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  proformaSent?: boolean;

  @ApiProperty({
    description: 'Proforma sent date',
    example: '2025-02-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  proformaSentDate?: string;

  @ApiProperty({ description: 'Total invoice amount', example: '100000' })
  @IsString()
  totalInvoiceAmount: string;

  @ApiProperty({ description: 'Installment one amount', example: '100000' })
  @IsString()
  @IsOptional()
  installmentOne?: string;

  @ApiProperty({
    description: 'Installment one date',
    example: '2025-02-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  installmentOneDate?: string;

  @ApiProperty({ description: 'Installment two amount', example: '100000' })
  @IsString()
  @IsOptional()
  installmentTwo?: string;

  @ApiProperty({
    description: 'Installment two date',
    example: '2025-02-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  installmentTwoDate?: string;

  @ApiProperty({ description: 'Installment three amount', example: '100000' })
  @IsString()
  @IsOptional()
  installmentThree?: string;

  @ApiProperty({
    description: 'Installment three date',
    example: '2025-02-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  installmentThreeDate?: string;

  @ApiProperty({ description: 'Total paid', example: '50000' })
  @IsString()
  totalPaid: string;


  @ApiProperty({
    description: 'Settlement date',
    example: '2025-02-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  settlementDate?: string;

  @ApiProperty({
    description: 'Indicates if official invoice was sent',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  officialInvoiceSent?: boolean;

  @ApiProperty({
    description: 'Official invoice sent date',
    example: '2025-02-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  officialInvoiceSentDate?: string;

  @ApiProperty({ description: 'Sample status', example: 'PENDING' })
  @IsEnum(SampleStatus)
  sampleStatus: SampleStatus;

  @ApiProperty({ description: 'Send series', example: 'Series 123' })
  @IsString()
  sendSeries: string;
}
