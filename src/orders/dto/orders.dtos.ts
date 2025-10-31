import {
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { BasePaginationQueryDto } from 'src/global/dto/base-pagination-query.dto';

export enum OrderVariant {
  MINIMAL = 'minimal',
  COMPLETE = 'complete',
}

export class GetUserOrdersDto extends BasePaginationQueryDto {
  @IsOptional()
  @IsBoolean()
  getOrderItems = false;
}

export class GetAllOrdersDto extends BasePaginationQueryDto {
  @IsOptional()
  @IsEnum(OrderVariant)
  variant: OrderVariant = OrderVariant.COMPLETE;
}
