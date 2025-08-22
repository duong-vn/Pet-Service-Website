export type Permission = string;
export type Role = {
  _id: string;
  name: string;
};
export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: Role;
  age?: number;
  picture?: string;

  createdAt?: string;
  gender?: string;
  address?: string;
  permissions: Permission[];
}
