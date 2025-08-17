import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import type { IUser } from 'src/users/users.interface';
import { CanDelete } from 'src/core/service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @HttpCode(201)
  @ResponseMessage('Make an appointment')
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @User() user: IUser,
  ) {
    return this.appointmentsService.create(createAppointmentDto, user);
  }

  @Get()
  @HttpCode(200)
  @ResponseMessage('Get appointments paginate')
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.appointmentsService.findAll(+current, +pageSize, qs);
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch('status/:id')
  @HttpCode(200)
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @User() user: IUser,
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto, user);
  }
  @CanDelete('appointments')
  @Delete(':id')
  @HttpCode(200)
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }

  @Post('day-slots')
  @HttpCode(200)
  slots(@Body() findSlotsDto: FindSlotsDto) {
    return this.appointmentsService.findSlots(findSlotsDto);
  }
}

export type FindSlotsDto = {
  date: string;
  serviceId: string;
};
