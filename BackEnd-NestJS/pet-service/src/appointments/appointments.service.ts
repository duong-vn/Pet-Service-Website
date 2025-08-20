import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { checkMongoId } from 'src/core/service';
import { FindSlotsDto } from './appointments.controller';
import { Service } from 'src/services/schemas/service.schema';
import { find } from 'rxjs';
import { AppointmentInfoDTO } from './appointment-type';
export const PENDING_STATUS: string = 'PENDING';
export const ShopSetting = {
  openingTime: '09:00',
  closingTime: '17:00',
  slotsStep: 30,
  openDuration: 480,
};

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
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
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
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
  async findOne(id: string): Promise<AppointmentInfoDTO> {
    checkMongoId(id);
    const result = await this.appointmentModel
      .findOne({ _id: id })
      .populate({
        path: 'user',
        select: { name: 1, email: 1, phone: 1 },
      })
      .populate({
        path: 'service',
        select: { name: 1, duration: 1, pet: 1, description: 1 },
      })
      .lean<AppointmentInfoDTO>()
      .exec();
    if (!result) {
      throw new BadRequestException('Cannot find appointment');
    }
    return result;
  }

  update(id: string, updateAppointmentDto: UpdateAppointmentDto, user: IUser) {
    checkMongoId(id);
    return this.appointmentModel.updateOne(
      { _id: id },
      {
        ...updateAppointmentDto,
        updatedBy: {
          _id: user._id,
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
    const fullDay = () => {
      const open = this.toMinutes(ShopSetting.openingTime);
      const close = this.toMinutes(ShopSetting.closingTime);
      const slots: string[] = [];

      for (let i = open; i <= close; i += ShopSetting.slotsStep) {
        slots.push(this.minutesToTimeString(i));
      }
      return slots;
    };

    if (duration >= 480) return fullDay();
    const bookedTime = await this.appointmentModel
      .find({ date }, { _id: 0, startTime: 1, endTime: 1 })
      .sort({ startTime: 1 })
      .lean<{ startTime: string; endTime: string }[]>();

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
    const open = this.toMinutes(ShopSetting.openingTime);
    const close = this.toMinutes(ShopSetting.closingTime);
    const step = ShopSetting.slotsStep;

    let slots: string[] = [];

    if (bookedTime.length === 0) {
      for (let start = open; start <= close - duration; start += step) {
        slots.push(this.minutesToTimeString(start));
      }

      return slots;
    }

    const busy = bookedTime.map((b) => ({
      start: this.toMinutes(b.startTime),
      end: this.toMinutes(b.endTime),
    }));

    let begin = open;
    for (const b of busy) {
      if (begin + duration <= b.start) {
        while (begin + duration <= b.start) {
          slots.push(this.minutesToTimeString(begin));
          begin += step;
        }

        begin = Math.max(b.end, begin + duration);
      } else {
        begin = Math.max(begin, b.end);
      }
    }

    while (begin + duration <= close) {
      slots.push(this.minutesToTimeString(begin));
      begin += step;
    }

    return slots;
  }
}
