import { MongoFindParams, Options } from './mongo.types';
import { PostgresFindParams, PostgresOptions } from './postgres.types';

export type GenObject = Record<string, any>;

// Base query params type that can work with both MongoDB and PostgreSQL
export type BaseQueryParamsType = {
  query?: GenObject | GenObject[]; // Support both single object and array for PostgreSQL
  options?: {
    pagination?: { pageNumber: number; limit: number };
    sortBy?: string;
    sortOrder?: string | 'ASC' | 'DESC'; // Support both MongoDB (1/-1) and PostgreSQL (ASC/DESC)
    selections?: string | string[];
    new?: boolean;
  };
};

// MongoDB specific query params (backward compatibility)
export type FindQueryParamsType = MongoFindParams & {
  options?: {
    pagination?: { pageNumber: number; limit: number };
    sortBy: string;
    sortOrder: string;
    selections?: string | string[];
    new?: boolean;
  };
};

// PostgreSQL specific query params
export type PostgresQueryParamsType = PostgresFindParams & {
  options?: {
    pagination?: { pageNumber: number; limit: number };
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    selections?: string | string[];
    relations?: string[] | GenObject;
  };
};

// Union type for database-agnostic operations
export type UniversalQueryParamsType = BaseQueryParamsType & {
  where?: GenObject | GenObject[]; // PostgreSQL style
  relations?: string[] | GenObject; // PostgreSQL relations
};

export type UserFromToken = {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}; //payload: { sub: user._id, email: user.email, role: user.role }
