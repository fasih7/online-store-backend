import { BadRequestException, Injectable } from '@nestjs/common';
import { FeaturedProductRepo } from '../repo/featuredProduct.repo';

@Injectable()
export class FeaturedProductsService {
  constructor(private featuredProductRepo: FeaturedProductRepo) {}

  async getAllFeaturedProducts(userId?: string) {
    const result = this.featuredProductRepo.findOne(
      {} /*{ query: { userId } }*/,
    );
    return (await result).populate('products');
  }

  async updateFeaturedProducts({ toAddIds, toRemoveIds }, userId?: string) {
    const currentFeaturedProducts = await this.featuredProductRepo.findOne(
      {} /*{ query: { userId } }*/,
    );

    if (!currentFeaturedProducts) {
      throw new BadRequestException(
        'User does not have any featured products.',
      );
    }

    console.log({ toRemoveIds });

    console.log('currentFeaturedProducts before: ', currentFeaturedProducts);

    // Remove products that are in the toRemoveIds array
    toRemoveIds &&
      (currentFeaturedProducts.products =
        currentFeaturedProducts.products.filter(
          (productId: string) => !toRemoveIds.includes(productId.toString()),
        ));

    console.log('currentFeaturedProducts after: ', currentFeaturedProducts);
    // Ensure we can add the new products without exceeding the limit
    const availableSlots = 4 - currentFeaturedProducts.products.length;
    if (toAddIds && toAddIds.length > availableSlots) {
      throw new BadRequestException(
        `You can only add ${availableSlots} more featured products.`,
      );
    }

    // Add the new products to the featured list
    toAddIds && currentFeaturedProducts.products.push(...toAddIds);

    return await currentFeaturedProducts.save();
  }

  //temp
  async createFeatureProduct(product: string, userId?: string) {
    return await this.featuredProductRepo.create({
      userId,
      products: [product],
    });
  }
}
