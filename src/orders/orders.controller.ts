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
import { AdminAuthGuard, JwtAuthGuard } from '../auth/gaurds/auth.gaurd';
import { GetUserOrdersDto, GetAllOrdersDto } from './dto/orders.dtos';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

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

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyOrders(@Req() req: any, @Query() query: GetUserOrdersDto) {
    const userId = req.user.id;
    return this.ordersService.getOrdersForUser(userId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;
    return this.ordersService.findOne(id, userId);
  }

  @UseGuards(AdminAuthGuard)
  @Get('admin/order/:id')
  findOneAdmin(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @UseGuards(AdminAuthGuard)
  @Get('')
  getAllOrders(@Query() query: GetAllOrdersDto) {
    return this.ordersService.getAllOrders(query);
  }

  @Patch(':id/status')
  @UseGuards(AdminAuthGuard)
  updateOrderStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(id, updateOrderStatusDto);
  }

  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
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
