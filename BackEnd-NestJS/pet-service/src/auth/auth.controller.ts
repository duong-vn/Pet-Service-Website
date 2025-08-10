import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import type { Request, Response } from 'express';
import type { IUser } from 'src/users/users.interface';
import { use } from 'passport';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  @Public()
  @ResponseMessage('Google Login')
  @Post('/login/google')
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
  login(@Res({ passthrough: true }) res: Response, @User() user: IUser) {
    return this.authService.localLogin(res, user);
  }
  // @Public()
  // @ResponseMessage('Test env')
  // @Post('env')
  // Test() {
  //   return this.configService.getOrThrow('');
  // }

  @Get('get-user')
  test(@User() user: IUser) {
    return user;
  }
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response, @User() user: IUser) {
    return this.authService.logout(res, user);
  }

  @Public()
  @ResponseMessage('Get refresh token')
  @Post('refresh')
  refresh(
    @Req()
    req: Request,

    @Res({ passthrough: true }) res: Response,
  ) {
    const refresh_token = req.cookies['refresh_token'];
    return this.authService.processNewToken(refresh_token, res);
  }

  @Public()
  @ResponseMessage('Register')
  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }
}
