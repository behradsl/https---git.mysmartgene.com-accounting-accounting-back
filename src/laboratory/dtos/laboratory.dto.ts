import { ApiProperty } from '@nestjs/swagger';
import { LaboratoriesType, PaymentType } from '@prisma/client';
import { IsEmail, IsEnum, IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class LaboratoryIdDto {
  @ApiProperty({ description: 'id of lab' })
  @IsUUID()
  id: string;
}

export class CreateLaboratoryDto {
  @ApiProperty({ description: 'name of lab', example: 'lab1' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'type of lab', example: 'LABORATORY' })
  @IsEnum(LaboratoriesType)
  type: LaboratoriesType;

  @ApiProperty({ description: 'lab code', example: '1' })
  @IsString()
  code: string;
  @ApiProperty({ description: 'lab address', example: 'tehran-somewhere' })
  @IsString()
  address: string;
  @ApiProperty({
    description: 'lab contact name',

    example: 'lab1 contact',
  })
  @IsString()
  contactName: string;
  @ApiProperty({
    description: 'lab phone number',
    example: '09121112030',
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: 'lab email',

    example: 'lab@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'lab fax',

    example: 'lab1 fax',
  })
  @IsString()
  fax?: string;

  @ApiProperty({
    description: 'id of account manager',

    example: '',
  })
  @IsUUID()
  accountManagerId: UUID;
}

export class CreateFormalPaymentInfoDto extends LaboratoryIdDto {
  @ApiProperty({
    description: 'lab legal entity name',

    example: 'lab1 legal entity name',
  })
  @IsString()
  legalEntityName: string;

  @ApiProperty({
    description: 'lab economic number',

    example: '123456',
  })
  @IsString()
  economicNumber: string;

  @ApiProperty({
    description: 'lab national number',

    example: '987654321',
  })
  @IsString()
  nationalId: string;

  @ApiProperty({
    description: 'lab full address',

    example: 'somewhere-somewhere-somewhere',
  })
  @IsString()
  fullAddress: string;

  @ApiProperty({
    description: 'lab province',

    example: 'tehran',
  })
  @IsString()
  province: string;

  @ApiProperty({
    description: 'lab city',

    example: 'tehran',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'lab registration number',

    example: '111111',
  })
  @IsString()
  registrationNumber: string;

  @ApiProperty({
    description: 'lab postal code',

    example: '1111111',
  })
  @IsString()
  postalCode: string;
}

export class UpdateLaboratoryDto extends LaboratoryIdDto {
  @ApiProperty({ description: 'name of lab', example: 'lab1' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'type of lab', example: 'LABORATORY' })
  @IsEnum(LaboratoriesType)
  type: LaboratoriesType;

  @ApiProperty({ description: 'lab code', example: '1' })
  @IsString()
  code: string;
  @ApiProperty({ description: 'lab address', example: 'tehran-somewhere' })
  @IsString()
  address: string;
  @ApiProperty({
    description: 'lab contact name',

    example: 'lab1 contact',
  })
  @IsString()
  contactName: string;
  @ApiProperty({
    description: 'lab phone number',
    example: '09121112030',
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: 'lab email',

    example: 'lab@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'lab fax',

    example: 'lab1 fax',
  })
  @IsString()
  fax?: string;

  @ApiProperty({
    description: 'id of account manager',

    example: '',
  })
  @IsUUID()
  accountManagerId: UUID;
}

export class UpdateFormalPaymentInfoDto extends LaboratoryIdDto {
  @ApiProperty({
    description: 'lab legal entity name',

    example: 'lab1 legal entity name',
  })
  @IsString()
  legalEntityName: string;

  @ApiProperty({
    description: 'lab economic number',

    example: '123456',
  })
  @IsString()
  economicNumber: string;

  @ApiProperty({
    description: 'lab national number',

    example: '987654321',
  })
  @IsString()
  nationalId: string;

  @ApiProperty({
    description: 'lab full address',

    example: 'somewhere-somewhere-somewhere',
  })
  @IsString()
  fullAddress: string;

  @ApiProperty({
    description: 'lab province',

    example: 'tehran',
  })
  @IsString()
  province: string;

  @ApiProperty({
    description: 'lab city',

    example: 'tehran',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'lab registration number',

    example: '111111',
  })
  @IsString()
  registrationNumber: string;

  @ApiProperty({
    description: 'lab postal code',

    example: '1111111',
  })
  @IsString()
  postalCode: string;
}
