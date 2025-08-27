import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { IUser } from 'src/users/users.interface';
import { IPayload } from '../auth.service';
import { RolesService } from 'src/roles/roles.service';
import { permission } from 'process';
import { BANNED_ROLE } from 'src/database/sample';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly roleService: RolesService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: IPayload) {
    const { _id, name, email, role } = payload;
    return {
      _id,
      email,
      name,
      role,
    };
  }
}
