import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class AuthSigninDto {
  @IsString()
  @ApiProperty({
    example: 'admin@something.com',
    default: '',
    type: 'string',
  })
  username: string;

  @IsString()
  @ApiProperty({
    example: '123456',
    default: '',
    type: 'string',
  })
  password: string;

  @IsBoolean()
  @ApiProperty({
    example: 'true',
    default: '',
    type: 'boolean',
  })
  rememberMe: boolean;
}
