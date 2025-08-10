import { Types, HydratedDocument, Model } from 'mongoose';
import { PetType } from './dto/create-appointment.dto';

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
}

export interface AppointmentInfoDTO {
  _id: string;
  user: ICostumer;
  service: IService;
  petType: PetType;
  petWeight: number;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'CANCELED' | 'CONFIRMED' | 'PENDING' | 'COMPLETED';
  price: number;
  note: string;
  createdAt: Date;
}
