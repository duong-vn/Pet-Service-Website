import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { checkMongoId } from 'src/core/service';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async toClient(id: string) {
    checkMongoId(id);
    const user = await this.userModel.findById(id).select(['email', 'name']);

    if (!user || !user.email || !user.name) {
      throw new BadRequestException('No user found');
    }
    const { email, name } = user;
    return await this.mailerService.sendMail({
      to: email,
      from: '"ZoZo" support@example.com', // override default from
      subject: 'Dịch vụ ZoZo',
      template: 'appointment_template',
      context: {
        customerName: name,
        appointmentDate: '17:00 7-9-2005',
        duration: '1h',
        phone: '0854065355',
        orderedAt: '17:00 12-9-2005',
      },
    });
  }

  async toStaff() {
    return await this.mailerService.sendMail({
      to: 'duongnguyenhust05@gmail.com',
      from: '"Zozo" support@example.com', // override default from
      subject: 'Đơn hàng đang chờ',
      template: 'staff_order_notification_template',
      context: {
        serviceName: 'Tắm chó',
        petType: 'Chó',
        customerName: 'Dương',
        phone: '0854065366',
        status: 'Pending',
        appointmentDate: '17:00 7-9-2005',
        duration: '1h',
        orderedAt: '17:00 12-9-2005',
      },
    });
  }
}
