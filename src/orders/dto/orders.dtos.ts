import { IsOptional, IsBoolean, IsEnum, IsString } from 'class-validator';
import { BasePaginationQueryDto } from 'src/global/dto/base-pagination-query.dto';
import { OrderStatus } from '../entities/order.entity';

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

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  searchQuery?: string;
}
