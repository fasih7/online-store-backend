import { Model } from 'mongoose';
import { MongoBaseDataAccess } from '../data/mongoBaseDataAccess';
import { Options } from '../types/mongo.types';
import { getPaginationObject } from '../helpers/methods';
import { FindQueryParamsType } from '../types/shared-types';

export class IMongoRepoBase extends MongoBaseDataAccess {
  constructor(private model1: Model<any>) {
    super(model1);
  }

  async createQueryAndFindMany(
    findQueryParams?: FindQueryParamsType,
    getPagination = true,
  ) {
    let { pageNumber = 1, limit = 10 } =
      findQueryParams?.options?.pagination || {};
    let options: Options = { skip: 0, limit: 10 };

    if (findQueryParams?.options?.pagination)
      options = {
        skip: (pageNumber - 1) * limit,
        ...findQueryParams.options,
      };

    const { sortBy, sortOrder = 1 } = findQueryParams.options;
    sortBy && (options.sort = { [sortBy]: +sortOrder });

    const responsePromise = this.findMany({ ...findQueryParams, options });
    if (!getPagination) return await responsePromise;

    const countPromise = this.getCount();

    const [result, count] = await Promise.all([responsePromise, countPromise]);

    const pagination = getPaginationObject(pageNumber, options.limit, count);
    return {
      pagination,
      data: result,
    };
  }
}
