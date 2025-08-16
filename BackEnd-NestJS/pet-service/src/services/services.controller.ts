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
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import type { IUser } from 'src/users/users.interface';
import { ResponseMessage, User } from 'src/decorator/customize';
import { CanDelete, CanPatch, CanPost } from 'src/core/service';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}
  @CanPost('services')
  @Post()
  create(@Body() createServiceDto: CreateServiceDto, @User() user: IUser) {
    return this.servicesService.create(createServiceDto, user);
  }

  @Get()
  @ResponseMessage('Get services paginate')
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.servicesService.findAll(+current, +pageSize, qs);
  }

  @Get(':id')
  @ResponseMessage('Get services by id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }
  @CanPatch('services')
  @Patch(':id')
  @ResponseMessage('Patch a services')
  update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @User() user: IUser,
  ) {
    return this.servicesService.update(id, updateServiceDto, user);
  }
  @CanDelete('services')
  @Delete(':id')
  @ResponseMessage('Delete a service')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
