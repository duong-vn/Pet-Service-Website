import { Types, HydratedDocument, Model } from 'mongoose';
import { PetType } from './dto/create-appointment.dto';
import { ServiceType } from 'src/services/schemas/service.schema';

export interface ICostumer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}
export interface IService {
  _id: string;
  name: string;
  duration: number;
  description?: string;
  pet: PetType;
  type: ServiceType;
}

export interface AppointmentInfoDTO {
  _id: string;
  user: ICostumer;
  service: IService;
  petWeight: number;
  duration: number; // in minutes
  phone: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'CANCELED' | 'CONFIRMED' | 'PENDING' | 'COMPLETED';
  price: number | string;
  note: string;
  createdAt: Date;
}
