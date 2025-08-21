import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
} from '@nestjs/common';
import { PriceRuleService } from './price-rule.service';
import { CreatePriceRuleDto } from './dto/create-price-rule.dto';
import { UpdatePriceRuleDto } from './dto/update-price-rule.dto';
import { CanDelete, CanGet, CanPatch, CanPost } from 'src/core/service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import type { IUser } from 'src/users/users.interface';

@Controller('price-rules')
export class PriceRuleController {
  constructor(private readonly priceRuleService: PriceRuleService) {}
  @CanPost('price-rules')
  @HttpCode(201)
  @Post()
  create(@Body() createPriceRuleDto: CreatePriceRuleDto, @User() user: IUser) {
    return this.priceRuleService.create(createPriceRuleDto, user);
  }

  @CanGet('price-rules')
  @Get()
  @HttpCode(200)
  @ResponseMessage('Get price rules paginate')
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() qs,
  ) {
    return this.priceRuleService.findAll(+current, +pageSize, qs);
  }

  @CanGet('price-rules/:id')
  @Get(':id')
  @HttpCode(200)
  @ResponseMessage('Get price rules by Id')
  findOne(@Param('id') id: string) {
    return this.priceRuleService.findOne(id);
  }

  @CanPatch('price-rules')
  @Patch(':id')
  @HttpCode(200)
  @ResponseMessage('Patch a rule')
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdatePriceRuleDto,
    @User() user: IUser,
  ) {
    return this.priceRuleService.update(id, updateRoleDto, user);
  }
  @CanDelete('price-rules')
  @Delete(':id')
  @HttpCode(200)
  @ResponseMessage('Delete a rule')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.priceRuleService.remove(id, user);
  }
  @Public()
  @Post('calc/:id')
  @HttpCode(200)
  @ResponseMessage('Get price by serviceId and pet weight')
  calc(@Param('id') id: string, @Body('petWeight') petWeight: number) {
    return this.priceRuleService.calcPrice(id, petWeight);
  }
}
