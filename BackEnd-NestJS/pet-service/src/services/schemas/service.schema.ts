import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type ServiceDocument = HydratedDocument<Service>;
@Schema({ timestamps: true })
export class Service {
  @Prop()
  name: string; //(e.g., Tắm chó, Cắt móng)

  @Prop()
  duration: string; //(minutes)  // ví dụ: 30
  @Prop()
  picture: string;

  @Prop()
  public_id: string;

  @Prop()
  price: string;
  @Prop()
  description: string;
  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
}
export const ServiceSchema = SchemaFactory.createForClass(Service);
