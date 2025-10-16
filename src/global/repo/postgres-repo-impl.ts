import { In, Repository } from 'typeorm';
import { PostgresBaseDataAccess } from '../data/postgresBaseDataAccess';
import {
  PostgresPaginationOptions,
  PostgresPaginatedResponse,
} from '../types/postgres.types';
import {
  getPaginationObject,
  getPostgresPaginationObject,
} from '../helpers/methods';
import { FindQueryParamsType } from '../types/shared-types';

export class IPostgresRepoBase<T = any> extends PostgresBaseDataAccess<T> {
  constructor(protected repository1: Repository<T>) {
    super(repository1);
  }

  /**
   * Create query and find many records with pagination support
   */
  async createQueryAndFindMany(
    findQueryParams?: FindQueryParamsType,
    getPagination = true,
  ): Promise<PostgresPaginatedResponse<T> | T[]> {
    let { pageNumber = 1, limit = 10 } =
      findQueryParams?.options?.pagination || {};

    if (Array.isArray(findQueryParams?.query?.categoryId)) {
      findQueryParams.query.categoryId = In(findQueryParams.query.categoryId);
    }

    const skip = (pageNumber - 1) * limit;
    const take = limit;

    // Build the query options
    const queryOptions: any = {
      skip,
      take,
    };

    // Handle sorting
    const { sortBy, sortOrder = 'ASC' } = findQueryParams?.options || {};
    if (sortBy) {
      queryOptions.order = { [sortBy]: sortOrder.toUpperCase() };
    }

    // Handle selections
    if (findQueryParams?.options?.selections) {
      queryOptions.select = findQueryParams.options.selections;
    }

    // Build PostgreSQL find params
    const postgresParams = {
      where: findQueryParams?.query,
      options: queryOptions,
    };

    const responsePromise = this.findMany(postgresParams);

    if (!getPagination) {
      return await responsePromise;
    }

    // Get count for pagination
    const countPromise = this.getCount(findQueryParams?.query);

    const [result, count] = await Promise.all([responsePromise, countPromise]);

    const pagination = getPostgresPaginationObject(pageNumber, limit, count);

    return {
      pagination,
      data: result,
    };
  }

  /**
   * Find with advanced pagination options
   */
  async findWithPagination(
    where?: any,
    paginationOptions?: PostgresPaginationOptions,
    relations?: string[] | Record<string, any>,
    select?: string[] | Record<string, any>,
  ): Promise<PostgresPaginatedResponse<T>> {
    const {
      page = 1,
      limit = 10,
      sortBy,
      sortOrder = 'ASC',
    } = paginationOptions || {};

    const skip = (page - 1) * limit;
    const take = limit;

    const queryOptions: any = {
      skip,
      take,
    };

    if (sortBy) {
      queryOptions.order = { [sortBy]: sortOrder };
    }

    const postgresParams = {
      where,
      relations,
      select,
      options: queryOptions,
    };

    const [result, count] = await Promise.all([
      this.findMany(postgresParams),
      this.getCount(where),
    ]);

    const pagination = getPostgresPaginationObject(page, limit, count);

    return {
      pagination,
      data: result,
    };
  }

  /**
   * Bulk operations
   */
  async bulkCreate(data: Partial<T>[]): Promise<T[]> {
    return await this.createMany(data);
  }

  /**
   * Find or create a record
   */
  async findOrCreate(
    where: any,
    createData: Partial<T>,
  ): Promise<{ entity: T; created: boolean }> {
    const existing = await this.findOne({ where });

    if (existing) {
      return { entity: existing, created: false };
    }

    const created = await this.create({ ...createData, ...where });
    return { entity: created, created: true };
  }

  /**
   * Update or create a record (upsert)
   */
  async upsert(
    where: any,
    updateData: Partial<T>,
    createData?: Partial<T>,
  ): Promise<{ entity: T; created: boolean }> {
    const existing = await this.findOne({ where });

    if (existing) {
      const updated = await this.updateOneById(
        (existing as any).id,
        updateData,
      );
      return { entity: updated, created: false };
    }

    const dataToCreate = { ...createData, ...updateData, ...where };
    const created = await this.create(dataToCreate);
    return { entity: created, created: true };
  }

  /**
   * Soft delete (if your entities support it)
   * This assumes your entities have a deletedAt or isDeleted field
   */
  async softDelete(id: string | number): Promise<T> {
    const updateData = {
      deletedAt: new Date(),
      isDeleted: true,
    } as unknown as Partial<T>;

    return await this.updateOneById(id, updateData);
  }

  /**
   * Restore soft deleted record
   */
  async restore(id: string | number): Promise<T> {
    const updateData = {
      deletedAt: null,
      isDeleted: false,
    } as unknown as Partial<T>;

    return await this.updateOneById(id, updateData);
  }
}
