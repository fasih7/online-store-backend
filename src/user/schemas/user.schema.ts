import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Token } from '../utils/constants';
import { Status } from '../utils/enums';
import { Role } from '../../global/enums';
import { Product } from '../../products/schemas/product.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop({ unique: true, index: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  token: Token;

  @Prop({ type: String, enum: Status, default: Status.pending })
  status: Status;

  @Prop({ type: String, enum: Role, required: true })
  role: Role;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' }] })
  products: Product[];
}

export const UserSchema = SchemaFactory.createForClass(User);
