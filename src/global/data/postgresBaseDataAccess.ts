import {
  NotFoundException,
  UnprocessableEntityException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  Repository,
  FindManyOptions,
  FindOneOptions,
  UpdateResult,
  DeleteResult,
} from 'typeorm';
import { GenObject } from '../types/shared-types';
import {
  PostgresFindParams,
  PostgresUpdateParams,
  PostgresFindOneParams,
  PostgresFindResponse,
  PostgresFindOneResponse,
  PostgresUpdateResponse,
  PostgresDeleteResponse,
} from '../types/postgres.types';
import {
  getPaginationObject,
  getPostgresPaginationObject,
} from '../helpers/methods';

export class PostgresBaseDataAccess<T = any> {
  constructor(protected readonly repository: Repository<T>) {}

  async create(data: Partial<T>): Promise<T> {
    try {
      const entity = this.repository.create(data as any);
      const result = await this.repository.save(entity);
      return result as T;
    } catch (error) {
      // Handle PostgreSQL unique constraint violations
      if (error.code === '23505') {
        throw new UnprocessableEntityException(
          `Data already exists, error details: ${error.detail || error.message}`,
          '23505',
        );
      }
      // Handle other PostgreSQL constraint violations
      if (error.code?.startsWith('23')) {
        throw new UnprocessableEntityException(
          `Database constraint violation: ${error.detail || error.message}`,
          error.code,
        );
      }
      throw new InternalServerErrorException(
        `Database error: ${error.message}`,
      );
    }
  }

  async createMany(data: Partial<T>[]): Promise<T[]> {
    try {
      const entities = this.repository.create(data as any[]);
      const result = await this.repository.save(entities);
      return result as T[];
    } catch (error) {
      if (error.code === '23505') {
        throw new UnprocessableEntityException(
          `One or more records already exist: ${error.detail || error.message}`,
          '23505',
        );
      }
      throw new InternalServerErrorException(
        `Database error: ${error.message}`,
      );
    }
  }

  async findOneById(
    id: string | number,
    relations?: string[] | GenObject,
    select?: string[] | GenObject,
  ): Promise<T> {
    try {
      const options: FindOneOptions<T> = {
        where: { id } as any,
      };

      if (relations) {
        options.relations = relations;
      }

      if (select) {
        options.select = select as any;
      }

      const response = await this.repository.findOne(options);

      if (!response) {
        throw new NotFoundException(`Record with ID ${id} not found`);
      }

      return response;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Database error: ${error.message}`,
      );
    }
  }

  async findOne(
    params: PostgresFindOneParams,
  ): Promise<PostgresFindOneResponse<T>> {
    try {
      const options: FindOneOptions<T> = {};

      if (params.where) {
        options.where = params.where;
      }

      if (params.relations) {
        options.relations = params.relations;
      }

      if (params.select) {
        options.select = params.select as any;
      }

      const response = await this.repository.findOne(options);
      return response;
    } catch (error) {
      throw new InternalServerErrorException(
        `Database error: ${error.message}`,
      );
    }
  }

  async findMany(
    params: PostgresFindParams = {},
  ): Promise<PostgresFindResponse<T>> {
    try {
      const options: FindManyOptions<T> = {};

      if (params.where) {
        options.where = params.where;
      }

      if (params.relations) {
        options.relations = params.relations;
      }

      if (params.select) {
        options.select = params.select as any;
      }

      if (params.options) {
        const { skip, take, order } = params.options;

        if (skip !== undefined) {
          options.skip = skip;
        }

        if (take !== undefined) {
          options.take = take;
        }

        if (order) {
          options.order = order;
        }
      }

      const response = await this.repository.find(options);
      return response;
    } catch (error) {
      throw new InternalServerErrorException(
        `Database error: ${error.message}`,
      );
    }
  }

  async updateMany(
    params: PostgresUpdateParams,
  ): Promise<PostgresUpdateResponse> {
    try {
      const { where, updateData } = params;
      const result = await this.repository.update(where, updateData);
      return result;
    } catch (error) {
      if (error.code === '23505') {
        throw new UnprocessableEntityException(
          `Update would create duplicate data: ${error.detail || error.message}`,
          '23505',
        );
      }
      throw new InternalServerErrorException(
        `Database error: ${error.message}`,
      );
    }
  }

  async updateOneById(id: string | number, updateData: Partial<T>): Promise<T> {
    try {
      const result = await this.repository.update(
        { id } as any,
        updateData as any,
      );

      if (result.affected === 0) {
        throw new NotFoundException(`Record with ID ${id} not found`);
      }

      // Return the updated record
      return await this.findOneById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === '23505') {
        throw new UnprocessableEntityException(
          `Update would create duplicate data: ${error.detail || error.message}`,
          '23505',
        );
      }
      throw new InternalServerErrorException(
        `Database error: ${error.message}`,
      );
    }
  }

  async deleteMany(
    where: GenObject | GenObject[],
  ): Promise<PostgresDeleteResponse> {
    try {
      const result = await this.repository.delete(where);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        `Database error: ${error.message}`,
      );
    }
  }

  async deleteOneById(id: string | number): Promise<boolean> {
    try {
      const result = await this.repository.delete({ id } as any);

      if (result.affected === 0) {
        throw new NotFoundException(`Record with ID ${id} not found`);
      }

      return result.affected > 0;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Database error: ${error.message}`,
      );
    }
  }

  async getCount(where?: GenObject | GenObject[]): Promise<number> {
    try {
      const options: FindManyOptions<T> = {};

      if (where) {
        options.where = where;
      }

      const count = await this.repository.count(options);
      return count;
    } catch (error) {
      throw new InternalServerErrorException(
        `Database error: ${error.message}`,
      );
    }
  }

  async exists(where: GenObject | GenObject[]): Promise<boolean> {
    try {
      const count = await this.repository.count({
        where,
      } as FindManyOptions<T>);
      return count > 0;
    } catch (error) {
      throw new InternalServerErrorException(
        `Database error: ${error.message}`,
      );
    }
  }
}
