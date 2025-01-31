import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthSigninDto {
  @IsString()
  @ApiProperty({
    example: 'example@example.com  or 09121111111',
    default: '',
    type: 'string',
  })
  username: string;

  @IsString()
  @ApiProperty({
    example: '12345678',
    default: '',
    type: 'string',
  })
  password: string;
}


