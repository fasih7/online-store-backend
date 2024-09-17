import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../../global/enums';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @MinLength(2)
  @MaxLength(50)
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(11)
  @MaxLength(13)
  //TODO: will not be optional after initial development
  @IsOptional()  //! import to remove this
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  password: string;
}
