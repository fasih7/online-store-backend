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

export type UserFromToken = {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}; //payload: { sub: user._id, email: user.email, role: user.role }
