import { Module } from '@nestjs/common';
import { PriceRuleService } from './price-rule.service';
import { PriceRuleController } from './price-rule.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PriceRule, PriceRuleSchema } from './schemas/price-rule.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PriceRule.name, schema: PriceRuleSchema },
    ]),
  ],
  controllers: [PriceRuleController],
  providers: [PriceRuleService],
})
export class PriceRuleModule {}
