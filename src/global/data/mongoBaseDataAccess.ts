import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Model, Query, Types } from 'mongoose';
import { GenObject } from '../types/shared-types';
import {
  FindOneResponse,
  MongoFindParams,
  MongoUpdateParams,
} from '../types/mongo.types';
import { getPaginationObject } from '../helpers/methods';

//TODO: Add a response with data and pagination
export class MongoBaseDataAccess {
  constructor(private readonly model: Model<any>) {}

  //TODO: furnish for create many
  async create(data: any) {
    try {
      const result = await this.model.create(data);
      return result;
    } catch (error) {
      if (error.code === 11000)
        throw new UnprocessableEntityException(
          `Data already exits, error details: ${error.message}`,
          '11000', //! ToDO: this needs to handle for all data
        );
      throw error;
    }
  }

  async findOne({
    query,
    selections,
  }: MongoFindParams): Promise<FindOneResponse> {
    return this.model.findOne(query, selections);
  }

  async findOneById(
    _id: string | Types.ObjectId,
    populateFields?: { path: string; select?: string }[],
  ): Promise<Record<string, any>> {
    try {
      const query = this.model.findById(_id);

      if (populateFields) {
        populateFields.forEach((field) => {
          query.populate(field.path, field.select);
        });
      }

      const response = await query.lean();

      if (!response)
        throw new NotFoundException({
          message: `Data not found with this id`,
        });
      return response;
    } catch (error) {
      if (error.kind === 'ObjectId')
        throw new UnprocessableEntityException({
          message: `Invalid ID or Data not found`,
          error,
        });

      throw error;
    }
  }

  //TODO: furnish
  async findMany(
    findQueryParams?: MongoFindParams,
    populate?: { isPopulate: boolean; field: string },
  ): Promise<Query<any[], any, {}, any, 'find'>> {
    const { query = {}, selections = [], options = {} } = findQueryParams || {};

    return this.model.find(query, selections, options);
  }

  async findOneAndUpdate({
    query: searchObject,
    updateData,
    options = {},
  }: MongoUpdateParams) {
    return await this.model.findOneAndUpdate(searchObject, updateData, options);
  }

  // async updateMany(searchObject: GenObject) {
  //   return await this.model.updateMany(searchObject);
  // }

  async findOneAndDelete(searchObject: GenObject) {
    return await this.model.findOneAndDelete(searchObject);
  }

  async DeleteMany(searchObject: Record<string, any>) {
    return await this.model.deleteMany(searchObject);
  }

  async getCount(query?: GenObject) {
    return await this.model.countDocuments(query);
  }
}
