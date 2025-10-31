import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BasePaginationQueryDto } from 'src/global/dto/base-pagination-query.dto';

export class GetManyProductsQuery extends BasePaginationQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  searchQuery?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  relations?: string; // comma separated relations like 'category,user'
}
