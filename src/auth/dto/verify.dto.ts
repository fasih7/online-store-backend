import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class VerifyUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(6)
  token: string;

  @ApiProperty()
  @IsEmail()
  @MaxLength(50)
  email: string;
}
