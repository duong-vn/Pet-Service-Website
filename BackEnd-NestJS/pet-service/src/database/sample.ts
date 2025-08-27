import { Types } from 'mongoose';
export const ADMIN_ROLE = 'admin';
export const USER_ROLE = 'user';
export const MANAGER_ROLE = 'manager';
export const BANNED_ROLE = 'banned';

/** 1) PERMISSIONS */
export const INIT_PERMISSIONS = [
  // USERS
  {
    _id: new Types.ObjectId().toString(),
    name: 'Cập nhật người dùng',
    key: 'users:patch',
    module: 'USERS',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Xem danh sách người dùng',
    key: 'users:get',
    module: 'USERS',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Xem chi tiết người dùng',
    key: 'users/:id:get',
    module: 'USERS',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Xóa người dùng',
    key: 'users:delete',
    module: 'USERS',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Tạo người dùng',
    key: 'users:post',
    module: 'USERS',
  },

  // SERVICES
  {
    _id: new Types.ObjectId().toString(),
    name: 'Xóa dịch vụ',
    key: 'services:delete',
    module: 'SERVICES',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Cập nhật dịch vụ',
    key: 'services:patch',
    module: 'SERVICES',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Tạo dịch vụ',
    key: 'services:post',
    module: 'SERVICES',
  },

  // ROLES
  {
    _id: new Types.ObjectId().toString(),
    name: 'Tạo vai trò',
    key: 'roles:post',
    module: 'ROLES',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Xem danh sách vai trò',
    key: 'roles:get',
    module: 'ROLES',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Xem chi tiết vai trò',
    key: 'roles/:id:get',
    module: 'ROLES',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Cập nhật vai trò',
    key: 'roles:patch',
    module: 'ROLES',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Xóa vai trò',
    key: 'roles:delete',
    module: 'ROLES',
  },

  // PERMISSIONS
  {
    _id: new Types.ObjectId().toString(),
    name: 'Tạo quyền',
    key: 'permissions:post',
    module: 'PERMISSIONS',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Xem danh sách quyền',
    key: 'permissions:get',
    module: 'PERMISSIONS',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Xem chi tiết quyền',
    key: 'permissions/:id:get',
    module: 'PERMISSIONS',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Cập nhật quyền',
    key: 'permissions:patch',
    module: 'PERMISSIONS',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Xóa quyền',
    key: 'permissions:delete',
    module: 'PERMISSIONS',
  },

  // APPOINTMENTS
  {
    _id: new Types.ObjectId().toString(),
    name: 'Xóa lịch hẹn',
    key: 'appointments:delete',
    module: 'APPOINTMENTS',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Sửa lịch hẹn',
    key: 'appointments:patch',
    module: 'APPOINTMENTS',
  },
  // PRICE-RULES
  {
    _id: new Types.ObjectId().toString(),
    name: 'Tạo luật giá',
    key: 'price-rules:post',
    module: 'PRICE-RULES',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Xem danh sách luật giá',
    key: 'price-rules:get',
    module: 'PRICE-RULES',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Xem chi tiết luật giá',
    key: 'price-rules/:id:get',
    module: 'PRICE-RULES',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Cập nhật luật giá',
    key: 'price-rules:patch',
    module: 'PRICE-RULES',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Xóa luật giá',
    key: 'price-rules:delete',
    module: 'PRICE-RULES',
  },
] as const;

/** helper: lấy _id theo key */
const idOf = (key: (typeof INIT_PERMISSIONS)[number]['key']) =>
  INIT_PERMISSIONS.find((p) => p.key === key)!._id;

/** 2) ROLES (name, description, isActive, permission[]) */
export const INIT_ROLES = [
  {
    _id: new Types.ObjectId('689f6e674d5811bd2021bbab'),
    name: BANNED_ROLE,
    description: 'BỊ BÂN',
    isActive: true,
    permissions: [], // BÂn
  },
  {
    _id: new Types.ObjectId('689f6e674d5811bd20a1bbab'),
    name: ADMIN_ROLE,
    description: 'Toàn quyền quản trị hệ thống',
    isActive: true,
    permissions: INIT_PERMISSIONS.map((p) => p._id), // admin có tất cả
  },
  {
    _id: new Types.ObjectId('689f6e674d5811bd20a1bbaa'),
    name: MANAGER_ROLE,
    description: 'Quản lý nghiệp vụ: dịch vụ, lịch hẹn, người dùng (mức vừa)',
    isActive: true,
    permissions: [
      // USERS: xem + cập nhật (không tạo/xóa)
      idOf('users:get'),
      idOf('users/:id:get'),
      idOf('users:patch'),

      // SERVICES: full CRUD trừ read (bạn chưa định nghĩa GET cho services, nếu có thì thêm)
      idOf('services:post'),
      idOf('services:patch'),
      idOf('services:delete'),

      // ROLES: chỉ xem
      idOf('roles:get'),
      idOf('roles/:id:get'),

      // PERMISSIONS: chỉ xem
      idOf('permissions:get'),
      idOf('permissions/:id:get'),

      // APPOINTMENTS: có quyền xóa lịch hẹn (duyệt/hủy)
      idOf('appointments:delete'),
      idOf('appointments:patch'),
    ],
  },
  {
    _id: new Types.ObjectId('689f6e674d5811bd20a1bba9'),
    name: USER_ROLE,
    description: 'Người dùng thường, tự thao tác phần của mình',
    isActive: true,
    permissions: [
      // Người dùng thường không có đặc quyền admin,
      // các route self-service nên dựa vào JWT + ownership, không cần permission.
      // Nếu bạn muốn cho quyền “xem danh sách vai trò/quyền” thì có thể thêm:
      // idOf("services:post") ... (nhưng thường KHÔNG)
    ],
  },
] as const;
