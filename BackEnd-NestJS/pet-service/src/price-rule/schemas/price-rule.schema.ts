import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Service, Variant } from 'src/services/schemas/service.schema';

export type PriceRuleDocument = HydratedDocument<PriceRule>;
@Schema({ timestamps: true })
export class PriceRule {
  @Prop()
  name: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Service.name })
  service: mongoose.Schema.Types.ObjectId; // Reference to the service
  @Prop()
  variant: Variant; // Variant of the service (e.g., STANDARD, PRO, PROMAX)
  @Prop()
  minWeight: number; // Minimum weight for the price rule
  @Prop()
  maxWeight: number; // Maximum weight for the price rule
  @Prop({ type: mongoose.Schema.Types.Mixed })
  price: number | string;
  @Prop()
  isActive: boolean;
}
export const PriceRuleSchema = SchemaFactory.createForClass(PriceRule);
