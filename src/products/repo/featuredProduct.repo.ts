import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMongoRepoBase } from '../../global/repo/mongo-repo-impl';
import { FeaturedProduct } from '../schemas/featuredProduct.shema';

@Injectable()
export class FeaturedProductRepo extends IMongoRepoBase {
  constructor(
    @InjectModel(FeaturedProduct.name)
    private featuredProductModel: Model<FeaturedProduct>,
  ) {
    super(featuredProductModel);
  }
}
