import { ApiProperty } from '@nestjs/swagger';
import { Currency } from '@prisma/client';
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

export class PaymentIdDto {
  @ApiProperty({
    description: 'payment id uuid',
    example: '',
    required: true,
    type: 'string',
  })
  @IsUUID()
  id: string;
}

export class BulkPaymentIdDto {
  @ApiProperty({
    description: 'An array of payments IDs to be processed',
    example: [],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  ids: string[];
}

export class CreatePaymentDto {
  @ApiProperty({
    description: 'invoice id uuid',
    example: '',
    required: true,
    type: 'string',
  })
  @IsUUID()
  LaboratoryInvoiceId: string;

  @ApiProperty({
    description: 'payment amount',
    example: '100000',
    required: true,
    type: 'string',
  })
  @IsString()
  amountPaid: string;

  @ApiProperty({
    description: 'payment date',
    example: '2025-02-01T00:00:00.000Z',
    required: true,
    type: 'string',
  })
  @IsISO8601()
  paymentDate: string;

  @ApiProperty({
    description: 'payment currency',
    example: 'DOLLAR',
    required: true,
    enum: Currency,
  })
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({
    description: 'payment notes',
    example: 'something about payment',
    required: false,
    type: 'string',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdatePaymentDto {
  @ApiProperty({
    description: 'invoice id uuid',
    example: '',
    required: false,
    type: 'string',
  })
  @IsOptional()
  @IsUUID()
  LaboratoryInvoiceId?: string;

  @ApiProperty({
    description: 'payment amount',
    example: '100000',
    required: false,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  amountPaid?: string;

  @ApiProperty({
    description: 'payment date',
    example: '2025-02-01T00:00:00.000Z',
    required: false,
    type: 'string',
  })
  @IsOptional()
  @IsISO8601()
  paymentDate?: string;

  @ApiProperty({
    description: 'payment currency',
    example: 'DOLLAR',
    required: false,
    enum: Currency,
  })
  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

  @ApiProperty({
    description: 'payment notes',
    example: 'something about payment',
    required: false,
    type: 'string',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class DateRangeDto {
  @ApiProperty({ description: 'Start date', example: '2025-03-01' })
  @IsOptional()
  @IsISO8601()
  start?: string;

  @ApiProperty({ description: 'End date', example: '2025-03-31' })
  @IsOptional()
  @IsISO8601()
  end?: string;
}

export class PaymentFindManyDto {
  @ApiProperty({
    description: 'laboratory id uuid',
    example: '',
    required: false,
    type: 'string',
  })
  @IsOptional()
  @IsUUID()
  laboratoryId?: string;

  @ApiProperty({
    description: 'payment currency',
    example: Currency.DOLLAR,
    required: false,
    enum: Currency,
  })
  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

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
