import { ApiProperty } from '@nestjs/swagger';
import { Currency } from '@prisma/client';
import {
  IsEnum,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
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
  @IsUUID()
  LaboratoryInvoiceId?: string;

  @ApiProperty({
    description: 'payment amount',
    example: '100000',
    required: false,
    type: 'string',
  })
  @IsString()
  amountPaid?: string;

  @ApiProperty({
    description: 'payment date',
    example: '2025-02-01T00:00:00.000Z',
    required: false,
    type: 'string',
  })
  @IsISO8601()
  paymentDate?: string;

  @ApiProperty({
    description: 'payment currency',
    example: 'DOLLAR',
    required: false,
    enum: Currency,
  })
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
