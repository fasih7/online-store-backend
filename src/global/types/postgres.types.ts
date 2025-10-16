import {
  FindManyOptions,
  FindOneOptions,
  UpdateResult,
  DeleteResult,
} from 'typeorm';
import { GenObject } from './shared-types';

export type PostgresOptions = {
  skip?: number;
  take?: number; // PostgreSQL equivalent of limit
  order?: GenObject;
  select?: string[] | GenObject;
  relations?: string[] | GenObject;
};

type PostgresQueryObject = {
  options?: PostgresOptions;
  relations?: string[] | GenObject;
};

export type PostgresFindParams = PostgresQueryObject & {
  where?: GenObject | GenObject[];
  select?: string[] | GenObject;
};

export type PostgresUpdateParams = PostgresQueryObject & {
  where: GenObject | GenObject[];
  updateData: GenObject;
};

export type PostgresFindOneParams = {
  where?: GenObject | GenObject[];
  relations?: string[] | GenObject;
  select?: string[] | GenObject;
};

export type PostgresFindResponse<T = any> = T[];
export type PostgresFindOneResponse<T = any> = T | null;
export type PostgresUpdateResponse = UpdateResult;
export type PostgresDeleteResponse = DeleteResult;

// Pagination specific types
export type PostgresPaginationOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
};

export type PostgresPaginatedResponse<T = any> = {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};
