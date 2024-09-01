import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Token } from '../utils/constants';
import { Status } from '../utils/enums';
import { Role } from '../../global/enums';

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
}

export const UserSchema = SchemaFactory.createForClass(User);
