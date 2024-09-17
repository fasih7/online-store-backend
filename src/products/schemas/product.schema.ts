import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  quantity: string;

  @Prop()
  price: string;

  @Prop()
  images: string[];

  @Prop()
  primaryImage: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
