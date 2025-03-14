import { ApiProperty } from '@nestjs/swagger';
import {
  InvoiceStatus,
  SettlementStatus,
  SampleStatus,
  SampleType,
} from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsISO8601,
  IsString,
  IsUUID,
  IsOptional,
  IsArray,
} from 'class-validator';

export class RegistryIdDto {
  @ApiProperty({ description: 'ID of registry', example: '' })
  @IsUUID()
  id: string;
}

export class BulkRegistryIds {
  @ApiProperty({
    description: 'an array of registry ids to be processed',
    example: [],
  })
  @IsArray()
  ids: string[];
}

export class CreateRegistryDto {
  @ApiProperty({ description: 'MOT ID', example: '123abc' })
  @IsString()
  MotId: string;

  @ApiProperty({ description: 'person name', example: 'john' })
  @IsString()
  personName: string;

  @ApiProperty({ description: 'ID of laboratory', example: '' })
  @IsUUID()
  laboratoryId: string;

  @ApiProperty({ description: 'ID of costumer relation user', example: '' })
  @IsUUID()
  costumerRelationId?: string;

  @ApiProperty({ description: 'Service type', example: 'Service Type 1' })
  @IsString()
  serviceType: string;

  @ApiProperty({ description: 'Kit type', example: 'Kit Type 1' })
  @IsString()
  kitType: string;

  @ApiProperty({ description: 'sample type', example: 'BLOOD_DNA' })
  @IsEnum(SampleType)
  sampleType: SampleType;

  @ApiProperty({ description: 'Urgency status', example: true })
  @IsBoolean()
  @IsOptional()
  urgentStatus?: boolean;

  @ApiProperty({ description: 'Description', example: 'This is a registry' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'product price in usd ', example: '100000' })
  @IsString()
  productPriceUsd?: string;

  
  @ApiProperty({
    description: 'Date of receiving data sample',
    example: '2025-02-01T00:00:00.000Z',
  })
  @IsISO8601()
  dataSampleReceived: string;

  @ApiProperty({
    description: 'Date of extractions of data',
    example: '2025-02-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  sampleExtractionDate: string;

  @ApiProperty({
    description: 'Date of sent data to korea',
    example: '2025-02-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  dataSentToKorea?: string;

  @ApiProperty({
    description: 'Date of receiving raw data',
    example: '2025-02-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  rawFileReceivedDate?: string;

  @ApiProperty({
    description: 'Date analyze completion',
    example: '2025-02-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  analysisCompletionDate?: string;

  @ApiProperty({
    description: 'Result ready time',
    example: '2025-02-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  resultReadyTime?: string;

  @ApiProperty({ description: 'Send series', example: 'Series 123' })
  @IsString()
  sendSeries: number;
}

export class UpdateRegistryDto {
  @ApiProperty({ description: 'MOT ID', example: '123abc' })
  @IsString()
  @IsOptional()
  MotId?: string;

  @ApiProperty({ description: 'person name', example: 'john' })
  @IsString()
  @IsOptional()
  personName?: string;

  @ApiProperty({ description: 'ID of laboratory', example: '' })
  @IsUUID()
  @IsOptional()
  laboratoryId?: string;

  @ApiProperty({ description: 'ID of costumer relation user', example: '' })
  @IsUUID()
  @IsOptional()
  costumerRelationId?: string;

  @ApiProperty({ description: 'Service type', example: 'Service Type 1' })
  @IsString()
  @IsOptional()
  serviceType?: string;

  @ApiProperty({ description: 'Kit type', example: 'Kit Type 1' })
  @IsString()
  @IsOptional()
  kitType?: string;

  @ApiProperty({ description: 'sample type', example: 'BLOOD_DNA' })
  @IsEnum(SampleType)
  @IsOptional()
  sampleType?: SampleType;

  @ApiProperty({ description: 'Urgency status', example: true })
  @IsBoolean()
  @IsOptional()
  @IsOptional()
  urgentStatus?: boolean;

  @ApiProperty({ description: 'Description', example: 'This is a registry' })
  @IsString()
  @IsOptional()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'product price in usd ', example: '100000' })
  @IsString()
  @IsOptional()
  productPriceUsd?: string;

  @ApiProperty({ description: 'uds exchange to rial rate ', example: '950000' })
  @IsString()
  @IsOptional()
  usdExchangeRate?: string;

  @ApiProperty({
    description: 'total price in rial currency ',
    example: '95000000000',
  })
  @IsString()
  @IsOptional()
  totalPriceRial?: string;

  @ApiProperty({
    description: 'Date of receiving data sample',
    example: '2025-02-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  dataSampleReceived?: string;

  @ApiProperty({
    description: 'Date of extractions of data',
    example: '2025-02-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  sampleExtractionDate?: string;

  @ApiProperty({
    description: 'Date of sent data to korea',
    example: '2025-02-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  dataSentToKorea?: string;

  @ApiProperty({
    description: 'Date of receiving raw data',
    example: '2025-02-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  rawFileReceivedDate?: string;

  @ApiProperty({
    description: 'Date analyze completion',
    example: '2025-02-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  analysisCompletionDate?: string;

  @ApiProperty({
    description: 'Result ready time',
    example: '2025-02-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  resultReadyTime?: string;

  @ApiProperty({ description: 'Send series', example: 'Series 123' })
  @IsString()
  @IsOptional()
  sendSeries?: number;
}

export class RegistryAssignInvoiceDto extends BulkRegistryIds {
  invoiceId: string;
  invoiceStatus: InvoiceStatus;
}
