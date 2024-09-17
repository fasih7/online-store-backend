import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';

export type FeaturedProductsDocument = HydratedDocument<FeaturedProduct>;

@Schema()
export class FeaturedProduct {
  //   @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  //   userId: Types.ObjectId;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }])
  products: Types.ObjectId[];
}

export const FeaturedProductSchema =
  SchemaFactory.createForClass(FeaturedProduct);
