import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeaturedProduct } from '../entities/featured-product.entity';
import { Product } from '../entities/product.entity';
import { IPostgresRepoBase } from '../../global/repo/postgres-repo-impl';

@Injectable()
export class FeaturedProductPostgresRepo extends IPostgresRepoBase<FeaturedProduct> {
  constructor(
    @InjectRepository(FeaturedProduct)
    private readonly featuredProductRepository: Repository<FeaturedProduct>,
  ) {
    super(featuredProductRepository);
  }

  /**
   * Create featured product collection with products
   */
  async createWithProducts(productIds: string[]): Promise<FeaturedProduct> {
    return await this.repository.manager.transaction(async (manager) => {
      // Create featured product collection
      const featuredProduct = manager.create(FeaturedProduct, {});
      const savedFeaturedProduct = await manager.save(featuredProduct);

      // Get products and associate them
      const products = await manager.findByIds(Product, productIds);
      savedFeaturedProduct.products = products;

      return await manager.save(savedFeaturedProduct);
    });
  }

  /**
   * Find featured product with all products
   */
  async findWithProducts(
    featuredProductId: string,
  ): Promise<FeaturedProduct | null> {
    return await this.findOneById(featuredProductId, [
      'products',
      'products.category',
    ]);
  }

  /**
   * Get all featured products with their products
   */
  async findAllWithProducts(): Promise<FeaturedProduct[]> {
    return await this.findMany({
      relations: ['products', 'products.category'],
    });
  }

  /**
   * Add products to featured collection
   */
  async addProducts(
    featuredProductId: string,
    productIds: string[],
  ): Promise<FeaturedProduct> {
    return await this.repository.manager.transaction(async (manager) => {
      const featuredProduct = await manager.findOne(FeaturedProduct, {
        where: { id: featuredProductId },
        relations: ['products'],
      });

      if (!featuredProduct) {
        throw new Error('Featured product collection not found');
      }

      const newProducts = await manager.findByIds(Product, productIds);
      const existingProductIds = featuredProduct.products.map((p) => p.id);

      // Add only new products (avoid duplicates)
      const productsToAdd = newProducts.filter(
        (p) => !existingProductIds.includes(p.id),
      );
      featuredProduct.products = [
        ...featuredProduct.products,
        ...productsToAdd,
      ];

      return await manager.save(featuredProduct);
    });
  }

  /**
   * Remove products from featured collection
   */
  async removeProducts(
    featuredProductId: string,
    productIds: string[],
  ): Promise<FeaturedProduct> {
    return await this.repository.manager.transaction(async (manager) => {
      const featuredProduct = await manager.findOne(FeaturedProduct, {
        where: { id: featuredProductId },
        relations: ['products'],
      });

      if (!featuredProduct) {
        throw new Error('Featured product collection not found');
      }

      // Remove specified products
      featuredProduct.products = featuredProduct.products.filter(
        (p) => !productIds.includes(p.id),
      );

      return await manager.save(featuredProduct);
    });
  }

  /**
   * Get latest featured products
   */
  async getLatestFeaturedProducts(limit: number = 10): Promise<Product[]> {
    return await this.repository
      .createQueryBuilder('featuredProduct')
      .innerJoinAndSelect('featuredProduct.products', 'products')
      .leftJoinAndSelect('products.category', 'category')
      .orderBy('featuredProduct.createdAt', 'DESC')
      .limit(limit)
      .getMany()
      .then((featured) => featured.flatMap((f) => f.products));
  }

  /**
   * Check if product is featured
   */
  async isProductFeatured(productId: string): Promise<boolean> {
    const count = await this.repository
      .createQueryBuilder('featuredProduct')
      .innerJoin('featuredProduct.products', 'products')
      .where('products.id = :productId', { productId })
      .getCount();

    return count > 0;
  }
}
