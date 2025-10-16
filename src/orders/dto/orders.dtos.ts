import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, IsBoolean } from 'class-validator';

export class GetUserOrdersDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit = 10;

  @IsOptional()
  @IsBoolean()
  getOrderItems = false;
}
