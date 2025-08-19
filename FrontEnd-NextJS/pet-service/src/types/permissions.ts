/** PERMISSION KEYS - dùng cho frontend */
export const PERMISSIONS = {
  // USERS
  USERS_PATCH: "users:patch",
  USERS_GET: "users:get",
  USERS_GET_DETAIL: "users/:id:get",
  USERS_DELETE: "users:delete",
  USERS_POST: "users:post",

  // SERVICES
  SERVICES_DELETE: "services:delete",
  SERVICES_PATCH: "services:patch",
  SERVICES_POST: "services:post",

  // ROLES
  ROLES_POST: "roles:post",
  ROLES_GET: "roles:get",
  ROLES_GET_DETAIL: "roles/:id:get",
  ROLES_PATCH: "roles:patch",
  ROLES_DELETE: "roles:delete",

  // PERMISSIONS
  PERMISSIONS_POST: "permissions:post",
  PERMISSIONS_GET: "permissions:get",
  PERMISSIONS_GET_DETAIL: "permissions/:id:get",
  PERMISSIONS_PATCH: "permissions:patch",
  PERMISSIONS_DELETE: "permissions:delete",

  // APPOINTMENTS
  APPOINTMENTS_DELETE: "appointments:delete",
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
