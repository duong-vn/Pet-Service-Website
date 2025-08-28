import { Type } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
} from 'class-validator';
import mongoose, { mongo } from 'mongoose';

const providers = ['google', 'local'];
export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsOptional()
  public_id: string;

  @IsOptional()
  picture: string;

  @IsNotEmpty({ message: 'Provider is required' })
  @IsIn(providers)
  provider: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsOptional()
  address: string;

  @IsOptional()
  role: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  age: number;

  @IsOptional()
  phone: string;
}

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
  @IsNotEmpty({ message: 'Phone number is required' })
  phone: string;

  @IsOptional()
  address: string;
  @IsOptional()
  role: mongoose.Schema.Types.ObjectId;
  @IsOptional()
  age: number;
  @IsOptional()
  gender: string;
  @IsOptional()
  picture: string;

  // @IsNotEmptyObject()
  // @IsObject()
  // @ValidateNested()
  // @Type(() => Company)
  // company!: Company;
}
