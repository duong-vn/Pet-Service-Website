import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import type { Response } from 'express';
import type { IUser } from 'src/users/users.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  @Public()
  @ResponseMessage('Google Login')
  @Post('/login/google')
  login(
    @Body('id_token') tokenId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.googleLogin(tokenId, res);
  }

  @Get('test')
  test(@User() user: IUser) {
    return user;
  }
}
