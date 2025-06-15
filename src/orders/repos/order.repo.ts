import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMongoRepoBase } from 'src/global/repo/mongo-repo-impl';
import { Order } from '../schemas/order.schema';

@Injectable()
export class OrderRepo extends IMongoRepoBase {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {
    super(orderModel);
  }
}
