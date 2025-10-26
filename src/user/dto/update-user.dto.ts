import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  @MinLength(2)
  @MaxLength(100)
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  phone: string;
}
