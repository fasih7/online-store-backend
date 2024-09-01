import { UnprocessableEntityException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { GenObject } from '../types';

export class MongoBaseRepo {
  constructor(private model: Model<any>) {}

  //TODO: furnish for create many
  async create(data: any) {
    try {
      const result = await this.model.create(data);
      return result;
    } catch (error) {
      if (error.code === 11000)
        throw new UnprocessableEntityException(
          'User with this email already exists',
        );
      throw error;
    }
  }

  async findOne(data: Record<string, any>) {
    return await this.model.findOne(data);
  }

  async findOneById(_id: string | Types.ObjectId) {
    return await this.model.findById(_id);
  }

  //TODO: furnish
  async findMany(data: any) {
    return await this.model.find(data);
  }

  async findOneAndUpdate(searchObject: GenObject, updateData: any, options?: GenObject) {
    return await this.model.findOneAndUpdate(searchObject, updateData, options);
  }

  async updateMany(searchObject: GenObject) {
    return await this.model.updateMany(searchObject);
  }

  async findOneAndDelete(searchObject: GenObject) {
    return await this.model.findOneAndDelete(searchObject);
  }

  async DeleteMany(searchObject: Record<string, any>) {
    return await this.model.deleteMany(searchObject);
  }
}
