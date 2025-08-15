import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Permission } from 'src/permissions/schemas/permission.schema';
import {
  ADMIN_ROLE,
  INIT_PERMISSIONS,
  MANAGER_ROLE,
  USER_ROLE,
} from './sample';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/schemas/user.schema';
import { Role } from 'src/roles/schemas/role.schema';
import { UsersService } from 'src/users/users.service';

type Id = Types.ObjectId;

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
    if (!Boolean(isInit)) return;

    const [countUser, countPermission, countRole] = await Promise.all([
      this.userModel.countDocuments({}),
      this.permissionModel.countDocuments({}),
      this.roleModel.countDocuments({}),
    ]);

    // 1) Init Permissions
    if (countPermission === 0) {
      // Đảm bảo _id là ObjectId, tránh lệch kiểu
      const docs = INIT_PERMISSIONS.map((p) => ({
        ...p,
        _id: new Types.ObjectId(p._id),
        createdBy: p.createdBy?._id
          ? { ...p.createdBy, _id: new Types.ObjectId(p.createdBy._id) }
          : p.createdBy,
      }));
      await this.permissionModel.insertMany(docs);
    }

    // 2) Init Roles
    if (countRole === 0) {
      // Lấy toàn bộ permissions (chỉ _id + metadata để lọc)
      const allPerms = await this.permissionModel
        .find({}, { _id: 1, apiPath: 1, method: 1, module: 1 })
        .lean();

      const allIds: Id[] = allPerms.map((p) => p._id as Id);

      // Helper lọc theo module/method/apiPath
      const pick = (f: (p: any) => boolean): Id[] =>
        allPerms.filter(f).map((p) => p._id as Id);

      // Manager: GET cho USERS/SERVICES/ROLES/PERMISSIONS + các API APPOINTMENTS cụ thể
      const managerIds: Id[] = [
        // GET list modules
        ...pick((p) => p.module === 'USERS' && p.method === 'GET'),
        ...pick((p) => p.module === 'SERVICES' && p.method === 'GET'),
        ...pick((p) => p.module === 'ROLES' && p.method === 'GET'),
        ...pick((p) => p.module === 'PERMISSIONS' && p.method === 'GET'),
        // Appointments theo yêu cầu trước đây:
        ...pick(
          (p) =>
            p.module === 'APPOINTMENTS' &&
            [
              // POST /api/appointments
              p.method === 'POST' && p.apiPath === '/api/appointments',
              // GET /api/appointments
              p.method === 'GET' && p.apiPath === '/api/appointments',
              // DELETE /api/appointments/:id
              p.method === 'DELETE' && p.apiPath === '/api/appointments/:id',
              // PATCH /api/appointments/status/:id
              p.method === 'PATCH' &&
                p.apiPath === '/api/appointments/status/:id',
              // POST /api/appointments/day-slots
              p.method === 'POST' &&
                p.apiPath === '/api/appointments/day-slots',
              // GET /api/appointments/:id
              p.method === 'GET' && p.apiPath === '/api/appointments/:id',
            ].some(Boolean),
        ),
      ];

      // User: tuỳ yêu cầu dự án, tối thiểu cho xem services + day-slots + tạo/đọc appointment của mình
      const userIds: Id[] = [
        ...pick((p) => p.module === 'SERVICES' && p.method === 'GET'),
        ...pick(
          (p) =>
            p.module === 'APPOINTMENTS' &&
            [
              p.method === 'POST' && p.apiPath === '/api/appointments',
              p.method === 'POST' &&
                p.apiPath === '/api/appointments/day-slots',
              p.method === 'GET' && p.apiPath === '/api/appointments/:id',
            ].some(Boolean),
        ),
      ];

      // Tạo roles (để Mongo tự sinh _id, tránh hardcode id rỗng/sai)
      await this.roleModel.insertMany([
        {
          name: USER_ROLE,
          description: 'Normal user',
          isActive: true,
          permissions: userIds,
        },
        {
          name: MANAGER_ROLE,
          description:
            'Quản lý, có quyền quản lý lịch hẹn và xem thông tin hệ thống.',
          isActive: true,
          permissions: Array.from(new Set(managerIds)), // unique
        },
        {
          name: ADMIN_ROLE,
          description: 'Super admin',
          isActive: true,
          permissions: allIds, // full access
        },
      ]);
    }

    // 3) Init Users
    if (countUser === 0) {
      const [userRole, adminRole, managerRole] = await Promise.all([
        this.roleModel.findOne({ name: USER_ROLE }).select('_id').lean(),
        this.roleModel.findOne({ name: ADMIN_ROLE }).select('_id').lean(),
        this.roleModel.findOne({ name: MANAGER_ROLE }).select('_id').lean(),
      ]);

      await this.userModel.insertMany([
        {
          name: 'admin',
          email: 'admin@gmail.com',
          password: this.userService.getHash(
            this.configService.getOrThrow<string>('INIT_PASSWORD'),
          ),
          age: 20,
          gender: 'MALE',
          address: 'VietNam',
          role: adminRole?._id,
        },
        {
          name: 'user',
          email: 'user@gmail.com',
          password: this.userService.getHash(
            this.configService.getOrThrow<string>('INIT_PASSWORD'),
          ),
          age: 20,
          gender: 'FEMALE',
          address: 'KOREA',
          role: userRole?._id,
        },
        {
          name: 'duong',
          email: 'duong@gmail.com',
          password: this.userService.getHash(
            this.configService.getOrThrow<string>('INIT_PASSWORD'),
          ),
          age: 20,
          gender: 'MALE',
          address: 'VIET',
          role: managerRole?._id,
        },
      ]);
    }

    // 4) Log
    const [afterUsers, afterPerms, afterRoles] = await Promise.all([
      this.userModel.countDocuments({}),
      this.permissionModel.countDocuments({}),
      this.roleModel.countDocuments({}),
    ]);
    if (afterUsers > 0 && afterPerms > 0 && afterRoles > 0) {
      console.log('>>> INIT SAMPLE DATA DONE (or already existed)');
    }
  }
}
