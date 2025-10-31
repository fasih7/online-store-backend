import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { LoggerService } from '../global/logger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { Types } from 'mongoose';
// import { UserRepo } from './repos/user.mongo.repo';
// import { MongoUpdateParams } from '../global/types/mongo.types';
// import { User } from './schemas/user.schema';
import { UserPostgresRepo } from './repos/user.postgres.repo';
import { User } from './entities/user.entity';
import { Address } from './entities/address.entity';
import { AddressRepo } from './repos/address.repo';
import { SuccessResponse } from '../global/consts';
import { PostgresPaginatedResponse } from '../global/types/postgres.types';
import { GetAllUsersQueryDto } from './dto/get-all-users-query.dto';
import { Status } from './utils/enums';
import { Order } from '../orders/entities';

@Injectable()
export class UserService {
  constructor(
    private readonly logger: LoggerService,
    private readonly userRepo: UserPostgresRepo,
    private readonly addressRepo: AddressRepo,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(user: Partial<User>) {
    this.logger.silly(UserService.name, this.create.name, 'started');

    try {
      const result = await this.userRepo.create(user);
      return result;
    } catch (error) {
      if (error.response.error === '23505')
        // PostgreSQL unique constraint violation
        throw new UnprocessableEntityException(
          'User with this email already exists',
        );
      throw error;
    }
  }

  async findOneById(id: string) {
    const user = await this.userRepo.findOneById(id);
    const { password, status, role, ...rest } = user;
    return rest;
  }

  async findOneByIdWithRole(id: string) {
    const user = await this.userRepo.findOneById(id);
    const { password, status, ...rest } = user;
    return rest;
  }

  async findOneByEmail(email: string) {
    this.logger.silly(UserService.name, this.findOneByEmail.name, 'started');

    const user = await this.userRepo.findByEmail(email);
    return user;
  }

  async findOneAndUpdate(id: string, updateUser: Partial<User>) {
    this.logger.silly(UserService.name, this.findOneAndUpdate.name, 'started');

    await this.userRepo.updateOneById(id, updateUser);
    return SuccessResponse;
  }

  async findByIdAndUpdate(id: string, updateUser: Record<string, any>) {
    this.logger.silly(UserService.name, this.findByIdAndUpdate.name, 'started');

    return await this.userRepo.updateOneById(id, updateUser);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findAddressesByCondition(
    condition: any, // TODO Partial<Address> & { userId: string } didn't work, will come to it later
  ) {
    this.logger.silly(
      UserService.name,
      this.findAddressesByCondition.name,
      'started',
    );

    return await this.addressRepo.findMany({ where: condition });
  }

  // Add Address
  async addAddress(
    userId: string,
    addressData: Partial<Address>,
  ): Promise<Address> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['addresses'], // todo: need just count
    });
    if (!user) throw new Error('User not found');
    if (user.addresses.length >= 5)
      throw new Error('Maximum 5 addresses allowed');

    // Todo: improve this to be done in one query
    if (addressData.isDefault) {
      for (const addr of user.addresses) {
        if (addr.isDefault) {
          await this.addressRepo.updateOneById(addr.id, { isDefault: false });
        }
      }
    }

    const address = await this.addressRepo.create({ ...addressData, user });
    return address;
  }

  // Update Address
  async updateAddress(
    userId: string,
    addressData: Partial<Address>,
  ): Promise<Address> {
    const address = await this.addressRepo.findOne({
      where: { id: addressData.id, user: { id: userId } },
    });
    if (!address) throw new Error('Address not found');

    // todo: need to optimize, this can be done in one query
    if (addressData.isDefault) {
      const defaultAddress = await this.addressRepo.findOne({
        where: { user: { id: userId }, isDefault: true },
      });
      if (defaultAddress && defaultAddress.id !== address.id) {
        await this.addressRepo.updateOneById(defaultAddress.id, {
          isDefault: false,
        });
      }
    }

    Object.assign(address, addressData);
    return this.addressRepo.updateOneById(address.id, address);
  }

  // Delete Address
  async deleteAddress(addressId: string, userId: string): Promise<void> {
    // const address = await this.addressRepo.findOne({
    //   where: { id: addressId, user: { id: userId } },
    // });
    // if (!address) throw new Error('Address not found');

    // await this.addressRepo.deleteOneById(addressId);
    await this.addressRepo.deleteMany({ user: { id: userId }, id: addressId });
  }

  // Get all users (for admin)
  async getAllUsers(
    query: GetAllUsersQueryDto,
  ): Promise<PostgresPaginatedResponse<Partial<User>>> {
    this.logger.silly(UserService.name, this.getAllUsers.name, 'started');

    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      role,
      status,
    } = query;

    // Build where clause
    const where: any = {};
    if (role) {
      where.role = role;
    }
    if (status) {
      where.status = status;
    }

    // Get paginated results
    const result = await this.userRepo.findWithPagination(
      Object.keys(where).length > 0 ? where : undefined,
      {
        page,
        limit,
        sortBy,
        sortOrder: sortOrder as 'ASC' | 'DESC',
      },
    );

    // Get user IDs from the paginated results
    const userIds = result.data.map((user) => user.id);

    // Get order counts for all users in a single query
    const orderCountsMap = new Map<string, number>();
    if (userIds.length > 0) {
      const orderCounts = await this.orderRepository
        .createQueryBuilder('order')
        .select('order.userId', 'userId')
        .addSelect('COUNT(*)', 'count')
        .where('order.userId IN (:...userIds)', { userIds })
        .groupBy('order.userId')
        .getRawMany();

      // Convert to Map for easy lookup
      orderCounts.forEach((item) => {
        orderCountsMap.set(item.userId, parseInt(item.count, 10));
      });
    }

    // Exclude sensitive fields from each user and add order count
    const sanitizedData = result.data.map((user) => {
      const { password, token, hashedRt, ...sanitizedUser } = user;
      return {
        ...sanitizedUser,
        totalOrders: orderCountsMap.get(user.id) || 0,
      };
    });

    return {
      data: sanitizedData,
      pagination: result.pagination,
    };
  }

  // Update user status (for admin)
  async updateUserStatus(
    userId: string,
    status: Status,
  ): Promise<{ success: boolean }> {
    this.logger.silly(UserService.name, this.updateUserStatus.name, 'started');

    await this.userRepo.updateOneById(userId, { status });
    return SuccessResponse;
  }
}
