import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, mongo } from 'mongoose';
import { Role } from 'src/roles/schemas/role.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ reqired: true })
  name: string;

  @Prop({ reqired: true })
  email: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  password: string | null;
  @Prop({ reqired: true })
  provider: string;

  @Prop()
  public_id: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  picture: string | null;

  @Prop()
  age: number;

  @Prop()
  gender: string;

  @Prop()
  address: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Role.name })
  role: mongoose.Schema.Types.ObjectId;
  @Prop()
  phone: string;
  @Prop({ type: mongoose.Schema.Types.Mixed })
  emailVerifiedAt: Date | null;
  @Prop()
  refreshToken: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Types.ObjectId;
    email: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
