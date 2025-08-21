import { MailerService } from '@nestjs-modules/mailer';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { find } from 'rxjs';
import {
  AppointmentInfoDTO,
  ICostumer,
} from 'src/appointments/appointment-type';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { PetType } from 'src/appointments/dto/create-appointment.dto';
import { checkMongoId } from 'src/core/service';
import { ADMIN_ROLE, MANAGER_ROLE } from 'src/database/sample';
import { Role } from 'src/roles/schemas/role.schema';
import { ServiceType } from 'src/services/schemas/service.schema';
import { User } from 'src/users/schemas/user.schema';

export interface ISendEmailPayload {
  costumer: ICostumer;
  serviceName: string;
  pet: PetType;
  petWeight: number;
  date: string;
  status: string;
  duration: string;
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
      petWeight,
      pet,
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

    return await this.mailerService.sendMail({
      to: email,
      from: '"ZoZo" support@example.com', // override default from
      subject: 'Dịch vụ ZoZo',
      template: 'appointment_template',
      context: {
        customerName: name,
        serviceName,
        petType: pet,
        petWeight,
        phone,
        appointmentDate: date,
        duration,
        startTime,
        endTime,
        price,
        orderedAt,
      },
    });
  }

  async toStaff(staffEmailPayload: ISendEmailPayload) {
    const {
      costumer,
      serviceName,
      pet,
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

    return await this.mailerService.sendMail({
      bcc: staffsEmail,
      from: '"Zozo" support@example.com', // override default from
      subject: 'Đơn hàng đang chờ',
      template: 'staff_order_notification_template',
      context: {
        serviceName,
        petType: pet,
        petWeight,
        customerName: costumer.name,
        phone: costumer.phone,
        price,
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
      petWeight,
      date,
      startTime,
      status,
      price,
      duration,
      endTime,
      createdAt,
      note,
    } = appointmentInfo;
    const finalDuration =
      service.type === ServiceType.HOTEL
        ? Math.ceil(duration / 1440) + ' ' + 'ngày'
        : service.duration + ' phút';

    console.log('localstring', price.toLocaleString('vi-VN'));

    const sendEmailPayload: ISendEmailPayload = {
      costumer: user,
      serviceName: service.name,
      pet: service.pet,
      petWeight,
      date: date.toISOString().split('T')[0],
      status,
      duration: finalDuration,
      startTime,
      endTime,
      price: Number(price).toLocaleString('vi-VN'),
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
      throw new BadGatewayException(error.message);
    }

    return { message: 'Email sent' };
  }

  async toVerify(costumerPayload: {
    url: string;
    name: string;
    email: string;
  }) {
    const { url: verifyUrl, name: userName, email } = costumerPayload;
    if (!verifyUrl || !userName || !email) {
      throw new BadGatewayException('No user found or missing infomation');
    }

    return await this.mailerService.sendMail({
      to: email,
      from: '"ZoZo" support@example.com', // override default from
      subject: 'Dịch vụ ZoZo',
      template: 'magic_link_template',
      context: {
        userName,
        verifyUrl,
      },
    });
  }
}
