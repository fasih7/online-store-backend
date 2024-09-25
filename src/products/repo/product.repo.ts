import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../schemas/product.schema';
import { IMongoRepoBase } from '../../global/repo/mongo-repo-impl';

@Injectable()
export class ProductRepo extends IMongoRepoBase {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {
    super(productModel);
  }
}
