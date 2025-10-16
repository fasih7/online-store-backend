import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { IPostgresRepoBase } from '../../global/repo/postgres-repo-impl';

@Injectable()
export class OrderPostgresRepo extends IPostgresRepoBase<Order> {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
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

      // Return order with items
      return await manager.findOne(Order, {
        where: { id: savedOrder.id },
        relations: ['items', 'items.product', 'user'],
      });
    });
  }

  async findOrderWithItems(orderId: string): Promise<Order | null> {
    return await this.findOneById(orderId, ['items', 'items.product', 'user']);
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
}
