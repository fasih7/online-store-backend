import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OptionalJwtAuthGuard } from 'src/auth/gaurds/optional-jwt.gaurd';
import { VerifyEmailDTO } from './dto/verify-email.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/gaurds/auth.gaurd';
import { GetUserOrdersDto } from './dto/orders.dtos';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  //TODO: Total price should be calculated on BE again
  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.ordersService.create(createOrderDto, req.user);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyOrders(@Req() req: any, @Query() query: GetUserOrdersDto) {
    const userId = req.user.id;
    return this.ordersService.getOrdersForUser(userId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }

  @Post('verification-email-for-order')
  verificationEmailForOrder(@Body() verifyEmailDTO: VerifyEmailDTO) {
    return this.ordersService.verificationEmailForOrder(verifyEmailDTO);
  }

  @Get('cache-test/alt')
  cacheTest(@Query() query: { type: string }) {
    return this.ordersService.cacheTest(query.type);
  }
}
