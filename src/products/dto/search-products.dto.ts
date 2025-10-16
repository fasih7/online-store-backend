import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class SearchProductsDto {
  @ApiProperty({
    description: 'Search term to look for in product title and description',
    example: 'laptop',
  })
  @IsNotEmpty()
  @IsString()
  searchTerm: string;

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  pageNumber?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 12,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  limit?: number = 12;

  @ApiProperty({
    description: 'Field to sort by',
    example: 'title',
    required: false,
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'title';

  @ApiProperty({
    description: 'Sort order (ASC or DESC)',
    example: 'ASC',
    required: false,
  })
  @IsOptional()
  @IsString()
  sortOrder?: string = 'ASC';

  @ApiProperty({
    description: 'Comma-separated category IDs to filter by',
    example: 'category1,category2',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;
}
