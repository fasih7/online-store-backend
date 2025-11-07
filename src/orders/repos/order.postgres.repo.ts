import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { IPostgresRepoBase } from '../../global/repo/postgres-repo-impl';
import { User } from '../../user/entities/user.entity';
import { OrderVariant } from '../dto/orders.dtos';
import { Product } from '../../products/entities/product.entity';

@Injectable()
export class OrderPostgresRepo extends IPostgresRepoBase<Order> {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {
    super(orderRepository);
  }

  async createOrderWithItems(
    orderData: Partial<Order>,
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>,
  ): Promise<Order> {
    // Start a transaction
    return await this.repository.manager.transaction(async (manager) => {
      // Create the order
      const order = manager.create(Order, orderData);
      const savedOrder = await manager.save(order);

      // Create order items
      const orderItems = items.map((item) =>
        manager.create(OrderItem, {
          ...item,
          orderId: savedOrder.id,
        }),
      );
      await manager.save(OrderItem, orderItems);

      // Deduct quantities from products
      for (const item of items) {
        await manager.decrement(
          Product,
          { id: item.productId },
          'quantity',
          item.quantity,
        );
      }

      // Return order with items
      return await manager.findOne(Order, {
        where: { id: savedOrder.id },
        relations: ['items', 'items.product', 'user'],
      });
    });
  }

  async findOrderWithItems(orderId: string, userId?: string): Promise<Order> {
    const relations = ['items', 'items.product'];
    const where: any = { id: orderId };
    if (userId) {
      where.userId = userId;
    }
    const order = await this.findOne({
      where,
      relations,
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async findByUser(
    userId: string,
    page = 1,
    limit = 10,
    getOrderItems = false,
  ): Promise<{ data: Order[]; total: number }> {
    const relations = getOrderItems ? ['items', 'items.product'] : [];
    const [data, total] = await this.orderRepository.findAndCount({
      where: { userId },
      relations,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }

  async findAllWithPagination(
    page = 1,
    limit = 10,
    variant: OrderVariant = OrderVariant.COMPLETE,
    sortBy?: string,
    sortOrder?: string,
    status?: OrderStatus,
  ): Promise<{ data: Order[] | any[]; total: number }> {
    // Default sorting values
    const defaultSortBy = sortBy || 'createdAt';
    const defaultSortOrder =
      sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    if (variant === OrderVariant.MINIMAL) {
      // Use QueryBuilder for minimal variant to select specific fields and compute name
      const queryBuilder = this.orderRepository
        .createQueryBuilder('order')
        .select('order.id', 'id')
        .addSelect("CONCAT(order.firstName, ' ', order.lastName)", 'name')
        .addSelect('order.email', 'email')
        .addSelect('order.phone', 'phone')
        .addSelect('order.status', 'status')
        .addSelect('order.totalPrice', 'totalPrice');

      // Apply status filter if provided
      if (status) {
        queryBuilder.andWhere('order.status = :status', { status });
      }

      // Apply sorting
      queryBuilder.orderBy(`order.${defaultSortBy}`, defaultSortOrder);

      // Apply pagination
      queryBuilder.skip((page - 1) * limit).take(limit);

      // Create separate query for count
      const countQueryBuilder =
        this.orderRepository.createQueryBuilder('order');

      // Apply status filter to count query if provided
      if (status) {
        countQueryBuilder.andWhere('order.status = :status', { status });
      }

      const [data, total] = await Promise.all([
        queryBuilder.getRawMany(),
        countQueryBuilder.getCount(),
      ]);

      return { data, total };
    } else {
      // Complete variant - return all fields with relations
      const where: any = {};
      if (status) {
        where.status = status;
      }

      const order: any = {};
      order[defaultSortBy] = defaultSortOrder;

      const [data, total] = await this.orderRepository.findAndCount({
        where,
        relations: ['items', 'items.product'],
        order,
        skip: (page - 1) * limit,
        take: limit,
      });

      return { data, total };
    }
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    return await this.findMany({
      where: { status },
      relations: ['items', 'items.product', 'user'],
    });
  }

  async updateStatus(orderId: string, status: OrderStatus): Promise<Order> {
    await this.updateOneById(orderId, { status });
    return await this.findOrderWithItems(orderId);
  }

  async getOrderStats() {
    return await this.repository
      .createQueryBuilder('order')
      .select('order.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(order.totalPrice)', 'totalValue')
      .groupBy('order.status')
      .getRawMany();
  }

  async findGuestOrders(): Promise<Order[]> {
    return await this.findMany({
      where: { guestOrder: true },
      relations: ['items', 'items.product'],
    });
  }

  async findHighValueOrders(minValue: number): Promise<Order[]> {
    return await this.repository
      .createQueryBuilder('order')
      .where('order.totalPrice >= :minValue', { minValue })
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .leftJoinAndSelect('order.user', 'user')
      .getMany();
  }

  async searchOrdersWithPagination(
    searchQuery: string,
    options?: {
      pageNumber?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: string;
      status?: OrderStatus;
      relations?: string[];
    },
  ): Promise<Order[]> {
    const {
      pageNumber = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'ASC',
      status,
      relations = [],
    } = options || {};
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .where(
        'order.firstName ILIKE :searchQuery OR order.lastName ILIKE :searchQuery OR order.email ILIKE :searchQuery OR order.phone ILIKE :searchQuery',
        { searchQuery: `%${searchQuery}%` },
      );
    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }
    if (relations.includes('items')) {
      queryBuilder.leftJoinAndSelect('order.items', 'items');
    }
    if (relations.includes('items.product')) {
      queryBuilder.leftJoinAndSelect('items.product', 'product');
    }
    if (relations.includes('user')) {
      queryBuilder.leftJoinAndSelect('order.user', 'user');
    }
    queryBuilder.orderBy(`order.${sortBy}`, sortOrder as 'ASC' | 'DESC');
    queryBuilder.skip((pageNumber - 1) * limit).take(limit);
    return await queryBuilder.getMany();
  }
}
