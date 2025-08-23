import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Service } from './schemas/service.schema';
import mongoose, { Model } from 'mongoose';
import aqp from 'api-query-params';
import { sign } from 'crypto';
import { checkMongoId } from 'src/core/service';
import { PriceRule } from 'src/price-rule/schemas/price-rule.schema';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<Service>,
    @InjectModel(PriceRule.name) private priceRuleModel: Model<PriceRule>,
  ) {}

  async create(createServiceDto: CreateServiceDto, user: IUser) {
    const service = await this.serviceModel.create({
      ...createServiceDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return {
      _id: service._id,
      createdAt: service.createdAt,
    };
  }

  async findAll(current: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    console.log(filter);
    const defaultLimit = limit ?? 10;
    const offset = (current - 1) * defaultLimit;

    const totalItems = (await this.serviceModel.find(filter)).length;
    const totalPage = Math.ceil(totalItems / defaultLimit);

    const result = await this.serviceModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)

      // @ts-ignore: Unreachable code error
      .sort(sort)
      .populate(population)
      .exec();
    return {
      meta: {
        current,
        limit,
        totalItems,
        totalPage,
      },
      result,
    };
  }

  async findOne(id: string) {
    checkMongoId(id);
    try {
      const rules = await this.priceRuleModel
        .find({ service: id })
        .select(['-service', '-createdAt', '-updatedAt', '-__v']);
      if (!rules) {
        throw new BadRequestException('No price rules found for this service');
      }
      const service = await this.serviceModel.findOne({ _id: id.toString() });
      if (!service) {
        throw new BadRequestException('Service not found');
      }
      return {
        ...service.toObject(),
        rules,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  update(id: string, updateServiceDto: UpdateServiceDto, user: IUser) {
    checkMongoId(id);

    return this.serviceModel.updateOne(
      { _id: id },
      {
        ...updateServiceDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  remove(id: string) {
    checkMongoId(id);
    return this.serviceModel.deleteOne({ _id: id });
  }
}
