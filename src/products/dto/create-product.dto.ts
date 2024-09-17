import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(5000)
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1000000)
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1000000)
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  primaryImage: string;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsOptional()
  images: string[];
}
