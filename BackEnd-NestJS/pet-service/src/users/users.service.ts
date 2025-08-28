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
import { Role } from 'src/roles/schemas/role.schema';
import { ADMIN_ROLE, USER_ROLE } from 'src/database/sample';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
    private configService: ConfigService,
  ) {}

  getHash = (plain: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(plain, salt);
    return hash;
  };

  createGoogleUser = async (info: IGoogle) => {
    const { email, name, picture } = info;
    const role = await this.roleModel
      .findOne({ name: USER_ROLE })
      .select('_id');

    const newUser = await this.userModel.create({
      email,
      name,
      picture: picture ?? null,
      role,

      provider: 'google',
    });
    return newUser._id;
  };

  async isEmailExist(email: string) {
    const user = (
      await this.userModel.findOne({
        email,
      })
    )?.toObject();

    return user ? user : false;
  }

  async create(dto: CreateUserDto | RegisterUserDto) {
    const hashedPassword = this.getHash(dto.password);
    const { role } = dto;

    let newRole;
    if (!role) {
      newRole = (await this.roleModel
        .findOne({ name: USER_ROLE })
        .select('_id')) as any;
    } else {
      newRole = role;
    }

    let newUser = await this.userModel.create({
      ...dto,
      role: newRole,
      password: hashedPassword,
      emailVerifiedAt: null,
      provider: 'local',
    });
    // return 'This action adds a new user';
    return newUser;
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
      .select(['-password', '-refreshToken'])
      // @ts-ignore: Unreachable code error
      .sort(sort)
      .populate(population)
      .populate({ path: 'role', select: ['name'] })
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
  async findOneWithRT(id: string) {
    // return `This action returns a #${id} user`;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Not found user');
    }

    return await this.userModel
      .findOne({
        _id: id,
      })
      .select('-password')
      .populate([{ path: 'role', select: { name: 1 } }]);
  }
  async findOne(id: string): Promise<IUser | null> {
    // return `This action returns a #${id} user`;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Not found user');
    }

    return await this.userModel
      .findOne({
        _id: id,
      })
      .select(['-password', '-refreshToken'])
      .populate([{ path: 'role', select: { name: 1 } }])
      .lean<IUser>();
  }
  findOneByUsername(username: string) {
    return this.userModel
      .findOne({
        email: username,
      })
      .populate({ path: 'role', select: { name: 1, _id: 1 } });
    // .populate({ path: 'role', select: { name: 1, _id: 1 } });
  }
  isMatchHashed(plain: string, hashed: string) {
    return compareSync(plain, hashed);
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

  async verify(id: string, date: Date) {
    checkMongoId(id);

    return await this.userModel.updateOne(
      { _id: id },
      {
        emailVerifiedAt: date,
      },
    );
  }

  async updateUserProvider(id: string, provider: string) {
    checkMongoId(id);
    const date = new Date();
    return await this.userModel.updateOne(
      { _id: id },
      {
        emailVerifiedAt: date,
        provider,
      },
    );
  }

  async updateMySelf(updateUserDto: UpdateUserDto, user: IUser) {
    let { password } = updateUserDto;
    if (password) {
      password = await this.getHash(password);
      updateUserDto.password = password;
    }
    return this.userModel.updateOne(
      { _id: user._id },
      {
        ...updateUserDto,

        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async mergeAccount(id: string, dto: RegisterUserDto, provider: string) {
    checkMongoId(id);
    const user = await this.userModel.findOne({ _id: id });
    const newProvider = user?.provider.concat('-' + provider) ?? user?.provider;
    await this.userModel.updateOne(
      { _id: id },
      {
        ...dto,
        provider: newProvider,
      },
    );
    if (provider === 'local') {
      const hashedPassword = await this.getHash(dto.password);
      await this.userModel.updateOne(
        { _id: id },
        {
          ...dto,
          password: hashedPassword,
        },
      );
    }
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid user id');
    const foundUser = await this.userModel.findOne({ _id: id });
    if (foundUser?.email === ADMIN_ROLE) {
      throw new BadRequestException('Cannot delete an admin');
    }
    await this.userModel.deleteOne({ _id: id });
  }

  updateUserTokenAndGetPublic = async (
    refresh_token: string | null,
    _id: string,
  ) => {
    let hashedRT = refresh_token;
    if (refresh_token) hashedRT = await this.getHash(refresh_token);
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id },
      { refreshToken: hashedRT },
      { new: true, select: '-password -refreshToken' },
    );
    if (!updatedUser) throw new BadRequestException('Cannot find user');
    return updatedUser.toObject();
  };

  findUserbyRefreshToken = (refreshToken: string) => {
    return this.userModel
      .findOne({ refreshToken })
      .populate({ path: 'role', select: { name: 1 } });
  };
}
