import { IsString, IsEmail, IsEnum, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Position } from '@prisma/client';

export class UserIdDto {
  @ApiProperty({ description: 'id of user', example: '' })
  id: string;
}

export class CreateUserDto {
  @ApiProperty({
    description: 'Name of the user',
    minLength: 1,
    maxLength: 255,
    example: 'John Doe',
  })
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'johndoe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password for the user account',
    minLength: 4,
    maxLength: 50,
    example: 'securePassword123',
  })
  @IsString()
  @Length(4, 50)
  password: string;

  @ApiProperty({
    description: 'Phone number of the user',
    minLength: 7,
    maxLength: 15,
    example: '09123456789',
  })
  @IsString()
  @Length(7, 15)
  phoneNumber: string;

  @ApiProperty({
    description: 'Position of the user',
    enum: Position,
    example: Position.ADMIN,
  })
  @IsEnum(Position)
  Position: Position;
}

export class UpdateUserDto extends UserIdDto {
  @ApiProperty({
    description: 'Name of the user',
    minLength: 1,
    maxLength: 255,
    example: 'John Doe',
  })
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'johndoe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password for the user account',
    minLength: 4,
    maxLength: 50,
    example: 'securePassword123',
  })
  @IsString()
  @Length(4, 50)
  password: string;

  @ApiProperty({
    description: 'Phone number of the user',
    minLength: 7,
    maxLength: 15,
    example: '09123456789',
  })
  @IsString()
  @Length(7, 15)
  phoneNumber: string;

  @ApiProperty({
    description: 'Position of the user',
    enum: Position,
    example: Position.ADMIN,
  })
  @IsEnum(Position)
  Position: Position;
}

export class UserFindDto {
  @ApiProperty({
    description: 'Name of the user',
    minLength: 1,
    maxLength: 100,
    example: 'John Doe',
  })
  @IsString()
  @Length(1, 100)
  name?: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'johndoe@example.com',
  })
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Phone number of the user',
    minLength: 7,
    maxLength: 15,
    example: '1234567890',
  })
  @IsString()
  @Length(7, 15)
  phoneNumber?: string;
}
