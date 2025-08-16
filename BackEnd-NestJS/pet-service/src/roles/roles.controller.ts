import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import type { IUser } from 'src/users/users.interface';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { CanDelete, CanGet, CanPatch, CanPost } from 'src/core/service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Public()
  @Post('test')
  test() {
    return this.rolesService.getPermissionsForRole('689f6e674d5811bd20a1bbab');
  }

  @CanPost('roles')
  @Post()
  @ResponseMessage('Create role')
  create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
    return this.rolesService.create(createRoleDto, user);
  }
  @CanGet('roles')
  @Get()
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
  @ResponseMessage('Get role by Id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }
  @CanPatch('roles')
  @Patch(':id')
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
  @ResponseMessage('Delete a role')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.rolesService.remove(id, user);
  }
}
