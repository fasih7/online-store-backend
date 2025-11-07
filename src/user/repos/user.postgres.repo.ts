import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { IPostgresRepoBase } from '../../global/repo/postgres-repo-impl';

@Injectable()
export class UserPostgresRepo extends IPostgresRepoBase<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.findOne({
      where: { email },
    });
  }

  async findWithProducts(userId: string): Promise<User | null> {
    return await this.findOneById(userId, ['products']);
  }

  async findWithOrders(userId: string): Promise<User | null> {
    return await this.findOneById(userId, ['orders']);
  }

  async findByRole(role: string): Promise<User[]> {
    return await this.findMany({
      where: { role },
    });
  }

  async findByStatus(status: string): Promise<User[]> {
    return await this.findMany({
      where: { status },
    });
  }

  async searchUsersWithPagination(
    searchQuery: string,
    options?: {
      pageNumber?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: string;
      statusIds?: string[];
      relations?: string[];
    },
  ): Promise<User[]> {
    const {
      pageNumber = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'ASC',
      statusIds,
      relations = [],
    } = options || {};
    const queryBuilder = this.repository
      .createQueryBuilder('user')
      .where(
        'user.firstName ILIKE :searchQuery OR user.lastName ILIKE :searchQuery OR user.email ILIKE :searchQuery',
        { searchQuery: `%${searchQuery}%` },
      );
    if (statusIds && statusIds.length > 0) {
      queryBuilder.andWhere('user.status IN (:...statusIds)', { statusIds });
    }
    if (relations.includes('products')) {
      queryBuilder.leftJoinAndSelect('user.products', 'products');
    }
    if (relations.includes('orders')) {
      queryBuilder.leftJoinAndSelect('user.orders', 'orders');
    }
    queryBuilder.orderBy(`user.${sortBy}`, sortOrder as 'ASC' | 'DESC');
    queryBuilder.skip((pageNumber - 1) * limit).take(limit);
    return await queryBuilder.getMany();
  }
}
