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
  @HttpCode(201)
  @ResponseMessage('Create a service')
  create(@Body() createServiceDto: CreateServiceDto, @User() user: IUser) {
    return this.servicesService.create(createServiceDto, user);
  }

  @Get()
  @HttpCode(200)
  @ResponseMessage('Get services paginate')
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.servicesService.findAll(+current, +pageSize, qs);
  }

  @Get(':id')
  @HttpCode(200)
  @ResponseMessage('Get service by id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @CanPatch('services')
  @Patch(':id')
  @HttpCode(200)
  @ResponseMessage('Patch a service')
  update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @User() user: IUser,
  ) {
    return this.servicesService.update(id, updateServiceDto, user);
  }

  @CanDelete('services')
  @Delete(':id')
  @HttpCode(200)
  @ResponseMessage('Delete a service')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
