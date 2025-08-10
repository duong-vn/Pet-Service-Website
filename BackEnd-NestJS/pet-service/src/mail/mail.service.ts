import { MailerService } from '@nestjs-modules/mailer';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  AppointmentInfoDTO,
  ICostumer,
} from 'src/appointments/appointment-type';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { PetType } from 'src/appointments/dto/create-appointment.dto';
import { checkMongoId } from 'src/core/service';
import { ADMIN_ROLE, MANAGER_ROLE } from 'src/database/sample';
import { Role } from 'src/roles/schemas/role.schema';
import { User } from 'src/users/schemas/user.schema';

export interface ISendEmailPayload {
  costumer: ICostumer;
  serviceName: string;
  petType: PetType;
  petWeight: number;
  date: string;
  status: string;
  duration: number;
  startTime: string;
  endTime: string;
  price: string;
  orderedAt: string;
  note: string;
}

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly appointmentService: AppointmentsService,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
  ) {}

  async toClient(costumerPayload: ISendEmailPayload) {
    const {
      costumer,
      serviceName,
      petType,
      petWeight,
      date,
      duration,
      startTime,
      endTime,
      price,
      orderedAt,
    } = costumerPayload;
    if (!costumer || !costumer.email || !costumer.name || !costumer.phone) {
      throw new BadGatewayException('No user found or missing infomation');
    }
    const { email, name, phone } = costumer;
    const priceString = price.toLocaleString();
    return await this.mailerService.sendMail({
      to: email,
      from: '"ZoZo" support@example.com', // override default from
      subject: 'Dịch vụ ZoZo',
      template: 'appointment_template',
      context: {
        customerName: name,
        serviceName,
        petType,
        petWeight,
        phone,
        appointmentDate: date,
        duration,
        startTime,
        endTime,
        price: priceString,
        orderedAt,
      },
    });
  }

  async toStaff(staffEmailPayload: ISendEmailPayload) {
    const {
      costumer,
      serviceName,
      petType,
      petWeight,
      date,
      status,
      duration,
      startTime,
      endTime,
      price,
      orderedAt,
      note,
    } = staffEmailPayload;
    if (!costumer || !costumer.email || !costumer.name || !costumer.phone) {
      throw new BadGatewayException('No user found or missing infomation');
    }
    const staffsEmail = await this.getStaffs();
    const priceString = price.toLocaleString();
    return await this.mailerService.sendMail({
      bcc: staffsEmail,
      from: '"Zozo" support@example.com', // override default from
      subject: 'Đơn hàng đang chờ',
      template: 'staff_order_notification_template',
      context: {
        serviceName,
        petType,
        petWeight,
        customerName: costumer.name,
        phone: costumer.phone,
        price: priceString,
        status,
        appointmentDate: date,
        duration,
        startTime,
        endTime,
        orderedAt,
        note: note,
      },
    });
  }
  async getStaffs(): Promise<string[]> {
    const rolesAssigned = await this.roleModel
      .find({
        name: { $in: [MANAGER_ROLE, ADMIN_ROLE] },
      })
      .select('_id')
      .lean();
    let ids = rolesAssigned.map((item) => {
      return item._id.toString();
    });

    const staffs: string[] = await this.userModel.distinct('email', {
      role: { $in: ids },
    });

    return staffs;
  }

  async notify(id: string) {
    checkMongoId(id);
    const appointmentInfo: AppointmentInfoDTO =
      await this.appointmentService.findOne(id);

    const {
      user,
      service,
      petType,
      petWeight,
      date,
      startTime,
      status,
      price,
      endTime,
      createdAt,
      note,
    } = appointmentInfo;

    const sendEmailPayload: ISendEmailPayload = {
      costumer: user,
      serviceName: service.name,
      petType,
      petWeight,
      date: date.toISOString().split('T')[0],
      status,
      duration: service.duration,
      startTime,
      endTime,
      price: price.toLocaleString(),
      note: note,
      orderedAt: createdAt
        .toLocaleString('sv-SE', {
          timeZone: 'Asia/Ho_Chi_Minh',
        })
        .replace('T', ' '),
    };
    try {
      await this.toClient(sendEmailPayload);
      await this.toStaff(sendEmailPayload);
    } catch (error) {
      throw new BadGatewayException('Something went wrong', error.message);
    }

    return { message: 'Email sent' };
  }
}
