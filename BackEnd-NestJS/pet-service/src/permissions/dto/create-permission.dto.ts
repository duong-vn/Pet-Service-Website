import { IsIn, IsNotEmpty } from 'class-validator';
const allowdMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
export class CreatePermissionDto {
  @IsNotEmpty({ message: 'Permission name is required' })
  name: string;
  @IsNotEmpty({ message: 'Key is required' })
  key: string;

  @IsNotEmpty({ message: 'Module is required' })
  module: string; // e.g., 'users', 'resumes', etc.
}
