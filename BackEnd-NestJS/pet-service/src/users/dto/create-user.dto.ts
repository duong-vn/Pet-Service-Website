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
  @IsNotEmpty({ message: 'Provider is required' })
  @IsIn(providers)
  provider: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsOptional()
  address: string;
  @IsOptional()
  age: number;
  @IsOptional()
  phone: number;
}

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
  @IsOptional()
  address: string;

  @IsOptional()
  age: number;
  @IsOptional()
  gender: string;
  @IsOptional()
  phone: number;

  // @IsNotEmptyObject()
  // @IsObject()
  // @ValidateNested()
  // @Type(() => Company)
  // company!: Company;
}
