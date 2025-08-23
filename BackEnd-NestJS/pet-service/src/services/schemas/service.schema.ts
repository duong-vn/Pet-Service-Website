import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEnum } from 'class-validator';
import mongoose, { HydratedDocument } from 'mongoose';
import { PetType } from 'src/appointments/dto/create-appointment.dto';
import { User } from 'src/users/schemas/user.schema';

export enum ServiceType {
  BATH = 'BATH',
  HOTEL = 'HOTEL',
  SPA = 'SPA',
  GROOMING = 'GROOMING',
  OTHER = 'OTHER',
}
export enum Variant {
  STANDARD = 'STANDARD',
  PRO = 'PRO',
  PROMAX = 'PROMAX',
}
export type ServiceDocument = HydratedDocument<Service>;
@Schema({ timestamps: true })
export class Service {
  @Prop()
  name: string; //(e.g., Tắm chó, Cắt móng)

  @Prop()
  duration: number; //(minutes)  // ví dụ: 30
  @Prop()
  picture: string;
  @Prop({ enum: Variant })
  variant: Variant;

  @Prop()
  public_id: string;
  @Prop({ enum: ServiceType })
  type: ServiceType; // BATH, HOTEL, SPA, OTHER

  @Prop({ enum: PetType })
  pet: PetType; // DOG, CAT, OTHER

  @Prop()
  priceStart: number;

  @Prop()
  priceEnd: number;
  @Prop()
  description: string[];
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
