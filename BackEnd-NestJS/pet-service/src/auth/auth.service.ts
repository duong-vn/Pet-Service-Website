import {
  BadGatewayException,
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

export interface IPayload {
  sub: string;
  iss: string;
  _id: any;
  name: string;
  email;
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
      email,
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
      _id,
      createdAt,
    };
  };

  async localLogin(res: Response, user: IUser) {
    const { _id, email, role, name, permissions } = user;
    const payload: IPayload = {
      sub: 'Local-login',
      iss: 'server',
      _id,
      name,
      email,
      role,
    };
    const refresh_token = await this.createRefreshToken(payload);

    await this.userService.updateUserToken(refresh_token, _id);

    res.clearCookie('refresh_token');
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: this.configService.getOrThrow('COOKIE_EXPIRE'),
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: { _id, name, email, role, permissions },
    };
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByUsername(username);
    if (user && user.password) {
      const isValid = await this.userService.isValidPassword(
        pass,
        user.password,
      );
      if (isValid) {
        // console.log('>>>role', role, 'type of role', typeof role);
        const userRole = user.role as any;
        const temp = await this.roleService.findOne(userRole._id);

        const objUser = {
          ...user.toObject(),
          permissions: temp?.permissions ?? [],
        };
        return objUser;
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

  async createRefreshToken(payload: IPayload) {
    const refresh_token = await this.jwtService.sign(payload, {
      privateKey: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRE'),
    });

    return refresh_token;
  }
  async processNewToken(refresh_token: string, res: Response) {
    try {
      await this.jwtService.verify(refresh_token, {
        secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
      });

      const user = await this.userService.findUserbyRefreshToken(refresh_token);

      if (!user) {
        throw new Error('User doesnt exist');
      }

      const { _id, name, role, email } = user;
      const userRole = role as any as {
        _id: string;
        name: string;
      };
      const temp = await this.roleService.findOne(userRole._id.toString());
      const id = _id.toString();
      const payload: IPayload = {
        sub: 'refresh',
        iss: 'from server',
        _id: id,
        name,
        role: userRole,
        email,
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
          email,
          role,
          permissions: temp?.permissions ?? [],
        },
      };
    } catch (Error) {
      throw new BadGatewayException('Something went wrong', Error.message);
    }
  }
  async logout(res: Response, user: IUser) {
    try {
      res.clearCookie('refresh_token');
      await this.userService.updateUserToken(null, user._id.toString());
      return { message: 'Logout successful' };
    } catch (error) {
      throw new BadGatewayException('Something went wrong', error.message);
    }
  }
}
