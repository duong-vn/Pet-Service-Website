import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Duration is required' })
  duration: string;
  @IsNotEmpty({ message: 'Description is required' })
  @IsArray()
  @IsString({ each: true })
  description: string[];

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
