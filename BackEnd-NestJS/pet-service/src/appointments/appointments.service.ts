import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Appointment } from './schemas/appointment.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { checkMongoId } from 'src/core/service';
import { FindSlotsDto } from './appointments.controller';
import { Service } from 'src/services/schemas/service.schema';
import { find } from 'rxjs';
export const PENDING_STATUS: string = 'PENDING';
export const ShopSetting = {
  openingTime: '09:00',
  closingTime: '17:00',
  slotsStep: 30,
};

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    @InjectModel(Service.name) private serviceModel: Model<Service>,
  ) {}
  toMinutes = (hhmm: string) => {
    const [hh, mm] = hhmm.split(':').map(Number);
    return hh * 60 + mm;
  };

  create(createAppointmentDto: CreateAppointmentDto, user: IUser) {
    try {
      const { startTime, endTime } = createAppointmentDto;
      if (this.toMinutes(startTime) > this.toMinutes(endTime)) {
        throw new Error('Start time phải bé hơn end time');
      }

      return this.appointmentModel.create({
        ...createAppointmentDto,
        user: user._id,

        status: PENDING_STATUS,
        createdBy: {
          _id: user._id,
          email: user.email,
        },
      });
    } catch (error) {
      throw new BadRequestException('Something went wrong', error.message);
    }
  }

  async findAll(currentPage: number, limit: number, qs: any) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.appointmentModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.appointmentModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)

      // @ts-ignore: Unreachable code error
      .sort(sort)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }
  findOne(id: string) {
    checkMongoId(id);
    return this.appointmentModel.findOne({ _id: id });
  }

  update(id: string, updateAppointmentDto: UpdateAppointmentDto, user: IUser) {
    checkMongoId(id);
    return this.appointmentModel.updateOne(
      { _id: id },
      {
        ...updateAppointmentDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  remove(id: string) {
    checkMongoId(id);
    return this.appointmentModel.deleteOne({ _id: id });
  }

  async findSlots(findSlotsDto: FindSlotsDto) {
    const { date, serviceId } = findSlotsDto;
    checkMongoId(serviceId);
    const service = await this.serviceModel
      .findById(serviceId)
      .select('duration');
    if (!service) throw new BadRequestException('Invalid service');
    const duration = Number(service.duration);

    const bookedTime = (await this.appointmentModel
      .find({ date }, { _id: 0, startTime: 1, endTime: 1 })
      .sort({ startTime: 1 })) as unknown as {
      startTime: string;
      endTime: string;
    }[];
    /*"bookedTime": [
            {
                "startTime": "09:00",
                "endTime": "11:00"
            },
            {
                "startTime": "11:30",
                "endTime": "13:30"
            },
            {
                "startTime": "14:00",
                "endTime": "16:00"
            }
        ]
*/
    const slots = this.findAvaiableSlotsAlgorithm(bookedTime, duration);

    return {
      date,
      duration,
      bookedTime,
      slots,
    };
  }

  minutesToTimeString(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    // Đảm bảo luôn có 2 chữ số
    const paddedHours = hours.toString().padStart(2, '0');
    const paddedMinutes = minutes.toString().padStart(2, '0');

    return `${paddedHours}:${paddedMinutes}`;
  }
  findAvaiableSlotsAlgorithm(
    bookedTime: { startTime: string; endTime: string }[],
    duration: number,
  ): string[] {
    let slots: string[] = [];
    for (
      let i = this.toMinutes(ShopSetting.openingTime);
      i <= this.toMinutes(ShopSetting.closingTime) - duration;
      i += ShopSetting.slotsStep
    ) {
      for (let j = 0; j < bookedTime.length; j++) {
        if (i <= this.toMinutes(bookedTime[j].startTime)) {
          if (i + duration > this.toMinutes(bookedTime[j].startTime)) {
            // skip i
            break;
          } else if (i + duration < this.toMinutes(bookedTime[j].startTime)) {
            slots.push(this.minutesToTimeString(i));

            break;
          } else break;
        } else {
          if (i > this.toMinutes(bookedTime[j].endTime)) {
            if (j == bookedTime.length - 1) {
              slots.push(this.minutesToTimeString(i));
            }
            continue;
          } else break;
        }
      }
    }
    return slots;
  }
}
