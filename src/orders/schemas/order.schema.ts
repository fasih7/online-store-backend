import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

// order.schema.ts
@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  province: string;

  @Prop({ required: true, enum: ['cash'] }) // Add 'card' later if needed
  paymentMethod: string;

  @Prop({ required: true })
  zip: string;

  @Prop({
    type: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        price: Number,
      },
    ],
  })
  items: {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
  }[];

  //TODO: totalPrice should be calculated on BE again
  @Prop({ required: true })
  totalPrice: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  // storeId: Types.ObjectId;

  @Prop({ default: true })
  guestOrder: boolean;

  @Prop({
    default: 'Pending',
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
  })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
