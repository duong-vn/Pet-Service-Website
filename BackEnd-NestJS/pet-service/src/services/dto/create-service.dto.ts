import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Duration is required' })
  duration: string;
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsOptional()
  price: string;
}
