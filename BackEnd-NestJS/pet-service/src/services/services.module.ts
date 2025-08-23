import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Service, ServiceSchema } from './schemas/service.schema';
import { Mongoose } from 'mongoose';
import {
  PriceRule,
  PriceRuleSchema,
} from 'src/price-rule/schemas/price-rule.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema }]),
    MongooseModule.forFeature([
      { name: PriceRule.name, schema: PriceRuleSchema },
    ]),
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
