import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import type { Request, Response } from 'express';
import type { IUser } from 'src/users/users.interface';

import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import {
  Throttle,
  ThrottlerException,
  ThrottlerGuard,
} from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  @Public()
  @ResponseMessage('Google Login')
  @Post('/login/google')
  @HttpCode(200)
  loginGoogle(
    @Body('id_token') tokenId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.googleLogin(tokenId, res);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Local Login')
  @Post('/login/local')
  @HttpCode(200)
  login(@Res({ passthrough: true }) res: Response, @User() user: IUser) {
    return this.authService.localLogin(res, user);
  }

  @Get('get-user')
  @HttpCode(200)
  test(@User() user: IUser) {
    return this.authService.getUser(user);
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response, @User() user: IUser) {
    return this.authService.logout(res, user);
  }
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @Public()
  @ResponseMessage('Get refresh token')
  @Post('refresh')
  @HttpCode(200)
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refresh_token = req.cookies['refresh_token'];

    return this.authService.processNewToken(refresh_token, res);
  }

  @Public()
  @ResponseMessage('Verify successfuly')
  @HttpCode(200)
  @Post('verify-token')
  async verify(
    @Body('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.verifyToken(token);
    if (!user) throw Error('Cannot find user');
    return this.authService.localLogin(res, user);
  }

  @Public()
  @ResponseMessage('Register')
  @Post('register')
  @HttpCode(201)
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }
}
