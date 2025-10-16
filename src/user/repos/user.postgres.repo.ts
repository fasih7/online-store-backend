import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { PostgresBaseDataAccess } from '../../global/data/postgresBaseDataAccess';

@Injectable()
export class UserPostgresRepo extends PostgresBaseDataAccess<User> {
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
}
