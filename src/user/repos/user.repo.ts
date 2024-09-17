import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { MongoBaseDataAccess } from '../../global/data/mongoBaseDataAccess';

@Injectable()
export class UserRepo extends MongoBaseDataAccess {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super(userModel);
  }
}
