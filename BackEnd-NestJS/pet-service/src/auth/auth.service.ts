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
import mongoose, { ObjectId } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private configService: ConfigService,
    private googleAuthService: GoogleAuthService,
  ) {}

  googleLogin = async (id_token: string, res: Response) => {
    const userInfo = await this.verifyGoogle(id_token);

    const user = await this.findOrCreateUser(userInfo);

    const { _id, name, email, createdAt } = user;

    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      name,
      email,
    };

    const refresh_token = await this.createRefreshToken(payload);

    //update refresh_token in database
    await this.userService.updateUserToken(refresh_token, _id.toString());

    res.cookie('refresh_token', refresh_token, {
      secure: true,
      maxAge: this.configService.get('COOKIE_EXPIRE'),
    });

    return {
      access_token: this.jwtService.sign(payload),
      _id,
      createdAt,
    };
  };

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
      return user;
    }
    user = await this.userService.createGoogleUser(userInfo);
    return user;
  }

  async createRefreshToken(payload) {
    const refresh_token = await this.jwtService.sign(payload, {
      privateKey: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRE'),
    });

    return refresh_token;
  }
}
