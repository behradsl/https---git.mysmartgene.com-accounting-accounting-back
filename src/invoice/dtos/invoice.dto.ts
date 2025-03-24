import { ApiProperty } from '@nestjs/swagger';
import { Currency, InvoiceStatus, PaymentStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class InvoiceIdDto {
  @ApiProperty({
    description: 'invoice id uuid',
    example: '',
    required: true,
    type: 'string',
  })
  @IsUUID()
  id: string;
}

export class BulkInvoiceIdDto {
  @ApiProperty({
    description: 'An array of invoice IDs to be processed',
    example: [],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  ids: string[];
}

export class CreateInvoiceDto {
  @ApiProperty({
    description: 'invoice date',
    example: '2025-02-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsISO8601()
  invoiceDate?: string;

  @ApiProperty({
    description: 'invoice payment due date',
    example: '2025-02-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsISO8601()
  paymentDueDate?: Date;

  @ApiProperty({
    description: 'usd exchange rate',
    example: '100000',
    required: false,
  })
  @IsString()
  usdExchangeRate: string;

  @ApiProperty({
    description: 'invoice notes',
    example: 'something about invoice',
    required: false,
    type: 'string',
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: 'invoice registries uuid ids', example: [] })
  @IsArray()
  registryIds: string[];
}

export class UpdateInvoiceDto {
  @ApiProperty({
    description: 'invoice date',
    example: '2025-02-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsISO8601()
  invoiceDate?: string;

  @ApiProperty({
    description: 'invoice payment due date',
    example: '2025-02-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsISO8601()
  paymentDueDate?: Date;

  @ApiProperty({
    description: 'usd exchange rate',
    example: '100000',
    required: false,
  })
  @IsString()
  usdExchangeRate: string;

  @ApiProperty({
    description: 'invoice notes',
    example: 'something about invoice',
    required: false,
    type: 'string',
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'invoice registries uuid ids',
    example: [],
    required: false,
  })
  @IsArray()
  registryIds?: string[];
}

export class DateRangeDto {
  @ApiProperty({ description: 'Start date', example: '2025-03-01T00:00:00Z' })
  @IsOptional()
  @IsISO8601()
  start?: string;

  @ApiProperty({ description: 'End date', example: '2025-03-01T00:00:00Z' })
  @IsOptional()
  @IsISO8601()
  end?: string;
}

export class InvoiceFindManyDto {
  @ApiProperty({
    description: 'laboratory id uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
    type: 'string',
  })
  @IsOptional()
  @IsUUID()
  laboratoryId?: string;

  @ApiProperty({
    description: 'invoice status',
    example: 'DRAFT',
    required: false,
    enum: InvoiceStatus,
  })
  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;

  @ApiProperty({
    description: 'payment due date range',
    example: { start: '2025-03-01', end: '2025-03-31' },
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  paymentDueDateRange?: DateRangeDto;
}
