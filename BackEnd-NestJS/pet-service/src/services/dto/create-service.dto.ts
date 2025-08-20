import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PetType } from 'src/appointments/dto/create-appointment.dto';
import { ServiceType } from '../schemas/service.schema';

export class CreateServiceDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Duration is required' })
  duration: string;
  @IsNotEmpty({ message: 'Description is required' })
  @IsArray()
  @IsString({ each: true })
  description: string[];

  @IsEnum(ServiceType, {
    message:
      'Service type must be one of the following: BATH, HOTEL, SPA, OTHER',
  })
  @Transform((name) => name.value.toUpperCase())
  type: ServiceType;

  @IsNotEmpty({ message: 'Pet type is required' })
  @IsEnum(PetType, {
    message: 'Pet type must be one of the following: DOG, CAT, OTHER',
  })
  @Transform((name) => name.value.toUpperCase())
  pet: PetType;

  @IsNotEmpty({ message: 'Picture is required' })
  picture: string;

  @IsNotEmpty({ message: 'Public id is required' })
  public_id: string;

  @IsNotEmpty({ message: 'PriceStart is required' })
  @Type(() => Number)
  @IsNumber()
  priceStart: number;

  @IsNotEmpty({ message: 'PriceEnd is required' })
  @Type(() => Number)
  @IsNumber()
  priceEnd: number;
}
