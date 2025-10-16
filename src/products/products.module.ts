import { Module } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Product as MongoProduct,
  ProductSchema,
} from './schemas/product.schema';
import { ProductRepo } from './repo/product.mongo.repo';
import {
  FeaturedProduct as MongoFeaturedProduct,
  FeaturedProductSchema,
} from './schemas/featuredProduct.shema';
import { FeaturedProductsService } from './services/featured-products.service';
import { FeaturedProductsController } from './controllers/featured-products.controller';
import { FeaturedProductRepo } from './repo/featuredProduct.mongo.repo';
import { Product } from './entities/product.entity';
import { FeaturedProduct } from './entities/featured-product.entity';
import { ProductPostgresRepo } from './repo/product.postgres.repo';
import { FeaturedProductPostgresRepo } from './repo/featuredProduct.postgres.repo';

@Module({
  imports: [
    // MongooseModule.forFeature([
    //   { name: MongoProduct.name, schema: ProductSchema },
    //   { name: MongoFeaturedProduct.name, schema: FeaturedProductSchema },
    // ]),
    TypeOrmModule.forFeature([Product, FeaturedProduct]),
  ],
  controllers: [ProductsController, FeaturedProductsController],
  providers: [
    ProductsService,
    /* ProductRepo, */
    FeaturedProductsService,
    /* FeaturedProductRepo, */
    ProductPostgresRepo,
    FeaturedProductPostgresRepo,
  ],
})
export class ProductsModule {}
