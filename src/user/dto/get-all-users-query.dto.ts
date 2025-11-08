import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BasePaginationQueryDto } from 'src/global/dto/base-pagination-query.dto';

export class GetAllUsersQueryDto extends BasePaginationQueryDto {
  @ApiProperty({
    description: 'Filter by role',
    example: 'admin',
    required: false,
  })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiProperty({
    description: 'Filter by status',
    example: 'active',
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    description: 'Filter by search query',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  searchQuery?: string;
}
