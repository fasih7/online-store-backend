import { Query } from 'mongoose';
import { GenObject } from './shared-types';

export type Options = {
  skip?: number;
  limit?: number;
  sort?: GenObject;
  selections?: string | string[];
  new?: boolean;
};

type MongoQueryObject = { options?: Options };

export type MongoFindParams = MongoQueryObject & {
  query?: GenObject;
  selections?: string[];
};
export type MongoUpdateParams = MongoQueryObject & {
  query: GenObject;
  updateData?: GenObject;
};

export type FindOneResponse = Query<any, any, {}, any, 'findOne'>;
