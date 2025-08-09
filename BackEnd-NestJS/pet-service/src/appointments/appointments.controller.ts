import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import type { IUser } from 'src/users/users.interface';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ResponseMessage('Make an appointment')
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @User() user: IUser,
  ) {
    return this.appointmentsService.create(createAppointmentDto, user);
  }

  @Get()
  @ResponseMessage('Get appointments paginate')
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.appointmentsService.findAll(+current, +pageSize, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch('status/:id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @User() user: IUser,
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }

  @Post('day-slots')
  slots(@Body() findSlotsDto: FindSlotsDto) {
    return this.appointmentsService.findSlots(findSlotsDto);
  }
}

export type FindSlotsDto = {
  date: string;
  serviceId: string;
};
