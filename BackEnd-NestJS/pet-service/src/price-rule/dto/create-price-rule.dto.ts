import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose, { mongo } from 'mongoose';
import { Variant } from 'src/services/schemas/service.schema';

export class CreatePriceRuleDto {
  @IsNotEmpty({ message: 'Name is required.' })
  name: string; // Name of the price rule
  @IsNotEmpty({ message: 'Service ID is required.' })
  @IsMongoId({ message: 'Service ID must be a valid MongoDB ObjectId.' })
  service: mongoose.Schema.Types.ObjectId; // Reference to the service ID

  @IsNotEmpty({ message: 'Minimum weight is required.' })
  minWeight: number; // Minimum weight for the price rule
  @IsNotEmpty({ message: 'Maximum weight is required.' })
  maxWeight: number; // Maximum weight for the price rule
  @IsNotEmpty({ message: 'Price is required.' })
  price: number | string;
  @IsNotEmpty({ message: 'Active status is required.' })
  isActive: boolean; // Indicates if the price rule is active or not
}
