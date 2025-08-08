import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

import { ConfigService } from '@nestjs/config';
import { IUser } from './users.interface';
import { IGoogle } from 'src/auth/google-auth/google';
import { checkMongoId } from 'src/core/service';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  createGoogleUser = (info: IGoogle) => {
    const { email, name, picture } = info;

    return this.userModel.create({
      email,
      name,
      avatar: info.picture ?? null,

      provider: 'google',
    });
  };

  async isEmailExist(email: string) {
    const user = await this.userModel.findOne({
      email,
    });

    return user ? true : false;
  }

  async create(dto: CreateUserDto) {
    const hashedPassword = this.getHashPassword(dto.password);
    let newUser = await this.userModel.create({
      ...dto,
      password: hashedPassword,
    });
    // return 'This action adds a new user';
    return {
      _id: newUser._id,
      createdAt: newUser.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: any) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .select('-password')
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
    // return `This action returns a #${id} user`;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'not found user';
    }

    return this.userModel
      .findOne({
        _id: id,
      })
      .select('-password')
      .populate([{ path: 'role', select: { name: 1 } }]);
  }
  findOneByUsername(username: string) {
    return this.userModel.findOne({
      email: username,
    });
    // .populate({ path: 'role', select: { name: 1, _id: 1 } });
  }
  isValidPassword(password: string, hashedPassword: string) {
    return compareSync(password, hashedPassword);
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    // return `This action updates a #${id} user`;
    checkMongoId(id);

    return await this.userModel.updateOne(
      { _id: id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }
  async register(userData: RegisterUserDto) {
    if (await this.isEmailExist(userData.email)) {
      throw new BadRequestException('Email already exists');
    }
    // const userRole = await this.roleModel.findOne({ name: USER_ROLE });

    const hashedPassword = this.getHashPassword(userData.password);
    const user = await this.userModel.create({
      name: userData.name,
      email: userData.email,
      address: userData.address,
      gender: userData.gender,
      age: userData.age,
      // role: userRole?._id,
      password: hashedPassword,
    });
    return user;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid user id');
    const foundUser = await this.userModel.findOne({ _id: id });
    // if (foundUser.email === this.configService.get<string>('ADMIN_EMAIL')) {
    //   throw new BadRequestException('Cannot delete admin');
    // }
    await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      }, // Update the deletedBy field with the user's ID
    );
    // return this.userModel.softDelete({ _id: id });
  }

  updateUserToken = async (refresh_token: string, _id: string) => {
    return await this.userModel.updateOne(
      { _id },
      { refreshToken: refresh_token },
    );
  };

  findUserbyRefreshToken = (refreshToken: string) => {
    return this.userModel
      .findOne({ refreshToken: refreshToken })
      .populate({ path: 'role', select: { name: 1 } });
  };
}
