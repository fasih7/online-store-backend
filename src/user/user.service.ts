import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { LoggerService } from '../global/logger';
import { Types } from 'mongoose';
import { UserRepo } from './repos/user.repo';
import { MongoUpdateParams } from '../global/types/mongo.types';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    private readonly logger: LoggerService,
    private readonly userRepo: UserRepo,
  ) {}

  async create(user: Partial<User>) {
    this.logger.silly(UserService.name, this.create.name, 'started');

    try {
      const result = await this.userRepo.create(user);
      return result;
    } catch (error) {
      if (error.code === 11000)
        throw new UnprocessableEntityException(
          'User with this email already exists',
        );
      throw error;
    }
  }

  async findOneById(_id: string | Types.ObjectId) {
    const user = await this.userRepo.findOneById(_id);
    const { password, status, role, ...rest } = user;
    return rest;
  }

  async findOneByEmail(email: string) {
    this.logger.silly(UserService.name, this.findOneByEmail.name, 'started');

    const user = await this.userRepo.findOne({ query: { email } });
    console.log('user: ', user);
    return user;
  }

  async findOneAndUpdate({
    query,
    updateData: updateUser,
    options,
  }: MongoUpdateParams) {
    this.logger.silly(UserService.name, this.findOneAndUpdate.name, 'started');

    return await this.userRepo.findOneAndUpdate({
      query,
      updateData: updateUser,
      options,
    });
  }

  async findByIdAndUpdate(
    _id: string | Types.ObjectId,
    updateUser: Record<string, any>,
  ) {
    this.logger.silly(UserService.name, this.findByIdAndUpdate.name, 'started');

    return await this.userRepo.findOneAndUpdate({
      query: { _id },
      updateData: updateUser,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
