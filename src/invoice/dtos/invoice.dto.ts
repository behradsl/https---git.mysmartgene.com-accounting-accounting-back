import { ApiProperty } from '@nestjs/swagger';
import { Currency, InvoiceStatus, PaymentStatus } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
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
    description: 'laboratory id uuid',
    example: '',
    required: true,
    type: 'string',
  })
  @IsString()
  LaboratoryId: string;

  @ApiProperty({
    description: 'invoice currency',
    example: 'DOLLAR',
    required: true,
    enum: Currency,
  })
  @IsEnum(Currency)
  currency: Currency;

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
    description: 'invoice payment due date',
    example: '2025-02-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsISO8601()
  paymentDueDate?: Date;

  @ApiProperty({
    description: 'invoice payment status',
    example: 'UNPAID',
    required: true,
    enum: PaymentStatus,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

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
