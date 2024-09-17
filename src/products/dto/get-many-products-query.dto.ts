import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class GetManyProductsQuery {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  pageNumber: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  limit: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  sortBy: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  sortOrder: string;
}
