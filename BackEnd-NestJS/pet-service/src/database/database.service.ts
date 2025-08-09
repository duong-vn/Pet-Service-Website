import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission } from 'src/permissions/schemas/permission.schema';
import {
  ADMIN_ROLE,
  INIT_PERMISSIONS,
  INIT_ROLES,
  INIT_USERS,
  MANAGER_ROLE,
  USER_ROLE,
} from './sample';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/schemas/user.schema';
import { Role } from 'src/roles/schemas/role.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(
    private userService: UsersService,
    private configService: ConfigService,
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
  ) {}

  async onModuleInit() {
    const isInit = this.configService.get<boolean>('SHOULD_INIT');

    if (Boolean(isInit)) {
      const countUser = await this.userModel.countDocuments({});
      const countPermission = await this.permissionModel.countDocuments({});
      const countRole = await this.roleModel.countDocuments({});
      if (countPermission === 0) {
        await this.permissionModel.insertMany(INIT_PERMISSIONS);
      }
      if (countRole === 0) {
        const permissions = await this.permissionModel.find({}).select('_id');

        await this.roleModel.insertMany([
          {
            name: USER_ROLE,
            description: 'Normal user',
            isActive: true,
            permissions: [],
          },
          {
            _id: '64b462e7af680384a2c10a02',
            name: MANAGER_ROLE,
            description:
              'Quản lý, có quyền quản lý lịch hẹn và xem thông tin hệ thống.',
            isActive: true,
            permissions: [
              permissions[1]._id, // GET /api/users
              permissions[5]._id, // GET /api/services
              permissions[9]._id, // GET /api/roles
              permissions[13]._id, // GET /api/permissions
              permissions[16]._id, // POST /api/appointments
              permissions[17]._id, // GET /api/appointments
              permissions[18]._id, // DELETE /api/appointments/:id
              permissions[19]._id, // PATCH /api/appointments/status/:id
              permissions[20]._id, // POST /api/appointments/day-slots
              permissions[21]._id,
              permissions[22]._id,
              permissions[23]._id,
              permissions[24]._id,
              permissions[25]._id,
            ],
          },
          {
            name: ADMIN_ROLE,
            description: 'super admin',
            isActive: true,
            permissions: permissions,
          },
        ]);
      }

      if (countUser === 0) {
        const userRole = await this.roleModel.findOne({ name: USER_ROLE });
        const adminRole = await this.roleModel.findOne({ name: ADMIN_ROLE });
        const managerRole = await this.roleModel.findOne({
          name: MANAGER_ROLE,
        });

        await this.userModel.insertMany([
          {
            name: 'admin',
            email: 'admin@gmail.com',
            password: this.userService.getHashPassword(
              this.configService.getOrThrow('INIT_PASSWORD'),
            ),
            age: 20,
            gender: 'MALE',
            address: 'VietNam',
            role: adminRole?._id,
          },
          {
            name: 'user',
            email: 'user@gmail.com',
            password: this.userService.getHashPassword(
              this.configService.getOrThrow('INIT_PASSWORD'),
            ),
            age: 20,
            gender: 'FEMALE',
            address: 'KOREA',
            role: userRole?._id,
          },
          {
            name: 'duong',
            email: 'duong@gmail.com',
            password: this.userService.getHashPassword(
              this.configService.getOrThrow('INIT_PASSWORD'),
            ),
            age: 20,
            gender: 'MALE',
            address: 'VIET',
            role: managerRole?._id,
          },
        ]);
      }

      if (countUser > 0 && countRole > 0 && countPermission > 0) {
        console.log('>>> ALREADY INIT SAMPLE DATA ');
      }
    }
  }
}
