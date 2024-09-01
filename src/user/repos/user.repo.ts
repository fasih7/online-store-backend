import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../schemas/user.schema';
import { MongoBaseRepo } from '../../global/data/mongoBaseRepo';

@Injectable()
export class UserRepo extends MongoBaseRepo {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super(userModel);
  }
}
