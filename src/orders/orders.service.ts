import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepo } from './repos/order.repo';
import { EmailService } from 'src/notifications/services/email.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepo: OrderRepo,
    private readonly emailService: EmailService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const createdOrder = await this.orderRepo.create(createOrderDto);
    // await this.emailService.sendMail(
    //   createOrderDto.email,
    //   'Order Confirmation',
    //   './order-confirmation.hbs',
    //   {
    //     customerName: 'John Doe',
    //     orderNumber: 'ORD-12345',
    //     orderDate: '2025-06-09',
    //     orderTotal: '$129.99',
    //     year: '2025',
    //     items: [
    //       { name: 'Wireless Headphones', quantity: 1, price: '$89.99' },
    //       { name: 'USB-C Charger', quantity: 2, price: '$20.00' },
    //     ],
    //   },
    // );
    return createdOrder;
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
