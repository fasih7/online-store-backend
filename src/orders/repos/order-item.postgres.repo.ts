import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from '../entities/order-item.entity';
import { PostgresBaseDataAccess } from '../../global/data/postgresBaseDataAccess';

@Injectable()
export class OrderItemPostgresRepo extends PostgresBaseDataAccess<OrderItem> {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {
    super(orderItemRepository);
  }

  /**
   * Find order items by order ID
   */
  async findByOrderId(orderId: string): Promise<OrderItem[]> {
    return await this.findMany({
      where: { orderId },
      relations: ['product', 'product.category'],
    });
  }

  /**
   * Find order items by product ID
   */
  async findByProductId(productId: string): Promise<OrderItem[]> {
    return await this.findMany({
      where: { productId },
      relations: ['order', 'order.user'],
    });
  }

  /**
   * Get total quantity sold for a product
   */
  async getTotalQuantitySold(productId: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('orderItem')
      .select('SUM(orderItem.quantity)', 'totalQuantity')
      .where('orderItem.productId = :productId', { productId })
      .getRawOne();

    return parseInt(result.totalQuantity) || 0;
  }

  /**
   * Get best selling products
   */
  async getBestSellingProducts(limit: number = 10): Promise<any[]> {
    return await this.repository
      .createQueryBuilder('orderItem')
      .leftJoinAndSelect('orderItem.product', 'product')
      .leftJoinAndSelect('product.category', 'category')
      .select([
        'product.id',
        'product.title',
        'product.price',
        'product.primaryImage',
        'category.name',
      ])
      .addSelect('SUM(orderItem.quantity)', 'totalSold')
      .addSelect('COUNT(orderItem.id)', 'orderCount')
      .groupBy('product.id')
      .addGroupBy('category.id')
      .orderBy('totalSold', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  /**
   * Get revenue by product
   */
  async getRevenueByProduct(productId: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('orderItem')
      .select('SUM(orderItem.price * orderItem.quantity)', 'totalRevenue')
      .where('orderItem.productId = :productId', { productId })
      .getRawOne();

    return parseFloat(result.totalRevenue) || 0;
  }

  /**
   * Get order items with total value above threshold
   */
  async findHighValueItems(minValue: number): Promise<OrderItem[]> {
    return await this.repository
      .createQueryBuilder('orderItem')
      .where('(orderItem.price * orderItem.quantity) >= :minValue', {
        minValue,
      })
      .leftJoinAndSelect('orderItem.product', 'product')
      .leftJoinAndSelect('orderItem.order', 'order')
      .getMany();
  }
}
