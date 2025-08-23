import { PartialType } from '@nestjs/mapped-types';
import { CreatePriceRuleDto } from './create-price-rule.dto';

export class UpdatePriceRuleDto extends PartialType(CreatePriceRuleDto) {}
