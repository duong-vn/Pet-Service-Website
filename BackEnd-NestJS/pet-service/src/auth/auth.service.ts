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
    const { _id, name, email, role, createdAt } = user;

    const payload: IPayload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      name,
      role,
    };

    const refresh_token = await this.createRefreshToken(payload);

    //update refresh_token in database
    await this.userService.updateUserToken(refresh_token, _id.toString());

    res.clearCookie('refresh_token');

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: this.configService.get('COOKIE_EXPIRE'),
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id,
        name,
        role,
      },
    };
  };

  async localLogin(res: Response, user: IUser) {
    const { _id, role, name } = user;

    const payload: IPayload = {
      sub: 'Local-login',
      iss: 'server',
      _id,
      name,
      role,
    };
    const payloadRT = {
      sub: 'Local-login',
      iss: 'server',
      _id,
    };
    const refresh_token = await this.createRefreshToken(payloadRT);

    await this.userService.updateUserToken(refresh_token, _id);

    res.clearCookie('refresh_token');
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: this.configService.getOrThrow('COOKIE_EXPIRE'),
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: { _id, name, role },
    };
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByUsername(username);
    if (user && user.password) {
      const isValid = await this.userService.isMatchHashed(pass, user.password);
      if (isValid) {
        // console.log('>>>role', role, 'type of role', typeof role);
        return user;
      }
    }
    return null;
  }

  async verifyGoogle(id_token: string): Promise<IGoogle> {
    const userInfo = await this.googleAuthService.verifyToken(id_token);

    if (!userInfo?.email || !userInfo?.name) {
      throw new UnauthorizedException('Invalid google token');
    }
    return userInfo;
  }

  async findOrCreateUser(userInfo: IGoogle) {
    let user = await this.userService.findOneByUsername(userInfo.email);
    if (user) {
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
      privateKey: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
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

      const user = await this.userService.findOne(_id);

      if (!user) {
        throw new UnauthorizedException('User doesnt exist or unathenticated');
      }
      const { refreshToken: userRT } = user;
      if (!(await this.userService.isMatchHashed(refresh_token, userRT!))) {
        throw new UnauthorizedException('User doesnt exist or unathenticated');
      }

      const { name, role } = user;
      const userRole = role as any as {
        _id: any;
        name: string;
      };

      const id = _id.toString();
      const payload: IPayload = {
        sub: 'refresh',
        iss: 'from server',
        _id: id,
        name,
        role: userRole,
      };

      this.createRefreshToken(payload);

      res.clearCookie('refresh_token');
      res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        maxAge: this.configService.get('COOKIE_EXPIRE'),
      });

      await this.userService.updateUserToken(refresh_token, _id.toString());
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          _id,
          name,
          role,
        },
      };
    } catch (Error) {
      throw new BadRequestException(Error.message);
    }
  }
  async logout(res: Response, user: IUser) {
    try {
      res.clearCookie('refresh_token');
      await this.userService.updateUserToken(null, user._id.toString());
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
        const token = await this.createMagicToken(newUser._id.toString());
        const url = `${this.configService.getOrThrow('FE_BASE_URL')}/auth/verify#${token}`;
        const payload = {
          url,
          name: newUser.name,
          email: newUser.email,
        };

        await this.mail.toVerify(payload);
        return;
      }
      if (!user.emailVerifiedAt) {
        await this.userService.mergeAccount(user._id.toString(), userData);
        const token = await this.createMagicToken(user._id.toString());
        const url = `${this.configService.getOrThrow('FE_BASE_URL')}/auth/verify#${token}`;
        const payload = {
          url,
          name: user.name,
          email: user.email,
        };

        await this.mail.toVerify(payload);
        return;
      }
      //if its was created by local throw exception
      if (user.provider == 'local') {
        throw new BadRequestException('Email already exists');
      }

      return await this.userService.mergeAccount(user._id.toString(), userData);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
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
}
