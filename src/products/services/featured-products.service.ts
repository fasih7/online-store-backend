import { BadRequestException, Injectable } from '@nestjs/common';
// import { FeaturedProductRepo } from '../repo/featuredProduct.mongo.repo';
import { FeaturedProductPostgresRepo } from '../repo/featuredProduct.postgres.repo';

@Injectable()
export class FeaturedProductsService {
  constructor(private featuredProductRepo: FeaturedProductPostgresRepo) {}

  async getAllFeaturedProducts(userId?: string) {
    const featuredProducts =
      await this.featuredProductRepo.findAllWithProducts();
    return featuredProducts;
  }

  async updateFeaturedProducts({ toAddIds, toRemoveIds }, userId?: string) {
    // Get the first featured product collection (assuming one collection for now)
    const allFeatured = await this.featuredProductRepo.findAllWithProducts();
    let currentFeaturedProducts = allFeatured[0];

    if (!currentFeaturedProducts) {
      throw new BadRequestException(
        'User does not have any featured products.',
      );
    }

    console.log({ toRemoveIds });
    console.log('currentFeaturedProducts before: ', currentFeaturedProducts);

    // Remove products from featured collection
    if (toRemoveIds?.length) {
      await this.featuredProductRepo.removeProducts(
        currentFeaturedProducts.id,
        toRemoveIds,
      );
    }

    // Refresh the featured products after removal
    currentFeaturedProducts = await this.featuredProductRepo.findWithProducts(
      currentFeaturedProducts.id,
    );

    console.log('currentFeaturedProducts after: ', currentFeaturedProducts);

    // Ensure we can add the new products without exceeding the limit
    const availableSlots = 4 - currentFeaturedProducts.products.length;
    if (toAddIds && toAddIds.length > availableSlots) {
      throw new BadRequestException(
        `You can only add ${availableSlots} more featured products.`,
      );
    }

    // Add the new products to the featured list
    if (toAddIds?.length) {
      await this.featuredProductRepo.addProducts(
        currentFeaturedProducts.id,
        toAddIds,
      );
    }

    // Return updated featured products
    return await this.featuredProductRepo.findWithProducts(
      currentFeaturedProducts.id,
    );
  }

  //temp
  async createFeatureProduct(productIds: string[], userId?: string) {
    return await this.featuredProductRepo.createWithProducts(productIds);
  }
}
