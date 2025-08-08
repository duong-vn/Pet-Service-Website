import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsString,
  ValidatorConstraint,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsNotEmpty({ message: 'description is required' })
  description: string;

  @IsNotEmpty({ message: 'isActive is required' })
  @IsBoolean({ message: 'isActive must be boolean type' })
  isActive: boolean;

  @IsNotEmpty({ message: 'permission must not be empty' })
  // @IsArray({ message: 'permissions must be an array' })
  // @IsString({ each: true, message: 'array must be strings' })
  // @IsMongoId({ each: true, message: 'invalid ObjectId' })
  permissions: mongoose.Schema.Types.ObjectId[];
}
