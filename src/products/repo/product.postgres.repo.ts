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
    },
  ): Promise<Product[]> {
    const {
      pageNumber = 1,
      limit = 12,
      sortBy = 'title',
      sortOrder = 'ASC',
      categoryIds,
    } = options || {};

    const queryBuilder = this.repository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where(
        '(product.title ILIKE :searchQuery OR product.description ILIKE :searchQuery)',
        { searchQuery: `%${searchQuery}%` },
      );

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
    // const totalQueryBuilder = this.repository
    //   .createQueryBuilder('product')
    //   .where(
    //     '(product.title ILIKE :searchTerm OR product.description ILIKE :searchTerm)',
    //     { searchTerm: `%${searchTerm}%` },
    //   );

    // if (categoryIds && categoryIds.length > 0) {
    //   totalQueryBuilder.andWhere('product.categoryId IN (:...categoryIds)', {
    //     categoryIds,
    //   });
    // }

    const [products /*total*/] = await Promise.all([
      queryBuilder.getMany(),
      // totalQueryBuilder.getCount(),
    ]);

    return products;
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
