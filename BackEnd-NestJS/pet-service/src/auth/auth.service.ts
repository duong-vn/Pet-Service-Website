import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GoogleAuthService } from './google-auth/google-auth.service';
import { UsersService } from 'src/users/users.service';
import { IGoogle } from './google-auth/google';
import { Response } from 'express';
import { IUser } from 'src/users/users.interface';
import mongoose, { ObjectId, Types } from 'mongoose';
import { error } from 'console';
import { Schema } from 'inspector/promises';
import { access } from 'fs';
import { RolesService } from 'src/roles/roles.service';
import { use } from 'passport';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { getHashes } from 'crypto';
import { MailService } from 'src/mail/mail.service';

export interface IPayload {
  sub: string;
  iss: string;
  _id: any;
  name: string;
  email: string;
  role: {
    _id: any;
    name: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private roleService: RolesService,
    private configService: ConfigService,
    private mail: MailService,
    private googleAuthService: GoogleAuthService,
  ) {}

  googleLogin = async (id_token: string, res: Response) => {
    const userInfo = await this.verifyGoogle(id_token);

    const userId = await this.findOrCreateUser(userInfo);

    const user = (await this.userService.findOne(userId.toString())) as any;
    const { _id, name, role } = user;

    const payload: IPayload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      email: user.email,
      name,
      role,
    };

    const refresh_token = await this.createRefreshToken(payload);

    //update refresh_token in database
    await this.userService.updateUserTokenAndGetPublic(
      refresh_token,
      _id.toString(),
    );

    res.clearCookie('refresh_token');

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: this.configService.get('COOKIE_EXPIRE'),
    });
    const permissions = await this.roleService.getPermissionsForRole(
      user.role._id.toString(),
    );
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        ...user,
        permissions,
      },
    };
  };

  async localLogin(res: Response, user: IUser) {
    const { _id, role, email, name } = user;

    const payload: IPayload = {
      sub: 'Local-login',
      iss: 'server',
      _id,
      email,
      name,
      role,
    };
    const payloadRT = {
      sub: 'Local-login',
      iss: 'server',
      _id,
    };
    const refresh_token = await this.createRefreshToken(payloadRT);

    const userInfo = await this.userService.updateUserTokenAndGetPublic(
      refresh_token,
      _id,
    );

    res.clearCookie('refresh_token');
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: this.configService.getOrThrow('COOKIE_EXPIRE'),
    });

    const permissions = await this.roleService.getPermissionsForRole(
      user.role._id.toString(),
    );

    return {
      access_token: this.jwtService.sign(payload),
      user: { ...userInfo, permissions },
    };
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByUsername(username);
    if (!user)
      throw new BadRequestException('Sai thông tin emaill hoặc mật khẩu');
    if (!user.emailVerifiedAt)
      throw new BadRequestException(
        'Email chưa được xác thực, hãy đăng kí lại để xác thực!',
      );
    if (user && user.password) {
      const isValid = await this.userService.isMatchHashed(pass, user.password);
      if (isValid) {
        // console.log('>>>role', role, 'type of role', typeof role);
        return user;
      } else {
        throw new BadRequestException('Sai thông tin email hoặc mật khẩuu');
      }
    } else {
      throw new BadRequestException('Sai thông tin email hoặcc mật khẩu');
    }
  }

  async verifyGoogle(id_token: string): Promise<IGoogle> {
    const userInfo = await this.googleAuthService.verifyToken(id_token);

    if (!userInfo?.email || !userInfo?.name) {
      throw new UnauthorizedException('Invalid google token');
    }
    return userInfo;
  }

  async findOrCreateUser(userInfo: IGoogle) {
    let user = (
      await this.userService.findOneByUsername(userInfo.email)
    )?.toObject();
    if (user) {
      if (!user.emailVerifiedAt) {
        await this.userService.verify(user._id.toString(), new Date());
      }
      if (!user.provider.includes('google')) {
        const provider = user.provider + '-google';
        await this.userService.mergeAccount(
          user._id.toString(),
          userInfo as any,
          provider,
        );
      }
      return user._id;
    }
    const _id = await this.userService.createGoogleUser(userInfo);
    return _id;
  }

  async createRefreshToken(payload) {
    const { sub, iss, _id } = payload;
    const payloadRT = {
      sub,
      iss,
      _id,
    };
    const refresh_token = await this.jwtService.sign(payloadRT, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRE'),
    });

    return refresh_token;
  }
  async processNewToken(refresh_token: string, res: Response) {
    try {
      const verify = await this.jwtService.verify(refresh_token, {
        secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
      });
      const { _id } = verify;

      const user = await this.userService.findOneWithRT(_id);

      if (!user) {
        throw new UnauthorizedException('User doesnt exist or unathenticated');
      }

      const { refreshToken: userRT } = user;
      if (!(await this.userService.isMatchHashed(refresh_token, userRT!))) {
        throw new UnauthorizedException('User doesnt exist or unathenticated');
      }

      const {
        name,
        role,
        email,
        age,
        gender,
        address,
        phone,
        provider,
        picture,
        emailVerifiedAt,
      } = user;
      const userRole = role as any as {
        _id: any;
        name: string;
      };
      const permissions = await this.roleService.getPermissionsForRole(
        userRole._id.toString(),
      );

      const id = _id.toString();
      const payload: IPayload = {
        sub: 'refresh',
        iss: 'from server',
        _id: id,
        email: email,
        name,
        role: userRole,
      };

      const RT = await this.createRefreshToken(payload);

      res.clearCookie('refresh_token');
      res.cookie('refresh_token', RT, {
        httpOnly: true,
        maxAge: this.configService.get('COOKIE_EXPIRE'),
      });

      await this.userService.updateUserTokenAndGetPublic(RT, _id.toString());
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          _id,
          name,
          role,
          email,
          age,
          gender,
          address,
          phone,
          provider,
          picture,
          emailVerifiedAt,
          permissions,
        },
      };
    } catch (error) {
      res.clearCookie('refresh_token');
      console.log('deleted lols 1');
      throw new UnauthorizedException('deleted lols 2' + error.message);
    }
  }
  async logout(res: Response, user: IUser) {
    try {
      res.clearCookie('refresh_token');
      await this.userService.updateUserTokenAndGetPublic(
        null,
        user._id.toString(),
      );
      return { message: 'Logout successful' };
    } catch (error) {
      throw new BadGatewayException(error.message);
    }
  }

  createMagicToken(_id: string) {
    const payload = {
      sub: 'magic token',
      iss: 'server',
      _id,
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('VERIFY_TOKEN_SECRET'),
      expiresIn: this.configService.getOrThrow('VERIFY_TOKEN_EXPIRE'),
    });
  }

  async register(userData: RegisterUserDto) {
    // check if user is existed
    try {
      const user = await this.userService.isEmailExist(userData.email);
      // create new user if email doesnt exist and send email
      if (!user) {
        let newUser = await this.userService.create(userData);
        this.sendMagicLink(newUser._id.toString(), newUser.name, newUser.email);
        return;
      }
      //if its was created by local throw exception
      if (user.provider.includes('local') && user.emailVerifiedAt) {
        throw new BadRequestException('Email already exists');
      }
      if (!user.provider.includes('local')) {
        await this.userService.mergeAccount(
          user._id.toString(),
          userData,
          'local',
        );
      }
      await this.sendMagicLink(user._id.toString(), user.name, user.email);
      return;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async sendMagicLink(id: string, name: string, email: string) {
    const token = await this.createMagicToken(id);
    const url = `${this.configService.getOrThrow('FE_BASE_URL')}/auth/verify#${token}`;
    const payload = {
      url,
      name,
      email,
    };

    await this.mail.toVerify(payload);
    return;
  }

  async getUser(user: IUser) {
    const permissions = await this.roleService.getPermissionsForRole(
      user.role._id,
    );
    const userInfo = await this.userService.findOne(user._id);

    return {
      ...userInfo,
      permissions,
    };
  }

  async verifyToken(token: string): Promise<IUser | null> {
    try {
      const res = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('VERIFY_TOKEN_SECRET'),
      });
      const { _id } = res;
      const date = new Date();
      await this.userService.verify(_id, new Date());
      const user = await this.userService.findOne(_id);

      return user;
    } catch (e) {
      throw new BadRequestException('Token hết hạn hoặc không hợp lệ');
    }
  }

  forgetPassword = async (email) => {
    const user = await this.userService.findOneByUsername(email);
    if (!user) {
      throw new BadRequestException('Email không tồn tại');
    }
    const token = await this.createMagicToken(user._id.toString());
    const url = `${this.configService.getOrThrow('FE_BASE_URL')}/auth/forget-password#${token}`;
    const payload = {
      url,
      name: user.name,
      email: user.email,
    };

    try {
      await this.mail.toForgetPassword(payload);
      return { message: 'Vui lòng kiểm tra email để đặt lại mật khẩu' };
    } catch (error) {
      throw new BadGatewayException(
        'Không thể gửi email, vui lòng thử lại sau',
      );
    }
  };

  resetPassword = async (id: string, password: string) => {
    const hashedPassword = await this.userService.getHash(password);
    const updatedUser = await this.userService.update(
      id,
      { password: hashedPassword },
      { _id: id } as IUser,
    );
    if (!updatedUser) {
      throw new BadGatewayException('Không thể cập nhật mật khẩu');
    }
    return;
  };
}
