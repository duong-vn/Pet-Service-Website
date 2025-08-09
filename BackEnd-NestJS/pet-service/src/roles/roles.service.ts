import { BadGatewayException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';

import mongoose, { Model } from 'mongoose';
import aqp from 'api-query-params';
import { ConfigService } from '@nestjs/config';
import { checkMongoId } from 'src/core/service';
import { ADMIN_ROLE } from 'src/database/sample';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<Role>,
    private configService: ConfigService,
  ) {}
  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const { name } = createRoleDto;
    const isExist = await this.roleModel.findOne({ name });

    if (isExist) {
      throw new BadGatewayException('roles already existed');
    }

    return this.roleModel.create({
      ...createRoleDto,
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
    console.log('filter', filter);
    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.roleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.roleModel
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadGatewayException('Id is invalid');
    }

    return this.roleModel.findOne({ _id: id }).populate({
      path: 'permissions',
      select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 },
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadGatewayException('Id is invalid');
    }
    const { name } = updateRoleDto;
    const isExist = await this.roleModel.findOne({ name, _id: { $ne: id } });
    if (isExist) throw new BadGatewayException('Name already used');
    return this.roleModel.updateOne(
      {
        _id: id,
      },
      {
        ...updateRoleDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    checkMongoId(id);
    const foundRole = await this.roleModel.findById(id);
    if (foundRole && foundRole.name === ADMIN_ROLE) {
      throw new BadGatewayException('Cannot delete admin role');
    }

    return this.roleModel.deleteOne({ _id: id });
  }
}
