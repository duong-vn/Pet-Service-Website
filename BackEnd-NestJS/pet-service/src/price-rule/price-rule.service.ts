import { BadGatewayException, Injectable } from '@nestjs/common';
import { CreatePriceRuleDto } from './dto/create-price-rule.dto';
import { UpdatePriceRuleDto } from './dto/update-price-rule.dto';
import { IUser } from 'src/users/users.interface';
import { PriceRule } from './schemas/price-rule.schema';
import { Model, Types } from 'mongoose';
import { Role } from 'src/roles/schemas/role.schema';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import { checkMongoId } from 'src/core/service';

@Injectable()
export class PriceRuleService {
  constructor(
    @InjectModel(PriceRule.name) private priceModel: Model<PriceRule>,
  ) {}
  create(createPriceRuleDto: CreatePriceRuleDto, user: IUser) {
    return this.priceModel.create({
      ...createPriceRuleDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.priceModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.priceModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  findOne(id: string) {
    checkMongoId(id);

    return this.priceModel.findOne({ _id: id });
  }

  async update(
    id: string,
    updatePriceRuleDto: UpdatePriceRuleDto,
    user: IUser,
  ) {
    checkMongoId(id);
    const { name } = updatePriceRuleDto;
    const isExist = await this.priceModel.findOne({ name, _id: { $ne: id } });
    if (isExist) throw new BadGatewayException('Name already used');
    return this.priceModel.updateOne(
      {
        _id: id,
      },
      {
        ...updatePriceRuleDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    checkMongoId(id);

    return this.priceModel.deleteOne({ _id: id });
  }

  async calcPrice(id: string, petWeight: number) {
    checkMongoId(id);

    const priceRule = (
      await this.priceModel.find({
        service: id,
        maxWeight: { $gt: petWeight },
        minWeight: { $lte: petWeight },
        isActive: true,
      })
    )[0];
    return priceRule?.price ?? 'Chưa có giá cho cân nặng này';
  }
}
