import { ApiProperty } from '@nestjs/swagger';
import { AccessType, Position } from '@prisma/client';
import { IsArray, IsEnum, IsString, IsUUID } from 'class-validator';

export class RegistryFieldAccessIdDto {
  @ApiProperty({ example: '' })
  @IsUUID()
  id: string;
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
