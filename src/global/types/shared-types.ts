import { MongoFindParams, Options } from './mongo.types';

export type GenObject = Record<string, any>;

export type FindQueryParamsType = MongoFindParams & {
  options?: {
    pagination?: { pageNumber: number; limit: number };
    sortBy: string;
    sortOrder: string;
    selections?: string | string[];
    new?: boolean;
  };
};
