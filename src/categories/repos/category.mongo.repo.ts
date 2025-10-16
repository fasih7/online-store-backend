import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMongoRepoBase } from 'src/global/repo/mongo-repo-impl';
import { Category } from '../schemas/category.schema';

@Injectable()
export class CategoryRepo extends IMongoRepoBase {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {
    super(categoryModel);
  }
}
