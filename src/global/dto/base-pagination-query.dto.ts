import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class BasePaginationQueryDto {
  @ApiProperty({
    description: 'Page number (starts from 1)',
    example: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  page: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    default: 10,
    required: false,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  limit: number = 10;

  @ApiProperty({
    description: 'Field to sort by',
    example: 'createdAt',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  sortBy?: string;

  @ApiProperty({
    description: 'Sort order (ASC, DESC, or -1 for DESC)',
    example: 'ASC',
    enum: ['ASC', 'DESC', '-1', '1'],
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => {
    if (value === '-1') return 'DESC';
    if (value === '1' || value?.toUpperCase() === 'ASC') return 'ASC';
    return value?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  })
  sortOrder?: string;
}

