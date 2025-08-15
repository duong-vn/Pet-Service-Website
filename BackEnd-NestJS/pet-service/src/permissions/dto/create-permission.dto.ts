import { IsIn, IsNotEmpty } from 'class-validator';
const allowdMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
export class CreatePermissionDto {
  @IsNotEmpty({ message: 'Permission name is required' })
  name: string;
  @IsNotEmpty({ message: 'Key is required' })
  key: string;
  @IsNotEmpty({ message: 'API path is required' })
  apiPath: string;

  @IsNotEmpty({ message: 'Method is required' })
  @IsIn(allowdMethods, {
    message: `Method must be one of the following: ${allowdMethods.join(', ')}`,
  })
  method: string; // GET | POST | PUT | DELETE | PATCH

  @IsNotEmpty({ message: 'Module is required' })
  module: string; // e.g., 'users', 'resumes', etc.
}
