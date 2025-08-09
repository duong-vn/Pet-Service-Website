import { ObjectId } from 'mongodb';

export const ADMIN_ROLE = 'admin';
export const USER_ROLE = 'user';
export const MANAGER_ROLE = 'manager';
export const BANNED_ROLE = 'banned';

export const INIT_PERMISSIONS = [
  // USERS
  {
    _id: '64b462e7af680384a2c00a01',
    name: 'Tạo mới user',
    apiPath: '/api/users',
    method: 'POST',
    module: 'USERS',
    createdBy: { _id: '68898914c45a19e98c65adfe', email: 'duong@gmail.com' },
  },
  {
    _id: '64b462e7af680384a2c00a02',
    name: 'Lấy danh sách user (phân trang',
    apiPath: '/api/users',
    method: 'GET',
    module: 'USERS',
    createdBy: { _id: '68898914c45a19e98c65adfe', email: 'duong@gmail.com' },
  },
  {
    _id: '64b462e7af680384a2c00a03',
    name: 'Cập nhật thông tin user',
    apiPath: '/api/users/:id',
    method: 'PATCH',
    module: 'USERS',
    createdBy: { _id: '68898914c45a19e98c65adfe', email: 'duong@gmail.com' },
  },
  {
    _id: '64b462e7af680384a2c00a04',
    name: 'Xoá 1 user',
    apiPath: '/api/users/:id',
    method: 'DELETE',
    module: 'USERS',
    createdBy: { _id: '68898914c45a19e98c65adfe', email: 'duong@gmail.com' },
  },

  // SERVICES
  {
    _id: '64b462e7af680384a2c00a05',
    name: 'Tạo mới dịch vụ',
    apiPath: '/api/services',
    method: 'POST',
    module: 'SERVICES',
    createdBy: { _id: '68898914c45a19e98c65adfe', email: 'duong@gmail.com' },
  },
  {
    _id: '64b462e7af680384a2c00a06',
    name: 'Lấy danh sách dịch vụ (phân trang',
    apiPath: '/api/services',
    method: 'GET',
    module: 'SERVICES',
    createdBy: { _id: '68898914c45a19e98c65adfe', email: 'duong@gmail.com' },
  },
  {
    _id: '64b462e7af680384a2c00a07',
    name: 'Cập nhật dịch vụ',
    apiPath: '/api/services/:id',
    method: 'PATCH',
    module: 'SERVICES',
    createdBy: { _id: '68898914c45a19e98c65adfe', email: 'duong@gmail.com' },
  },
  {
    _id: '64b462e7af680384a2c00a08',
    name: 'Xoá dịch vụ',
    apiPath: '/api/services/:id',
    method: 'DELETE',
    module: 'SERVICES',
    createdBy: { _id: '68898914c45a19e98c65adfe', email: 'duong@gmail.com' },
  },

  // ROLES
  {
    _id: '64b462e7af680384a2c00a09',
    name: 'Tạo mới role',
    apiPath: '/api/roles',
    method: 'POST',
    module: 'ROLES',
    createdBy: { _id: '68898914c45a19e98c65adfe', email: 'duong@gmail.com' },
  },
  {
    _id: '64b462e7af680384a2c00a0a',
    name: 'Lấy danh sách role (phân trang',
    apiPath: '/api/roles',
    method: 'GET',
    module: 'ROLES',
    createdBy: { _id: '68898914c45a19e98c65adfe', email: 'duong@gmail.com' },
  },
  {
    _id: '64b462e7af680384a2c00a0b',
    name: 'Cập nhật role',
    apiPath: '/api/roles/:id',
    method: 'PATCH',
    module: 'ROLES',
    createdBy: { _id: '68898914c45a19e98c65adfe', email: 'duong@gmail.com' },
  },
  {
    _id: '64b462e7af680384a2c00a0c',
    name: 'Xoá role',
    apiPath: '/api/roles/:id',
    method: 'DELETE',
    module: 'ROLES',
    createdBy: { _id: '68898914c45a19e98c65adfe', email: 'duong@gmail.com' },
  },

  // PERMISSIONS
  {
    _id: '64b462e7af680384a2c00a0d',
    name: 'Tạo mới permission',
    apiPath: '/api/permissions',
    method: 'POST',
    module: 'PERMISSIONS',
    createdBy: { _id: '68898914c45a19e98c65adfe', email: 'duong@gmail.com' },
  },
  {
    _id: '64b462e7af680384a2c00a0e',
    name: 'Lấy danh sách permission (phân trang',
    apiPath: '/api/permissions',
    method: 'GET',
    module: 'PERMISSIONS',
    createdBy: { _id: '68898914c45a19e98c65adfe', email: 'duong@gmail.com' },
  },
  {
    _id: '64b462e7af680384a2c00a0f',
    name: 'Cập nhật permission',
    apiPath: '/api/permissions/:id',
    method: 'PATCH',
    module: 'PERMISSIONS',
    createdBy: { _id: '68898914c45a19e98c65adfe', email: 'duong@gmail.com' },
  },
  {
    _id: '64b462e7af680384a2c00a10',
    name: 'Xoá permission',
    apiPath: '/api/permissions/:id',
    method: 'DELETE',
    module: 'PERMISSIONS',
    createdBy: { _id: '68898914c45a19e98c65adfe', email: 'duong@gmail.com' },
  },

  // APPOINTMENTS
  {
    _id: '64b462e7af680384a2c00a11',
    name: 'Tạo mới lịch hẹn',
    apiPath: '/api/appointments',
    method: 'POST',
    module: 'APPOINTMENTS',
    createdBy: { _id: '68898914c45a19e98c65adfe', email: 'duong@gmail.com' },
  },
  {
    _id: '64b462e7af680384a2c00a12',
    name: 'Lấy danh sách lịch hẹn (phân trang',
    apiPath: '/api/appointments',
    method: 'GET',
    module: 'APPOINTMENTS',
    createdBy: { _id: '68898914c45a19e98c65adfe', email: 'duong@gmail.com' },
  },
  {
    _id: '64b462e7af680384a2c00a13',
    name: 'Xoá lịch hẹn',
    apiPath: '/api/appointments/:id',
    method: 'DELETE',
    module: 'APPOINTMENTS',
    createdBy: { _id: '68898914c45a19e98c65adfe', email: 'duong@gmail.com' },
  },
  {
    _id: '64b462e7af680384a2c00a14',
    name: 'Cập nhật trạng thái lịch hẹn',
    apiPath: '/api/appointments/status/:id',
    method: 'PATCH',
    module: 'APPOINTMENTS',
    createdBy: { _id: '68898914c45a19e98c65adfe', email: 'duong@gmail.com' },
  },
  {
    _id: '64b462e7af680384a2c00a15',
    name: 'Lấy danh sách slot trống trong ngày',
    apiPath: '/api/appointments/day-slots',
    method: 'POST',
    module: 'APPOINTMENTS',
    createdBy: { _id: '68898914c45a19e98c65adfe', email: 'duong@gmail.com' },
  },
  {
    _id: '64b462e7af680384a2c00a16',
    name: 'Lấy 1 lịch hẹn',
    apiPath: '/api/appointments/:id',
    method: 'GET',
    module: 'APPOINTMENTS',
    createdBy: { _id: '68898914c45a19e98c65adfe', email: 'duong@gmail.com' },
  },
  {
    _id: '64b462e7af680384a2c00a26',
    name: 'Lấy 1 người dùng',
    apiPath: '/api/users/:id',
    method: 'GET',
    module: 'USERS',
    createdBy: { _id: '68898914c45a19e98c65adfe', email: 'duong@gmail.com' },
  },
  {
    _id: '64b462e7af680384a2c01a26',
    name: 'Lấy 1 dịch vụ',
    apiPath: '/api/services/:id',
    method: 'GET',
    module: 'SERVICES',
    createdBy: { _id: '68898914c45a19e98c65adfe', email: 'duong@gmail.com' },
  },
  {
    _id: '64b462e7af682384a2c01a26',
    name: 'Lấy 1 quyền',
    apiPath: '/api/permissions/:id',
    method: 'GET',
    module: 'PERMISSIONS',
    createdBy: { _id: '68898914c45a19e98c65adfe', email: 'duong@gmail.com' },
  },
  {
    _id: '64b462a7af682384a2c01a26',
    name: 'Lấy 1 quyền',
    apiPath: '/api/roles/:id',
    method: 'GET',
    module: 'ROLES',
    createdBy: { _id: '68898914c45a19e98c65adfe', email: 'duong@gmail.com' },
  },
];

export const INIT_ROLES = [
  {
    _id: '64b462e7af680384a2c10a01',
    name: ADMIN_ROLE,
    description: 'Quản trị viên toàn hệ thống, có toàn quyền quản lý.',
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
      INIT_PERMISSIONS[1]._id, // GET /api/users
      INIT_PERMISSIONS[5]._id, // GET /api/services
      INIT_PERMISSIONS[9]._id, // GET /api/roles
      INIT_PERMISSIONS[13]._id, // GET /api/permissions
      INIT_PERMISSIONS[16]._id, // POST /api/appointments
      INIT_PERMISSIONS[17]._id, // GET /api/appointments
      INIT_PERMISSIONS[18]._id, // DELETE /api/appointments/:id
      INIT_PERMISSIONS[19]._id, // PATCH /api/appointments/status/:id
      INIT_PERMISSIONS[20]._id, // POST /api/appointments/day-slots
    ],
  },
  {
    _id: '64b462e7af680384a2c10a03',
    name: USER_ROLE,
    description: 'Người dùng, chỉ có quyền đặt lịch và xem thông tin dịch vụ.',
    isActive: true,
    permissions: [
      INIT_PERMISSIONS[5]._id, // GET /api/services
      INIT_PERMISSIONS[16]._id, // POST /api/appointments
      INIT_PERMISSIONS[17]._id, // GET /api/appointments
      INIT_PERMISSIONS[20]._id, // POST /api/appointments/day-slots
    ],
  },
  {
    _id: '64b462e7af680384a2c10a04',
    name: BANNED_ROLE,
    description: 'Tài khoản bị khóa, không có quyền truy cập.',
    isActive: false,
    permissions: [],
  },
];

export const INIT_USERS = [
  {
    _id: '64b462e7af680384a2c20a01',
    name: 'Nguyễn Văn Admin',
    email: 'admin@example.com',
    provider: 'local',
    password: '$2b$10$tITMqyWlvUHs1qabrCUEB.nKHRfB.5esMOtL7rZjFbr2U.dqGvNOq',
    role: INIT_ROLES[0]._id,
  },
  {
    _id: '64b462e7af680384a2c20a02',
    name: 'Trần Thị Manager',
    email: 'manager@example.com',
    provider: 'local',
    password: '$2b$10$tITMqyWlvUHs1qabrCUEB.nKHRfB.5esMOtL7rZjFbr2U.dqGvNOq',
    role: INIT_ROLES[1]._id,
  },

  {
    _id: '64b462e7af680384a2c20a03',
    name: 'Lê Văn User',
    email: 'user@example.com',
    provider: 'local',
    password: '$2b$10$tITMqyWlvUHs1qabrCUEB.nKHRfB.5esMOtL7rZjFbr2U.dqGvNOq',
    role: INIT_ROLES[2]._id,
  },
  {
    _id: '64b462e7af680384a2c20a04',
    name: 'Google User',
    email: 'googleuser@example.com',
    provider: 'google',
    role: INIT_ROLES[2]._id,
  },
  {
    _id: '64b462e7af680384a2c20a05',
    name: 'Người Dùng Bị Cấm',
    email: 'banned@example.com',
    provider: 'local',
    password: '$2b$10$tITMqyWlvUHs1qabrCUEB.nKHRfB.5esMOtL7rZjFbr2U.dqGvNOq',
    role: INIT_ROLES[3]._id,
  },
];
