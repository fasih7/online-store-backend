import { Module } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductRepo } from './repo/product.repo';
import {
  FeaturedProduct,
  FeaturedProductSchema,
} from './schemas/featuredProduct.shema';
import { FeaturedProductsService } from './services/featured-products.service';
import { FeaturedProductsController } from './controllers/featured-products.controller';
import { FeaturedProductRepo } from './repo/featuredProduct.repo';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: FeaturedProduct.name, schema: FeaturedProductSchema },
    ]),
  ],
  controllers: [ProductsController, FeaturedProductsController],
  providers: [
    ProductsService,
    ProductRepo,
    FeaturedProductsService,
    FeaturedProductRepo,
  ],
})
export class ProductsModule {}
