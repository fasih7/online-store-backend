import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { IPostgresRepoBase } from '../../global/repo/postgres-repo-impl';

@Injectable()
export class ProductPostgresRepo extends IPostgresRepoBase<Product> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {
    super(productRepository);
  }

  /**
   * Find products by category
   */
  async findByCategory(categoryId: string): Promise<Product[]> {
    return await this.findMany({
      where: { categoryId },
      relations: ['category', 'user'],
    });
  }

  /**
   * Find products by user
   */
  async findByUser(userId: string): Promise<Product[]> {
    return await this.findMany({
      where: { userId },
      relations: ['category'],
    });
  }

  /**
   * Find product with all relations
   */
  async findWithRelations(productId: string): Promise<Product | null> {
    return await this.findOneById(productId, [
      'category',
      'user',
      'orderItems',
    ]);
  }

  /**
   * Search products by title or description
   */
  async searchProducts(searchTerm: string): Promise<Product[]> {
    return await this.findMany({
      where: [{ title: `%${searchTerm}%` }, { description: `%${searchTerm}%` }],
      relations: ['category'],
    });
  }

  // Search products Version 2 by title or description with pagination and filtering
  async searchProductsV2(
    searchQuery: string,
    options?: {
      pageNumber?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: string;
      categoryIds?: string[];
      relations?: string[];
    },
  ): Promise<{ data: Product[]; total: number }> {
    const {
      pageNumber = 1,
      limit = 12,
      sortBy = 'title',
      sortOrder = 'ASC',
      categoryIds,
      relations = [],
    } = options || {};

    const queryBuilder = this.repository
      .createQueryBuilder('product')
      .where(
        '(product.title ILIKE :searchQuery OR product.description ILIKE :searchQuery)',
        { searchQuery: `%${searchQuery}%` },
      );

    // Conditionally join relations
    const requestedRelations = Array.isArray(relations) ? relations : [];

    if (requestedRelations.includes('category')) {
      queryBuilder.leftJoinAndSelect('product.category', 'category');
    }

    if (requestedRelations.includes('user')) {
      queryBuilder.leftJoinAndSelect('product.user', 'user');
    }

    if (requestedRelations.includes('orderItems')) {
      queryBuilder.leftJoinAndSelect('product.orderItems', 'orderItems');
    }

    // Add category filter if provided
    if (categoryIds && categoryIds.length > 0) {
      queryBuilder.andWhere('product.categoryId IN (:...categoryIds)', {
        categoryIds,
      });
    }

    // Add sorting
    const sortDirection = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    queryBuilder.orderBy(`product.${sortBy}`, sortDirection);

    // Add pagination
    const offset = (pageNumber - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    // Get total count for pagination
    const totalQueryBuilder = this.repository
      .createQueryBuilder('product')
      .where(
        '(product.title ILIKE :searchQuery OR product.description ILIKE :searchQuery)',
        { searchQuery: `%${searchQuery}%` },
      );

    if (categoryIds && categoryIds.length > 0) {
      totalQueryBuilder.andWhere('product.categoryId IN (:...categoryIds)', {
        categoryIds,
      });
    }

    const [products, total] = await Promise.all([
      queryBuilder.getMany(),
      totalQueryBuilder.getCount(),
    ]);

    return { data: products, total };
  }
  /**
   * Find products by price range
   */
  async findByPriceRange(
    minPrice: number,
    maxPrice: number,
  ): Promise<Product[]> {
    return await this.repository
      .createQueryBuilder('product')
      .where('product.price >= :minPrice', { minPrice })
      .andWhere('product.price <= :maxPrice', { maxPrice })
      .leftJoinAndSelect('product.category', 'category')
      .getMany();
  }

  /**
   * Get featured products (products that are in featured collections)
   */
  async getFeaturedProducts(): Promise<Product[]> {
    return await this.repository
      .createQueryBuilder('product')
      .innerJoin('featured_product_items', 'fpi', 'fpi.productId = product.id')
      .leftJoinAndSelect('product.category', 'category')
      .getMany();
  }
}
