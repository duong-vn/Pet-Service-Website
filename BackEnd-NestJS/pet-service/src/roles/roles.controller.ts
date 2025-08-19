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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import type { IUser } from 'src/users/users.interface';
import { CanDelete, CanGet, CanPatch, CanPost } from 'src/core/service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @CanPost('roles')
  @Post()
  @HttpCode(201)
  @ResponseMessage('Create role')
  create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
    return this.rolesService.create(createRoleDto, user);
  }

  @CanGet('roles')
  @Get()
  @HttpCode(200)
  @ResponseMessage('Get roles paginate')
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() qs,
  ) {
    return this.rolesService.findAll(+current, +pageSize, qs);
  }

  @CanGet('roles/:id')
  @Get(':id')
  @HttpCode(200)
  @ResponseMessage('Get role by Id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @CanPatch('roles')
  @Patch(':id')
  @HttpCode(200)
  @ResponseMessage('Patch a role')
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @User() user: IUser,
  ) {
    return this.rolesService.update(id, updateRoleDto, user);
  }

  @CanDelete('roles')
  @Delete(':id')
  @HttpCode(200)
  @ResponseMessage('Delete a role')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.rolesService.remove(id, user);
  }
}
