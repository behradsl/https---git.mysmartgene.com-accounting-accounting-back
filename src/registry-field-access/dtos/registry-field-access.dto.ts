import { ApiProperty } from '@nestjs/swagger';
import { AccessType, Position } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsString, IsUUID, ValidateNested } from 'class-validator';

export class RegistryFieldAccessIdDto {
  @ApiProperty({ example: '' })
  @IsUUID()
  id: string;
}

export class RegistryFieldAccessFindByPositionNameDto {
  @ApiProperty({ example: Position.FINANCE_MANAGER })
  @IsEnum(Position)
  position: Position;
}

export class CreateRegistryFieldAccessDto {
  @ApiProperty({ example: 'FINANCE_MANAGER' })
  @IsEnum(Position)
  position: Position;

  @ApiProperty({ example: 'MotId' })
  @IsString()
  registryField: string;

  @ApiProperty({ example: 'VISIBLE' })
  @IsEnum(AccessType)
  access: AccessType;
}

export class CreateRegistryFieldAccessArrayDto {
  @ApiProperty({ type: [CreateRegistryFieldAccessDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRegistryFieldAccessDto)
  registryFieldAccesses: CreateRegistryFieldAccessDto[];
}

export class UpdateRegistryFieldAccessDto extends RegistryFieldAccessIdDto {
  @ApiProperty({ example: 'FINANCE_MANAGER' })
  @IsEnum(Position)
  position: Position;

  @ApiProperty({ example: 'MotId' })
  @IsString()
  registryField: string;

  @ApiProperty({ example: 'VISIBLE' })
  @IsEnum(AccessType)
  access: AccessType;
}

export class RegistryFieldAccessPosition {
  position: Position;
}
