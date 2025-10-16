import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsEnum,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '../entities/order.entity';

// enum PaymentType {
//   CASH = 'cash',
//   // Add other payment types later, e.g. CARD = 'card', PAYPAL = 'paypal'
// }

class CartItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  token: string;

  @ApiProperty()
  @IsPhoneNumber(null)
  phone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  province: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  zip: string;

  @ApiProperty()
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];

  @ApiProperty()
  @IsNumber()
  totalPrice: number;
}
