import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import type { IUser } from './users.interface';
import { CanDelete, CanGet, CanPatch, CanPost } from 'src/core/service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @CanPost('users')
  @Post()
  @HttpCode(201)
  @ResponseMessage('User created')
  async create(@Body() dto: CreateUserDto) {
    if (await this.usersService.isEmailExist(dto.email)) {
      throw new BadRequestException('Email already exists');
    }
    return this.usersService.create(dto);
  }

  @CanGet('users')
  @Get()
  @HttpCode(200)
  @ResponseMessage('Get users paginate')
  findAll(
    @Query('current') page: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.usersService.findAll(+page, +limit, qs);
  }

  @CanGet('users/:id')
  @Get(':id')
  @HttpCode(200)
  @ResponseMessage('Get user by id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('/me')
  @HttpCode(200)
  @ResponseMessage('Patch my self')
  updateMySelf(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    return this.usersService.updateMySelf(updateUserDto, user);
  }

  @CanPatch('users')
  @Patch(':id')
  @HttpCode(200)
  @ResponseMessage('Patch an user')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: IUser,
  ) {
    return this.usersService.update(id, updateUserDto, user);
  }

  @CanDelete('users')
  @Delete(':id')
  @HttpCode(200)
  @ResponseMessage('Delete an user')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.remove(id, user);
  }
}
