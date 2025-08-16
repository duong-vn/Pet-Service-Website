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
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import type { IUser } from 'src/users/users.interface';
import { ResponseMessage, User } from 'src/decorator/customize';
import { CanDelete, CanGet, CanPatch, CanPost } from 'src/core/service';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}
  @CanPost('permissions')
  @Post()
  @ResponseMessage('Create a permission')
  create(
    @Body() createPermissionDto: CreatePermissionDto,
    @User() user: IUser,
  ) {
    return this.permissionsService.create(createPermissionDto, user);
  }
  @CanGet('permissions')
  @Get()
  @ResponseMessage('Get a permission paginate')
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.permissionsService.findAll(+current, +pageSize, qs);
  }
  @CanGet('permissions/:id')
  @Get(':id')
  @ResponseMessage('Get a permission by id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }
  @CanPatch('permissions')
  @Patch(':id')
  @ResponseMessage('Patch a permission')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
    @User() user: IUser,
  ) {
    return this.permissionsService.update(id, updatePermissionDto, user);
  }
  @CanDelete('permissions')
  @Delete(':id')
  @ResponseMessage('Delete a permission')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.permissionsService.remove(id, user);
  }
}
