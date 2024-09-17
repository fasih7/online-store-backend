import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateFeaturedProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsOptional()
  toAddIds: Array<string>;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsOptional()
  toRemoveIds: Array<string>;
}
