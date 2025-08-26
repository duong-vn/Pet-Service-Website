import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';
import { Service } from 'src/services/schemas/service.schema';
import { User } from 'src/users/schemas/user.schema';
import { PetType } from '../dto/create-appointment.dto';
export type AppointmentDocument = HydratedDocument<Appointment>;

@Schema({ timestamps: true })
export class Appointment extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Service.name })
  service: mongoose.Schema.Types.ObjectId;

  @Prop()
  petWeight: number;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  // staff: mongoose.Schema.Types.ObjectId;
  @Prop()
  phone: string;
  @Prop()
  date: Date;

  @Prop()
  startTime: String;

  @Prop()
  duration: number; // in minutes
  @Prop()
  endTime: String;
  @Prop({ type: mongoose.Schema.Types.Mixed })
  price: number | string;

  @Prop()
  status: string;
  @Prop()
  note: string;
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

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
