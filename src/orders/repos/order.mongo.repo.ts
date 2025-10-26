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

  async createQueryAndFindById(id: string) {
    const populateFields = [
      {
        path: 'items.productId',
        select: 'title price',
      },
    ];
    const response = await this.findOneById(id, populateFields);

    response.items = this.flattenResponse(response.items, 'productId');
    return response;
  }

  // Helper methods
  private flattenResponse(values: any[], fieldName: string) {
    return values.map((value) => {
      const flatValue = value[fieldName];
      value[fieldName] = undefined;

      return {
        ...value,
        ...flatValue,
      };
    });
  }
}
