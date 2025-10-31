import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
// import { OrderRepo } from './repos/order.mongo.repo';
import { OrderPostgresRepo } from './repos/order.postgres.repo';
import { EmailService } from 'src/notifications/services/email.service';
import { UserService } from 'src/user/user.service';
import { SuccessResponse } from 'src/global/consts';
import { Role } from 'src/global/enums';
import { Status } from 'src/user/utils/enums';
import { UserFromToken } from 'src/global/types/shared-types';
import { VerifyEmailDTO } from './dto/verify-email.dto';
import { getTokenValues } from '../auth/utils/helper-methods';
import { InjectRedis, type Redis } from '@nestjs-redis/client';
import { GetUserOrdersDto, GetAllOrdersDto } from './dto/orders.dtos';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus, Order } from './entities/order.entity';
import { PostgresPaginatedResponse } from 'src/global/types/postgres.types';
import { getPostgresPaginationObject } from 'src/global/helpers/methods';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly orderRepo: OrderPostgresRepo,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: UserFromToken) {
    let userId: string;
    let guestOrder = false;

    if (user) {
      userId = user.id;
    } else {
      let user = await this.userService.findOneByEmail(createOrderDto.email);

      if (!user) {
        const createUserParams = generateCreateUserParams(createOrderDto);

        user = await this.userService.create(createUserParams);
      }

      //TODO: Remove this after testing phases
      const redisToken = await this.redis.get(getTokenName(user.email));
      const token = process.env.NODE_ENV === 'local' ? '852000' : redisToken;
      if (createOrderDto.token !== token)
        throw new UnauthorizedException('Incorrect/Expired token');

      userId = user.id;
      guestOrder = true;
    }

    // Extract items from createOrderDto for PostgreSQL structure
    const { items, ...orderData } = createOrderDto;
    const createdOrder = await this.orderRepo.createOrderWithItems(
      {
        ...orderData,
        userId,
        guestOrder,
      },
      items,
    );
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
    this.redis.del(getTokenName(createOrderDto.email));
    return createdOrder;
    // return SuccessResponse;
  }

  async getAllOrders(query: GetAllOrdersDto): Promise<PostgresPaginatedResponse<Order>> {
    const { page = 1, limit = 10, variant } = query;
    // Ensure limit doesn't exceed 100
    const safeLimit = Math.min(limit, 100);
    const safePage = Math.max(page, 1);

    const { data, total } = await this.orderRepo.findAllWithPagination(
      safePage,
      safeLimit,
      variant,
    );

    const pagination = getPostgresPaginationObject(
      safePage,
      safeLimit,
      total,
    );

    return {
      data,
      pagination,
    };
  }

  async findOne(id: string, userId?: string) {
    const order = await this.orderRepo.findOrderWithItems(id, userId);
    return order;
  }

  async getOrdersForUser(
    userId: string,
    query: GetUserOrdersDto,
  ): Promise<PostgresPaginatedResponse<Order>> {
    const { page = 1, limit = 10, getOrderItems } = query;

    const safePage = Math.max(page, 1);
    const safeLimit = Math.min(limit, 100);

    const { data, total } = await this.orderRepo.findByUser(
      userId,
      safePage,
      safeLimit,
      getOrderItems,
    );

    const pagination = getPostgresPaginationObject(
      safePage,
      safeLimit,
      total,
    );

    return {
      data,
      pagination,
    };
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  async updateOrderStatus(
    orderId: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    const updatedOrder = await this.orderRepo.updateStatus(
      orderId,
      updateOrderStatusDto.status,
    );

    if (updatedOrder) {
      return SuccessResponse;
    }

    throw new NotFoundException('Failed to update order status');
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async verificationEmailForOrder(params: VerifyEmailDTO) {
    const existingTokenTime = await this.redis.ttl(getTokenName(params.email)); // Get token remaining time if token is present
    // converting token into number and check if 30 seconds has not been passed since generated
    if (+existingTokenTime > 150)
      throw new ForbiddenException(
        'You can only send new token after 30 seconds',
      );

    const token = getTokenValues();
    const user = await this.userService.findOneByEmail(params.email);
    if (user && user.status !== 'guest')
      throw new ForbiddenException(
        'User is already registered. Please sign in or use different email',
      );

    //TODO: Add template for email verification of orders
    // await this.emailService.sendMail(
    //   params.email,
    //   'Email Verification',
    //   './signup-verification.hbs',
    //   { token: token.value },
    // );

    await this.redis.set(getTokenName(params.email), token.value, { EX: 180 });

    return SuccessResponse;
  }

  async cacheTest(type: string) {
    let result: any;
    if (type === 'set')
      result = await this.redis.set('test', 'test value', { EX: 15 });
    if (type === 'get') result = await this.redis.get('test');
    if (type === 'del') result = await this.redis.del('test');
    if (type === 'ttl') result = await this.redis.ttl('test');

    // if (type === 'reset') result = await this.cacheManager.clear();
    return result;
  }
}

// Helper methods

function generateCreateUserParams(params: CreateOrderDto) {
  return {
    firstName: params.firstName,
    lastName: params.lastName,
    email: params.email,
    phone: params.phone,
    isGuest: true,
    role: Role.customer,
    status: Status.guest,
  };
}

function getTokenName(email: string) {
  return `${process.env.APP_PREFIX}:${email}:token`;
}
